import axios from 'axios';
import OpenAI from 'openai';
import BlogKeyword from '../models/BlogKeyword';
import BlogPost from '../models/BlogPost';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

export const generateBlogSlug = (title: string) => {
    return title
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
};

export const fetchPexelsImages = async (query: string, count: number = 5) => {
    try {
        const response = await axios.get(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}`, {
            headers: {
                Authorization: PEXELS_API_KEY
            }
        });
        return (response.data as any).photos.map((photo: any) => photo.src.large2x);
    } catch (error) {
        console.error('Error fetching Pexels images:', error);
        return [];
    }
};

export const generateBlogContent = async (keyword: string) => {
    const prompt = `
    Write a comprehensive, SEO-optimized travel blog post for the keyword: "${keyword}".
    The article should be between 1200-2000 words.
    
    Structure the response as a JSON object with the following fields:
    - title: Catchy SEO title (H1)
    - metaTitle: SEO optimized meta title
    - metaDescription: Engaging meta description (max 160 chars)
    - introduction: Compelling introduction
    - sections: An array of 5-8 objects, each with 'heading' (H2/H3) and 'content' (detailed paragraphs)
    - travelTips: An array of useful tips for travelers
    - faqs: An array of 3-5 objects with 'question' and 'answer'
    - conclusion: Final thoughts
    - readingTime: Estimated reading time (e.g., "8 min read")

    Guidelines:
    - Use a professional yet adventurous tone.
    - Focus on practical information and hidden gems.
    - Ensure the content is structured for readability.
    - Use Markdown for section content if needed.
    `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are an expert travel writer and SEO specialist." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
        });

        const content = JSON.parse(response.choices[0].message.content || '{}');
        return content;
    } catch (error) {
        console.error('Error generating AI content:', error);
        throw error;
    }
};

export const seedInitialKeywords = async () => {
    const keywords = [
        "Best weekend trips from Delhi", "Hidden places near Delhi", "Best hill stations near Delhi",
        "Budget weekend trips India", "Best road trips from Delhi", "Best trekking places near Delhi",
        "Camping places near Delhi", "Romantic weekend geatways near Delhi", "Best winter destinations India",
        "Best monsoon destinations India", "Best summer hill stations India", "Best solo travel destinations India",
        "Best adventure trips India", "Best scenic drives India", "Best waterfalls near Delhi",
        "Best national parks near Delhi", "Delhi to Rishikesh road trip", "Delhi to Jaipur road trip",
        "Delhi to Manali road trip", "Delhi to Shimla road trip", "Weekend travel packing checklist",
        "How to plan a weekend trip", "Budget travel tips India", "Top hidden travel destinations India",
        "Ultimate India travel guide", "Luxury weekend getways India", "Pet-friendly trips near Delhi",
        "Family weekend destinations India", "Best spiritual retreats India", "Wildlife safaris near Delhi",
        "Heritage walks in Delhi", "Best cafes in Rishikesh", "Shimla vs Manali for weekend",
        "Jaipur shopping guide", "Rishikesh river rafting tips", "Best time to visit Kerala",
        "Goa off-season travel guide", "Backpacking Northeast India", "Hampi travel itinerary",
        "Pondicherry French colonial guide", "Spiti Valley road trip tips", "Leh Ladakh solo trip guide",
        "Varanasi spiritual experience", "Kashmir Great Lakes trek guide", "Andaman islands honeymoon tips",
        "Weekend getaway from Bangalore", "Hill stations near Mumbai", "Short trips from Chennai",
        "Hidden gems in Kerala", "Exploring Rajasthan in a weekend", "Best treks in Sahyadris",
        "Coastal road trip from Mumbai to Goa", "Waterfall hopping in North Karnataka", "Spiritual weekend in Varanasi",
        "Pondicherry weekend itinerary", "Wine tasting in Nashik", "Bird watching in Bharatpur",
        "Ancient ruins of Hampi in 48 hours", "Mysore weekend guide", "Coorg coffee plantation stay",
        "Ooty vs Kodaikanal for weekend", "Mahabaleshwar monsoon guide", "Lonavala weekend trip",
        "Alibaug beach getaway", "Kasauli weekend trip from Chandigarh", "Lansdowne peaceful getaway",
        "Binsar wildlife and views", "Mukteshwar adventure guide", "Chopta Tungnath trek for beginners",
        "Bir Billing paragliding weekend", "Tirthan valley hidden spots", "Jibhi weekend itinerary",
        "Kasol vs Tosh for solo travelers", "McLeod Ganj spiritual weekend", "Dalhousie colonial charm",
        "Auli skiing weekend", "Nainital vs Bhimtal", "Jim Corbett safari weekend",
        "Mussoorie weekend crowd hacks", "Kanatal camping guide", "Dhanaulti snow weekend"
    ];

    try {
        for (const kw of keywords) {
            await BlogKeyword.findOneAndUpdate(
                { keyword: kw },
                { keyword: kw, used: false },
                { upsert: true }
            );
        }
        console.log('Seeded initial blog keywords');
    } catch (error) {
        console.error('Error seeding keywords:', error);
    }
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const automateDailyPublish = async (count: number = 5) => {
    console.log(`Starting automated daily publish for ${count} posts...`);
    const results = [];

    for (let i = 0; i < count; i++) {
        try {
            const nextKeyword = await BlogKeyword.findOne({ used: false });
            if (!nextKeyword) {
                console.log('No more unused keywords found');
                break;
            }

            console.log(`[${i + 1}/${count}] Generating post for: ${nextKeyword.keyword}`);
            
            const content = await generateBlogContent(nextKeyword.keyword);
            const images = await fetchPexelsImages(nextKeyword.keyword, 6);
            
            if (!content || images.length === 0) {
                console.error(`Failed to generate content or images for: ${nextKeyword.keyword}`);
                continue;
            }

            const newPost = new BlogPost({
                title: content.title,
                slug: generateBlogSlug(content.title),
                metaTitle: content.metaTitle,
                metaDescription: content.metaDescription,
                content: JSON.stringify(content),
                heroImage: images[0],
                images: images.slice(1),
                keyword: nextKeyword.keyword,
                faqs: content.faqs,
                readingTime: content.readingTime
            });

            await newPost.save();
            nextKeyword.used = true;
            await nextKeyword.save();

            console.log(`Successfully published: ${content.title}`);
            results.push(newPost);

            // Wait 10 seconds between posts to respect rate limits
            if (i < count - 1) {
                console.log('Waiting 10 seconds before next generation...');
                await delay(10000);
            }
        } catch (error) {
            console.error(`Error in automated publish loop at index ${i}:`, error);
        }
    }

    console.log(`Daily publish job completed. Generated ${results.length} posts.`);
    return results;
};
