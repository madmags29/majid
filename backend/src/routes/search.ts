import express from 'express';
import { generateItinerary } from '../services/ai';

const router = express.Router();

router.post('/search', async (req, res) => {
    try {
        const { destination, days, interests } = req.body;

        if (!destination) {
            return res.status(400).json({ error: 'Destination is required' });
        }

        const itinerary = await generateItinerary(destination, days, interests);
        res.json(itinerary);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Failed to generate itinerary' });
    }
});

export default router;
