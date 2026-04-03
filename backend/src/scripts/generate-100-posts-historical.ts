import dotenv from 'dotenv';
import path from 'path';

// Load environment variables.
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

import mongoose from 'mongoose';
import { automateDailyPublish, seedInitialKeywords } from '../services/blogService';
import BlogKeyword from '../models/BlogKeyword';
import BlogPost from '../models/BlogPost';

const extraKeywords = [
    // 30 Additional keywords to ensure we cross 100+ posts
    "Weekend trip to Darjeeling", "Places to visit near Ooty", "Kerala floating markets",
    "Goa secret beaches", "Himalayan long weekends", "Spiritual retreats in Uttarakhand",
    "Best homestays in Sikkim", "Backpacking around Meghalaya", "Weekend escapes from Hyderabad",
    "Gokarna beach hopping", "Kullu Manali winter guide", "Best street food walks in Delhi",
    "Mumbai local trains guide", "Rajasthan forts in a weekend", "Desert camping in Jaisalmer",
    "Agra Taj Mahal romantic getaway", "Best sunset points in India", "Luxury trains in India",
    "Skiing in Gulmarg", "Pahalgam river rafting", "Houseboats in Srinagar",
    "Best diving spots in Andaman", "Surfing in Varkala", "Mysore Palace night view",
    "Yoga centers in Rishikesh", "Best trekking gear India", "How to travel light",
    "Backpacking with pets", "India monsoons best places", "Photography spots in Jaipur",
    "Weekend getaway to Mount Abu", "Rann of Kutch festival"
];

function randomDate(start: Date, end: Date) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('MONGODB_URI not set');
        process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);

    // 1. Seed original keywords
    await seedInitialKeywords();

    // 2. Add extra keywords to hit the 100+ requirement
    console.log('Adding extra keywords to ensure 100+ target...');
    let extraCount = 0;
    for (const kw of extraKeywords) {
        const exist = await BlogKeyword.findOne({ keyword: kw });
        if (!exist) {
            await BlogKeyword.create({ keyword: kw, used: false });
            extraCount++;
        }
    }
    console.log(`Added ${extraCount} additional keywords.`);

    // 3. Find out how many posts are needed to get to 105 total active posts
    const currentPostsCount = await BlogPost.countDocuments();
    const targetPosts = 105;
    const toGenerate = Math.max(0, targetPosts - currentPostsCount);

    if (toGenerate === 0) {
        console.log('You already have 105+ posts in the database!');
        process.exit(0);
    }

    console.log(`Currently have ${currentPostsCount} posts. Generating ${toGenerate} more to hit 100+...`);
    console.log('This will take UP TO 1 HOUR (API generation + Pexels delay). Let it run in the background.');

    const results = await automateDailyPublish(toGenerate);

    console.log(`\n✅ Generated ${results.length} blog posts. Now patching dates...`);
    
    // 4. Update the newly created posts with random dates within the last year
    const now = new Date();
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

    for (const post of results) {
        const randDate = randomDate(oneYearAgo, now);
        await BlogPost.findByIdAndUpdate(post._id, {
            publishedDate: randDate,
            createdAt: randDate
        });
    }

    console.log(`✅ All ${results.length} new posts have been assigned random historical dates.`);

    await mongoose.disconnect();
    process.exit(0);
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
