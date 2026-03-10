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
        "Varanasi spiritual experience", "Kashmir Great Lakes trek guide", "Andaman islands honeymoon tips"
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

export const automateDailyPublish = async () => {
    try {
        const nextKeyword = await BlogKeyword.findOne({ used: false });
        if (!nextKeyword) {
            console.log('No unused keywords found for auto-publishing');
            return;
        }

        console.log(`Starting auto-publish for keyword: ${nextKeyword.keyword}`);
        
        const content = await generateBlogContent(nextKeyword.keyword);
        const images = await fetchPexelsImages(nextKeyword.keyword, 6);
        
        if (!content || images.length === 0) {
            throw new Error('Failed to generate content or fetch images');
        }

        const newPost = new BlogPost({
            title: content.title,
            slug: generateBlogSlug(content.title),
            metaTitle: content.metaTitle,
            metaDescription: content.metaDescription,
            content: JSON.stringify(content), // Storing structured content for easier rendering
            heroImage: images[0],
            images: images.slice(1),
            keyword: nextKeyword.keyword,
            faqs: content.faqs,
            readingTime: content.readingTime
        });

        await newPost.save();
        nextKeyword.used = true;
        await nextKeyword.save();

        console.log(`Successfully published blog post: ${content.title}`);
        return newPost;
    } catch (error) {
        console.error('Auto-publish failed:', error);
    }
};
