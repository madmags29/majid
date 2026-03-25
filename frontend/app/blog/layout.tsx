import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Travel Blog | Expert Tips, Guides & Inspiration | Weekend Travellers',
    description: 'Read the latest travel stories, expert guides, packing tips, and itinerary inspiration. Discover the best ways to maximize your weekend trips and holidays.',
    keywords: ['travel blog', 'travel tips', 'weekend trip guides', 'vacation advice', 'travel inspiration stories', 'AI travel blog', 'packing checklist', 'budget travel tips', 'solo travel guide', 'weekend getaway ideas'],
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
