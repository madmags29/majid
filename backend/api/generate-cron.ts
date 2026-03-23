import type { VercelRequest, VercelResponse } from '@vercel/node';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Reuse MongoDB connection across invocations
let isConnected = false;

async function connectDB() {
    if (isConnected) return;
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI is not defined');
    await mongoose.connect(uri);
    isConnected = true;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow GET (Vercel Cron uses GET)
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Verify the request is from Vercel Cron
    const authHeader = req.headers['authorization'];
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        await connectDB();

        // Dynamic import to avoid loading everything at module level
        const { automateDailyPublish } = await import('../src/services/blogService');

        console.log('Vercel Cron: Starting blog auto-publish...');
        const results = await automateDailyPublish(1); // 1 post per run to stay within timeout

        return res.status(200).json({
            success: true,
            message: `Generated ${results.length} blog post(s)`,
            posts: results.map((p: any) => ({ title: p.title, slug: p.slug })),
        });
    } catch (error: any) {
        console.error('Vercel Cron: Blog auto-publish failed:', error);
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}
