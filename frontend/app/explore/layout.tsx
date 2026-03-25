import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Explore Top Travel Destinations & Itineraries | Weekend Travellers',
    description: 'Discover the world\'s best weekend getaways. Browse curated travel destinations, view community itineraries, and find inspiration for your next short trip or vacation.',
    keywords: ['explore destinations', 'top weekend getaways', 'travel inspiration', 'community itineraries', 'best places to travel', 'short trips', 'vacation spots', 'AI travel planner destinations', 'city breaks 2026', 'road trip destinations', 'holiday planner'],
    openGraph: {
        title: 'Explore Top Travel Destinations & Itineraries | Weekend Travellers',
        description: 'Discover the world\'s best weekend getaways. Browse curated travel destinations, view community itineraries, and find inspiration for your next short trip or vacation.',
        type: 'website',
    }
};

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
