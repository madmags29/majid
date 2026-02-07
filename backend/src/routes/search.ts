import express from 'express';
import { generateItinerary } from '../services/ai';
import { createClient } from 'pexels';

const router = express.Router();

router.post('/search', async (req, res) => {
    try {
        const { destination, days, interests } = req.body;

        if (!destination) {
            return res.status(400).json({ error: 'Destination is required' });
        }

        // 1. Generate Itinerary
        const itinerary = await generateItinerary(destination, days, interests);

        // 2. Fetch Images for Activities
        if (process.env.PEXELS_API_KEY) {
            const client = createClient(process.env.PEXELS_API_KEY);
            const imagePromises: Promise<void>[] = [];

            itinerary.days.forEach((day: any) => {
                day.activities.forEach((activity: any) => {
                    if (activity.image_query) {
                        const promise = client.photos.search({ query: activity.image_query, per_page: 1, orientation: 'landscape', size: 'medium' })
                            .then((response: any) => {
                                if ('photos' in response && response.photos.length > 0) {
                                    activity.imageUrl = response.photos[0].src.medium;
                                }
                            })
                            .catch(err => console.error(`Failed to fetch image for ${activity.image_query}`, err));

                        imagePromises.push(promise);
                    }
                });
            });

            await Promise.all(imagePromises);
        }

        res.json(itinerary);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Failed to generate itinerary' });
    }
});

export default router;
