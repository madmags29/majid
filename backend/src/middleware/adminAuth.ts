import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export const adminAuth = async (req: any, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new Error('Authentication required');
        }

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        const user: any = await User.findOne({ _id: decoded.id, isAdmin: true });

        if (!user) {
            throw new Error('Access denied. Admin privileges required.');
        }

        if (user.status === 'blocked') {
            throw new Error('Your account has been blocked.');
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error: any) {
        res.status(401).json({
            success: false,
            message: error.message || 'Unauthorized access'
        });
    }
};
