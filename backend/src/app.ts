import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import searchRouter from './routes/search';
import mediaRouter from './routes/media';
import authRouter from './routes/auth';
import tripsRouter from './routes/trips';
import weatherRouter from './routes/weather';
import destinationsRouter from './routes/destinations';
import contactRouter from './routes/contact';

dotenv.config();

const app = express();

const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://frontend-tau-murex-95.vercel.app',
    'https://www.weekendtravellers.com',
    'https://weekendtravellers.com',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (MONGODB_URI) {
    mongoose
        .connect(MONGODB_URI)
        .then(() => {
            console.log('Successfully connected to MongoDB Atlas');
        })
        .catch((err) => {
            console.error('CRITICAL: MongoDB connection error:', err);
        });

    mongoose.connection.on('error', err => {
        console.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
        console.warn('Mongoose disconnected');
    });
} else {
    console.error('CRITICAL: MONGODB_URI is not defined in environment variables');
}

// Routes
app.get('/', (req, res) => {
    res.send('Weekend Travellers Backend is running!');
});

app.use('/api', searchRouter);
app.use('/api', destinationsRouter);
app.use('/api', mediaRouter);
app.use('/api/auth', authRouter);
app.use('/api/trips', tripsRouter);
app.use('/api', weatherRouter);
app.use('/api', contactRouter);

// Global Error Handling Middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('UNHANDLED ERROR:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

export default app;
