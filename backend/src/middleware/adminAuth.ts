import { Response, NextFunction } from 'express';
import { AuthRequest, authenticateToken } from './auth';
import { User } from '../models/User';

export const adminAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    // First ensure they are logged in
    authenticateToken(req, res, async () => {
        try {
            if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

            const user = await User.findById(req.user.id);
            if (!user || !(user as any).isAdmin) {
                return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
            }

            next();
        } catch (error) {
            console.error('Admin Auth Error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    });
};
