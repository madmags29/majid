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

        const cacheKey = `explore:v2:${(slug as string).toLowerCase()}`;

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

        // Phase 4: Hero Media (Video/Photo)
        let heroVideo = null;
        let heroImage = null;

        if (process.env.PEXELS_API_KEY) {
            const pexelsClient = createClient(process.env.PEXELS_API_KEY);
            try {
                // Try fetching videos first
                const videoRes: any = await pexelsClient.videos.search({ query: destinationName, per_page: 1, orientation: 'landscape' });
                if ('videos' in videoRes && videoRes.videos.length > 0) {
                    const video = videoRes.videos[0];
                    const file = video.video_files.find((f: any) => f.quality === 'hd' || f.quality === 'sd') || video.video_files[0];
                    heroVideo = {
                        url: file.link,
                        photographer: video.user.name,
                        photographer_url: video.user.url
                    };
                }

                // Always fetch a high-res image as fallback or for static parts
                const imageRes: any = await pexelsClient.photos.search({ query: destinationName, per_page: 1, orientation: 'landscape', size: 'large' });
                if ('photos' in imageRes && imageRes.photos.length > 0) {
                    const photo = imageRes.photos[0];
                    heroImage = {
                        url: photo.src.large2x || photo.src.original,
                        photographer: photo.photographer,
                        photographer_url: photo.photographer_url
                    };
                }
            } catch (err) {
                console.error('Failed to fetch hero media:', err);
            }
        }

        const result = {
            ...itinerary,
            days: itinerary.days || itinerary.itinerary,
            deep_content: deepContent,
            slug: slug,
            heroVideo,
            heroImage
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
