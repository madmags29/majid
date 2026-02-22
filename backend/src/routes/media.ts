import express from 'express';
import Cache from '../models/Cache';

const router = express.Router();

const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;

if (!PIXABAY_API_KEY) {
    console.error('PIXABAY_API_KEY is not defined in .env file');
}

// Helper to fetch videos for a query from Pixabay
async function fetchVideosForQuery(query: string): Promise<any[]> {
    try {
        const encodedQuery = encodeURIComponent(query);
        const url = `https://pixabay.com/api/videos/?key=${PIXABAY_API_KEY}&q=${encodedQuery}&per_page=8&safesearch=true`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.hits && data.hits.length > 0) {
            return data.hits.map((video: any) => {
                // Find best quality file (large or medium)
                const fallbackUrl = video.videos.medium.url;
                const bestUrl = video.videos.large.url || fallbackUrl;

                return {
                    url: bestUrl,
                    photographer: video.user,
                    photographer_url: `https://pixabay.com/users/${video.user}-${video.user_id}/`
                };
            });
        }
        return [];
    } catch (error) {
        console.error(`Error fetching Pixabay videos for query "${query}":`, error);
        return [];
    }
}

router.get('/background-video', async (req, res) => {
    try {
        if (!PIXABAY_API_KEY) {
            console.error('CRITICAL: PIXABAY_API_KEY is missing');
            return res.status(500).json({ error: 'Server configuration error: Pixabay API key missing' });
        }

        const cacheKey = 'background_video_pool';
        const VIDEO_POOL_SIZE_LIMIT = 50;

        // 1. Try to get the pool from cache
        let videoPool = [];
        const cachedPool = await Cache.findOne({ key: cacheKey });

        if (cachedPool && cachedPool.expiresAt > new Date()) {
            // Cache hit
            videoPool = cachedPool.value;
        } else {
            // Cache miss/expired - Refresh the pool
            console.log('Refreshing video pool from Pixabay...');

            // Expanded queries based on user request
            const queries = [
                'cinematic travel slow motion',
                'famous monuments timelapse',
                'beautiful landscapes drone',
                'world landmarks 4k',
                'luxury destinations',
                'ancient ruins history',
                'city night timelapse'
            ];

            // Run queries in parallel
            const results = await Promise.all(queries.map(q => fetchVideosForQuery(q)));

            // Flatten and shuffle
            videoPool = results.flat().sort(() => Math.random() - 0.5);

            // Limit pool size to save cache space/memory if needed, but 50 small objects is fine
            if (videoPool.length > VIDEO_POOL_SIZE_LIMIT) {
                videoPool = videoPool.slice(0, VIDEO_POOL_SIZE_LIMIT);
            }

            if (videoPool.length > 0) {
                // Cache the pool for 12 hours
                const expiresAt = new Date();
                expiresAt.setHours(expiresAt.getHours() + 12);

                await Cache.findOneAndUpdate(
                    { key: cacheKey },
                    { value: videoPool, expiresAt },
                    { upsert: true, new: true }
                );
            }
        }

        // 2. Select a random video from the pool to return
        if (videoPool.length > 0) {
            const randomVideo = videoPool[Math.floor(Math.random() * videoPool.length)];

            // Add a cache header to tell the browser NOT to cache this response response, 
            // or strict revalidation, so every refresh hits this endpoint to get a new random video.
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');

            return res.json(randomVideo);
        }

        res.status(404).json({ error: 'No videos found' });
    } catch (error: any) {
        console.error('Pexels API error:', error);
        res.status(500).json({
            error: 'Failed to fetch video',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

export default router;
