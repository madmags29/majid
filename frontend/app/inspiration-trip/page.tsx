import { Metadata } from 'next';
import SuspendedMenuClient from './MenuClient';

export const metadata: Metadata = {
    title: 'Trip Inspiration | Discover Unique Weekend Getaways',
    description: 'Browse curated collections of top-rated weekend getaways and hidden gems. Find your next travel inspiration, from mountain cabins to beachside escapes.',
    keywords: [
        'AI travel planner', 'AI trip planner', 'best AI travel planner', 'vacation itinerary generator', 'custom travel itineraries', 'holiday planner AI', 'weekend getaway planner', 'weekend trip generator', 'global travel planner', 'AI travel guide', 'free AI travel planner', 'weekend travellers', 'road trip planner AI', 'AI travel assistant', 'smart travel itinerary', 'travel planner 2026', 'best travel destinations globally', 'AI trip planner destinations', 'top vacation spots worldwide', 'global weekend getaways'
    ],
    openGraph: {
        title: 'Trip Inspiration | Discover Unique Weekend Getaways',
        description: 'Browse curated collections of top-rated weekend getaways and hidden gems. Find your next travel inspiration, from mountain cabins to beachside escapes.',
        type: 'website',
    },
    alternates: {
        canonical: '/inspiration-trip',
    },
};

export default function WeekendMenuPage() {
    return <SuspendedMenuClient />;
}
