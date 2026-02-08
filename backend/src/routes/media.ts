import express from 'express';
import { createClient } from 'pexels';
import Cache from '../models/Cache';

const router = express.Router();

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

if (!PEXELS_API_KEY) {
    console.error('PEXELS_API_KEY is not defined in .env file');
}

const client = createClient(PEXELS_API_KEY || '');

router.get('/background-video', async (req, res) => {
    try {
        if (!PEXELS_API_KEY) {
            return res.status(500).json({ error: 'Pexels API key missing' });
        }

        const cacheKey = 'background_video';

        // Check cache
        const cachedResult = await Cache.findOne({ key: cacheKey });
        if (cachedResult && cachedResult.expiresAt > new Date()) {
            console.log(`Cache hit for: ${cacheKey}`);
            return res.json(cachedResult.value);
        }

        // Search for videos - alternating between nature travel and monuments
        const queries = [
            'nature travel slow motion cinematic',
            'monuments landmarks timelapse',
            'famous buildings architecture',
            'tourist attractions world'
        ];
        const randomQuery = queries[Math.floor(Math.random() * queries.length)];

        const response = await client.videos.search({ query: randomQuery, per_page: 5, orientation: 'landscape', size: 'medium' });

        if ('videos' in response && response.videos.length > 0) {
            // Pick a random video from the results
            const randomIndex = Math.floor(Math.random() * response.videos.length);
            const video = response.videos[randomIndex];

            // Get the highest quality video file suitable for web background
            const videoFile = video.video_files.find(f => f.quality === 'hd' && (f.width || 0) >= 1280) || video.video_files[0];

            const result = {
                url: videoFile.link,
                photographer: video.user.name,
                photographer_url: video.user.url
            };

            // Store in cache for 4 hours
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 4);

            await Cache.findOneAndUpdate(
                { key: cacheKey },
                { value: result, expiresAt },
                { upsert: true, new: true }
            );

            return res.json(result);
        }

        res.status(404).json({ error: 'No videos found' });
    } catch (error) {
        console.error('Pexels API error:', error);
        res.status(500).json({ error: 'Failed to fetch video' });
    }
});

export default router;
