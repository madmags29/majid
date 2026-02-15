import express from 'express';
import { generateItinerary, generateSuggestions, updateItinerary } from '../services/ai';
import { createClient } from 'pexels';
import Cache from '../models/Cache';
import { getFlightPrices, getHotelPrices } from '../services/travelpayouts';

const router = express.Router();

export async function enrichmentWithTravelData(itinerary: any, origin?: string, destination?: string) {
    const travelPromises: Promise<any>[] = [];

    if (origin && destination) {
        travelPromises.push(
            getFlightPrices(origin, destination)
                .then((data: any) => {
                    if (data && data.success && data.data) {
                        const flights = Object.values(data.data);
                        if (flights.length > 0) {
                            itinerary.trip_details.verified_flights = flights;
                        }
                    }
                })
        );
    }

    if (destination) {
        travelPromises.push(
            getHotelPrices(destination)
                .then((data: any) => {
                    if (data && Array.isArray(data)) {
                        itinerary.trip_details.verified_hotels = data;
                    }
                })
        );
    }

    await Promise.all(travelPromises);
    return itinerary;
}

export async function enrichmentWithImages(itinerary: any) {
    if (process.env.PEXELS_API_KEY) {
        const client = createClient(process.env.PEXELS_API_KEY);
        const imagePromises: Promise<void>[] = [];

        itinerary.days.forEach((day: any) => {
            day.activities.forEach((activity: any) => {
                // If activity already has an image, skip unless it's a new activity (we could also force refresh if image_query changed)
                if (activity.image_query && !activity.imageUrl) {
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
    return itinerary;
}

router.post('/search', async (req, res) => {
    try {
        const { destination, days, interests, origin } = req.body;

        if (!destination) {
            return res.status(400).json({ error: 'Destination is required' });
        }

        // Parse days from destination string if not explicitly provided or if provided as 2
        let requestedDays = days;
        const daysMatch = destination.match(/(\d+)\s*day/i);
        if (daysMatch) {
            requestedDays = parseInt(daysMatch[1]);
        } else if (!requestedDays) {
            requestedDays = 2;
        }

        const cacheKey = `itinerary/v9:${destination.toLowerCase()}:${requestedDays}${interests ? `:${interests}` : ''}${origin ? `:${origin.trim()}` : ''}`;

        // Check cache first
        const cachedResult = await Cache.findOne({ key: cacheKey });
        if (cachedResult && cachedResult.expiresAt > new Date()) {
            console.log(`Cache hit for: ${cacheKey}`);
            return res.json(cachedResult.value);
        }

        console.log(`Cache miss for: ${cacheKey}. Generating new itinerary...`);

        // 1. Generate Itinerary
        const itinerary = await generateItinerary(destination, requestedDays, interests, req.body.origin);

        // 2. Fetch Images for Activities
        await enrichmentWithImages(itinerary);

        // 3. Enrich with real travel data
        await enrichmentWithTravelData(itinerary, origin, destination);

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

router.post('/chat', async (req, res) => {
    try {
        const { currentItinerary, userRequest } = req.body;

        if (!currentItinerary || !userRequest) {
            return res.status(400).json({ error: 'Current itinerary and user request are required' });
        }

        // 1. Update Itinerary using AI
        const updatedItinerary = await updateItinerary(currentItinerary, userRequest);

        // 2. Fetch Images for any new Activities
        await enrichmentWithImages(updatedItinerary);

        // 3. Enrich with real travel data
        await enrichmentWithTravelData(updatedItinerary, currentItinerary.origin, currentItinerary.destination);

        res.json(updatedItinerary);
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Failed to update itinerary' });
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
