/**
 * One-off script to generate 10 blog posts.
 * Run: npx ts-node src/scripts/generate-10-posts.ts
 */
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the root .env file, ensuring they override any existing ones
dotenv.config({ 
    path: path.resolve(__dirname, '../../.env'),
    override: true 
});

import mongoose from 'mongoose';
import { automateDailyPublish, seedInitialKeywords } from '../services/blogService';

async function main() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('MONGODB_URI not set');
        process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('Connected.');

    // Ensure keywords are seeded
    await seedInitialKeywords();

    console.log('Starting generation of 10 blog posts...');
    console.log('This will take several minutes (10s delay between posts + AI generation time).\n');

    const results = await automateDailyPublish(10);

    console.log(`\n✅ Done! Generated ${results.length} blog posts:`);
    results.forEach((post: any, i: number) => {
        console.log(`  ${i + 1}. ${post.title} (/${post.slug})`);
    });

    await mongoose.disconnect();
    process.exit(0);
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
