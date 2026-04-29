import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'AI Trip Planner | Plan Smart Weekend Getaways & Itineraries',
    description: 'Instant AI-generated weekend itineraries tailored to your style. Explore driving routes, best hotels, and curated travel plans for the perfect 2-day trip.',
    keywords: [
        'AI travel planner', 'AI trip planner', 'best AI travel planner', 'vacation itinerary generator', 'custom travel itineraries', 'holiday planner AI', 'weekend getaway planner', 'weekend trip generator', 'global travel planner', 'AI travel guide', 'free AI travel planner', 'weekend travellers', 'road trip planner AI', 'AI travel assistant', 'smart travel itinerary', 'travel planner 2026', 'best travel destinations globally', 'AI trip planner destinations', 'top vacation spots worldwide', 'global weekend getaways'
    ],
    openGraph: {
        title: 'AI Trip Planner | Plan Smart Weekend Getaways & Itineraries',
        description: 'Instant AI-generated weekend itineraries tailored to your style. Explore driving routes, best hotels, and curated travel plans for the perfect 2-day trip.',
        type: 'website',
    },
    alternates: {
        canonical: '/search',
    },
};

export default function SearchLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
