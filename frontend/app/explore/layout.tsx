import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Explore Top Travel Destinations & Itineraries | Weekend Travellers',
    description: 'Discover the world\'s best weekend getaways. Browse curated travel destinations, view community itineraries, and find inspiration for your next short trip or vacation.',
    keywords: [
        'AI travel planner', 'AI trip planner', 'best AI travel planner', 'vacation itinerary generator', 'custom travel itineraries', 'holiday planner AI', 'weekend getaway planner', 'weekend trip generator', 'global travel planner', 'AI travel guide', 'free AI travel planner', 'weekend travellers', 'road trip planner AI', 'AI travel assistant', 'smart travel itinerary', 'travel planner 2026', 'best travel destinations globally', 'AI trip planner destinations', 'top vacation spots worldwide', 'global weekend getaways'
    ],
    openGraph: {
        title: 'Explore Top Travel Destinations & Itineraries | Weekend Travellers',
        description: 'Discover the world\'s best weekend getaways. Browse curated travel destinations, view community itineraries, and find inspiration for your next short trip or vacation.',
        type: 'website',
    },
    alternates: {
        canonical: '/explore',
    },
};

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
