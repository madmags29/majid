import express from 'express';
import { createClient } from 'pexels';

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
            // Usually the HD version (1280x720 or 1920x1080) is good
            const videoFile = video.video_files.find(f => f.quality === 'hd' && (f.width || 0) >= 1280) || video.video_files[0];

            return res.json({
                url: videoFile.link,
                photographer: video.user.name,
                photographer_url: video.user.url
            });
        }

        res.status(404).json({ error: 'No videos found' });
    } catch (error) {
        console.error('Pexels API error:', error);
        res.status(500).json({ error: 'Failed to fetch video' });
    }
});

export default router;
