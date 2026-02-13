import express from 'express';
import { generateItinerary, generateDeepExploreContent } from '../services/ai';
import { createClient } from 'pexels';
import Cache from '../models/Cache';
import { enrichmentWithImages, enrichmentWithTravelData } from './search';

const router = express.Router();

router.get('/explore', async (req, res) => {
    try {
        const { slug } = req.query;

        if (!slug) {
            return res.status(400).json({ error: 'Slug is required' });
        }

        // Convert slug to name (e.g. europe/france/paris -> Paris, France, Europe)
        const destinationName = (slug as string)
            .split('/')
            .reverse()
            .map(part => part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' '))
            .join(', ');

        const cacheKey = `explore:v1:${(slug as string).toLowerCase()}`;

        // Check cache
        const cachedResult = await Cache.findOne({ key: cacheKey });
        if (cachedResult && cachedResult.expiresAt > new Date()) {
            return res.json(cachedResult.value);
        }

        console.log(`Cache miss for: ${cacheKey}. Generating deep content for ${destinationName}...`);

        // Phase 1: Standard Itinerary
        const itinerary = await generateItinerary(destinationName);

        // Phase 2: Long-form Descriptive Content (SEO)
        const deepContent = await generateDeepExploreContent(destinationName);

        // Phase 3: Enrichment
        await enrichmentWithImages(itinerary);
        await enrichmentWithTravelData(itinerary, undefined, destinationName);

        const result = {
            ...itinerary,
            deep_content: deepContent,
            slug: slug
        };

        // Store in cache for 30 days
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        await Cache.findOneAndUpdate(
            { key: cacheKey },
            { value: result, expiresAt },
            { upsert: true, new: true }
        );

        res.json(result);
    } catch (error) {
        console.error('Explore error:', error);
        res.status(500).json({ error: 'Failed to generate destination content' });
    }
});

export default router;
