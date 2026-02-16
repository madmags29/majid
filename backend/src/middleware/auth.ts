import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_this';

export interface AuthRequest extends Request {
    user?: any;
}

// Middleware to authenticate token
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Middleware to authenticate admin
export const authenticateAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, async (err: any, decoded: any) => {
        if (err) return res.sendStatus(403);

        try {
            const user = await User.findById(decoded.id);
            if (!user || !(user as any).isAdmin) {
                return res.status(403).json({ message: 'Admin access required' });
            }
            req.user = user;
            next();
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    });
};
