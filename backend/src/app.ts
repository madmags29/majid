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
            console.log('Connected to MongoDB');
        })
        .catch((err) => {
            console.error('Error connecting to MongoDB:', err);
        });
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

export default app;
