import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import searchRouter from './routes/search';
import mediaRouter from './routes/media';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in .env file');
    process.exit(1);
}

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

// Routes
app.get('/', (req, res) => {
    res.send('Weekend Travellers Backend is running!');
});

app.use('/api', searchRouter);
app.use('/api', mediaRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
