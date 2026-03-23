import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'AI Trip Planner | Plan Smart Weekend Getaways & Itineraries',
    description: 'Instant AI-generated weekend itineraries tailored to your style. Explore driving routes, best hotels, and curated travel plans for the perfect 2-day trip.',
    keywords: ['AI trip planner', 'weekend getaway generator', 'custom travel itinerary', 'road trip planner', 'holiday generator'],
    openGraph: {
        title: 'AI Trip Planner | Plan Smart Weekend Getaways & Itineraries',
        description: 'Instant AI-generated weekend itineraries tailored to your style. Explore driving routes, best hotels, and curated travel plans for the perfect 2-day trip.',
        type: 'website',
    }
};

export default function SearchLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
