import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Travel Blog | Expert Tips, Guides & Inspiration | Weekend Travellers',
    description: 'Read the latest travel stories, expert guides, packing tips, and itinerary inspiration. Discover the best ways to maximize your weekend trips and holidays.',
    keywords: [
        'AI travel planner', 'AI trip planner', 'best AI travel planner', 'vacation itinerary generator', 'custom travel itineraries', 'holiday planner AI', 'weekend getaway planner', 'weekend trip generator', 'global travel planner', 'AI travel guide', 'free AI travel planner', 'weekend travellers', 'road trip planner AI', 'AI travel assistant', 'smart travel itinerary', 'travel planner 2026', 'best travel destinations globally', 'AI trip planner destinations', 'top vacation spots worldwide', 'global weekend getaways'
    ],
    openGraph: {
        title: 'Travel Blog | Expert Tips, Guides & Inspiration | Weekend Travellers',
        description: 'Read the latest travel stories, expert guides, packing tips, and itinerary inspiration. Discover the best ways to maximize your weekend trips and holidays.',
        type: 'website',
    },
    alternates: {
        canonical: '/blog',
    },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
