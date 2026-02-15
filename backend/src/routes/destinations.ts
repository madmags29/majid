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

        // Parallelize all independent tasks: AI generation and Media fetching
        const [itinerary, deepContent, heroMedia] = await Promise.all([
            generateItinerary(destinationName),
            generateDeepExploreContent(destinationName),
            (async () => {
                if (!process.env.PEXELS_API_KEY) return { video: null, image: null };
                const pexelsClient = createClient(process.env.PEXELS_API_KEY);
                try {
                    const [videoRes, imageRes] = await Promise.all([
                        pexelsClient.videos.search({ query: destinationName, per_page: 1, orientation: 'landscape' }),
                        pexelsClient.photos.search({ query: destinationName, per_page: 1, orientation: 'landscape', size: 'large' })
                    ]);

                    let video = null;
                    let image = null;

                    if ('videos' in videoRes && videoRes.videos.length > 0) {
                        const v = videoRes.videos[0];
                        const file = v.video_files.find((f: any) => f.quality === 'hd' || f.quality === 'sd') || v.video_files[0];
                        video = {
                            url: file.link,
                            photographer: v.user.name,
                            photographer_url: v.user.url
                        };
                    }

                    if ('photos' in imageRes && imageRes.photos.length > 0) {
                        const p = imageRes.photos[0];
                        image = {
                            url: p.src.large2x || p.src.original,
                            photographer: p.photographer,
                            photographer_url: p.photographer_url
                        };
                    }
                    return { video, image };
                } catch (err) {
                    console.error('Hero media fetch error:', err);
                    return { video: null, image: null };
                }
            })()
        ]);

        // Enrichment also happens in parallel where possible
        // Note: enrichmentWithImages/TravelData modify the itinerary object in-place
        await Promise.all([
            enrichmentWithImages(itinerary),
            enrichmentWithTravelData(itinerary, undefined, destinationName)
        ]);

        const result = {
            ...itinerary,
            days: itinerary.days || itinerary.itinerary,
            deep_content: deepContent,
            slug: slug,
            heroVideo: heroMedia.video,
            heroImage: heroMedia.image
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
