import express from 'express';
import axios from 'axios';
import Cache from '../models/Cache';

const router = express.Router();

router.get('/weather', async (req, res) => {
    try {
        const { lat, lng } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }

        const cacheKey = `weather_${lat}_${lng}`;

        // Check cache (weather doesn't change incessantly, 1 hour cache is fine)
        const cachedWeather = await Cache.findOne({ key: cacheKey });
        if (cachedWeather && cachedWeather.expiresAt > new Date()) {
            return res.json(cachedWeather.value);
        }

        // Fetch from Open-Meteo (Free, Non-Commercial)
        const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
            params: {
                latitude: lat,
                longitude: lng,
                current_weather: true,
                daily: 'temperature_2m_max,temperature_2m_min',
                timezone: 'auto'
            }
        });

        const weatherData = response.data;

        // Cache for 1 hour
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);

        await Cache.findOneAndUpdate(
            { key: cacheKey },
            { value: weatherData, expiresAt },
            { upsert: true, new: true }
        );

        res.json(weatherData);

    } catch (error) {
        console.error('Weather API error:', error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

export default router;
