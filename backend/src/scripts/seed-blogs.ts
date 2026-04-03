import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { seedInitialKeywords, automateDailyPublish } from '../services/blogService';

dotenv.config();

async function runSeeding() {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
        console.error('MONGODB_URI is not defined');
        process.exit(1);
    }

    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        console.log('Updating keywords...');
        await seedInitialKeywords();

        const count = 55; // Generate 55 posts to be safe
        console.log(`Starting bulk generation of ${count} blog posts...`);
        console.log('This may take 30-60 minutes. Please keep the terminal open.');

        for (let i = 1; i <= count; i++) {
            console.log(`--- Generating Post ${i}/${count} ---`);
            const postArray = await automateDailyPublish(1);
            if (postArray && postArray.length > 0) {
                const post = postArray[0];
                console.log(`[Success] Generated: ${post.title}`);
            } else {
                console.log(`[Skipped/Failed] Post ${i} could not be generated.`);
            }
            
            // Wait for 2 seconds to avoid aggressive rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        console.log('Bulk generation complete!');
        process.exit(0);
    } catch (error) {
        console.error('Bulk seeding failed:', error);
        process.exit(1);
    }
}

runSeeding();
