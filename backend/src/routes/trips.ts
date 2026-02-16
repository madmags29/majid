import express from 'express';
import { Trip } from '../models/Trip';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import { authenticateToken, authenticateAdmin } from '../middleware/auth';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_this';


// SAVE TRIP
router.post('/', authenticateToken, async (req: any, res: any) => {
    try {
        const { destination, itinerary } = req.body;
        const userId = req.user.id;

        const trip = new Trip({
            userId,
            destination,
            itinerary
        });

        await trip.save();
        res.status(201).json(trip);

    } catch (error) {
        console.error('Save Trip Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET USER TRIPS
router.get('/', authenticateToken, async (req: any, res: any) => {
    try {
        const userId = req.user.id;
        const trips = await Trip.find({ userId }).sort({ createdAt: -1 });
        res.json(trips);
    } catch (error) {
        console.error('Get Trips Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET ALL TRIPS (ADMIN ONLY)
router.get('/all', authenticateAdmin, async (req: any, res: any) => {
    try {
        const trips = await Trip.find().populate('userId', 'name email').sort({ createdAt: -1 });
        res.json(trips);
    } catch (error) {
        console.error('Get All Trips Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE TRIP
router.delete('/:id', authenticateToken, async (req: any, res: any) => {
    try {
        const tripId = req.params.id;
        const userId = req.user.id;

        // Ensure user owns the trip
        const result = await Trip.deleteOne({ _id: tripId, userId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Trip not found or unauthorized' });
        }

        res.json({ message: 'Trip deleted successfully' });
    } catch (error) {
        console.error('Delete Trip Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
