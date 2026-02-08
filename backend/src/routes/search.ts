import express from 'express';
import { generateItinerary, generateSuggestions } from '../services/ai';
import { createClient } from 'pexels';
import Cache from '../models/Cache';

const router = express.Router();

router.post('/search', async (req, res) => {
    try {
        const { destination, days, interests, origin } = req.body;

        if (!destination) {
            return res.status(400).json({ error: 'Destination is required' });
        }

        const cacheKey = `itinerary/v5:${destination.toLowerCase()}:${days || 2}${interests ? `:${interests}` : ''}${origin ? `:${origin.trim()}` : ''}`;

        // Check cache first
        const cachedResult = await Cache.findOne({ key: cacheKey });
        if (cachedResult && cachedResult.expiresAt > new Date()) {
            console.log(`Cache hit for: ${cacheKey}`);
            return res.json(cachedResult.value);
        }

        console.log(`Cache miss for: ${cacheKey}. Generating new itinerary...`);

        // 1. Generate Itinerary
        const itinerary = await generateItinerary(destination, days, interests, req.body.origin);

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

        // Store in cache for 24 hours
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        await Cache.findOneAndUpdate(
            { key: cacheKey },
            { value: itinerary, expiresAt },
            { upsert: true, new: true }
        );

        res.json(itinerary);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Failed to generate itinerary' });
    }
});

router.get('/suggestions', async (req, res) => {
    try {
        const { location } = req.query;

        if (!location) {
            return res.status(400).json({ error: 'Location is required' });
        }

        const cacheKey = `suggestions:v1:${location.toString().toLowerCase()}`;

        // Check cache
        const cachedResult = await Cache.findOne({ key: cacheKey });
        if (cachedResult && cachedResult.expiresAt > new Date()) {
            return res.json(cachedResult.value);
        }

        const suggestions = await generateSuggestions(location.toString());

        // Store in cache for 7 days
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await Cache.findOneAndUpdate(
            { key: cacheKey },
            { value: suggestions, expiresAt },
            { upsert: true, new: true }
        );

        res.json(suggestions);
    } catch (error) {
        console.error('Suggestions error:', error);
        res.status(500).json({ error: 'Failed to generate suggestions' });
    }
});

export default router;
