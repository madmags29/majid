import express from 'express';
import { Trip } from '../models/Trip';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_this';

// Middleware to authenticate token
const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

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
