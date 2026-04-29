import { Metadata } from 'next';
import TripsContent from '@/components/TripsContent';

export const metadata: Metadata = {
    title: 'Saved Trips & Itineraries | Your Custom Weekend Getaways',
    description: 'View and manage your saved weekend getaways and travel plans. Keep all your curated AI itineraries natively stored.',
    keywords: [
        'AI travel planner', 'AI trip planner', 'best AI travel planner', 'vacation itinerary generator', 'custom travel itineraries', 'holiday planner AI', 'weekend getaway planner', 'weekend trip generator', 'global travel planner', 'AI travel guide', 'free AI travel planner', 'weekend travellers', 'road trip planner AI', 'AI travel assistant', 'smart travel itinerary', 'travel planner 2026', 'best travel destinations globally', 'AI trip planner destinations', 'top vacation spots worldwide', 'global weekend getaways'
    ],
    openGraph: {
        title: 'Saved Trips & Itineraries | Your Custom Weekend Getaways',
        description: 'View and manage your saved weekend getaways and travel plans. Keep all your curated AI itineraries natively stored.',
        type: 'website',
    }
};

export default function TripsPage() {
    return <TripsContent />;
}
