import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'All Destinations | 50+ Curated Weekend Getaways | Weekend Travellers',
    description: 'Browse our complete directory of 50+ hand-picked travel destinations. From historical cities in Europe to tropical beaches in Asia, find your perfect weekend trip.',
    keywords: [
        'AI travel planner', 'AI trip planner', 'best AI travel planner', 'vacation itinerary generator', 'custom travel itineraries', 'holiday planner AI', 'weekend getaway planner', 'weekend trip generator', 'global travel planner', 'AI travel guide', 'free AI travel planner', 'weekend travellers', 'road trip planner AI', 'AI travel assistant', 'smart travel itinerary', 'travel planner 2026', 'best travel destinations globally', 'AI trip planner destinations', 'top vacation spots worldwide', 'global weekend getaways'
    ],
    openGraph: {
        title: 'All Destinations | 50+ Curated Weekend Getaways | Weekend Travellers',
        description: 'Browse our complete directory of 50+ hand-picked travel destinations. From historical cities in Europe to tropical beaches in Asia, find your perfect weekend trip.',
        type: 'website',
    },
    alternates: {
        canonical: '/explore/all',
    },
};

export default function ExploreAllLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
