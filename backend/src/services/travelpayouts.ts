import axios from 'axios';

const TRAVELPAYOUTS_TOKEN = process.env.TRAVELPAYOUTS_TOKEN;
const FLIGHT_API_BASE = 'https://api.travelpayouts.com/v2/prices/latest';
const HOTEL_API_BASE = 'http://engine.hotellook.com/api/v2/cache.json';

export async function getFlightPrices(origin: string, destination: string) {
    if (!TRAVELPAYOUTS_TOKEN) return null;
    try {
        const response = await axios.get(FLIGHT_API_BASE, {
            params: {
                token: TRAVELPAYOUTS_TOKEN,
                origin,
                destination,
                currency: 'inr',
                period_type: 'month',
                page: 1,
                limit: 1,
                show_to_affiliates: true,
                sorting: 'price' 
            }
        });
        return response.data;
    } catch (error) {
        console.error('TravelPayouts Flight API Error:', error);
        return null;
    }
}

export async function getHotelPrices(location: string) {
    if (!TRAVELPAYOUTS_TOKEN) return null;
    try {
        const response = await axios.get(HOTEL_API_BASE, {
            params: {
                token: TRAVELPAYOUTS_TOKEN,
                location,
                currency: 'inr',
                checkIn: new Date().toISOString().split('T')[0],
                checkOut: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                limit: 5
            }
        });
        return response.data;
    } catch (error) {
        console.error('TravelPayouts Hotel API Error:', error);
        return null;
    }
}
