import { Metadata } from 'next';

export const metadata = {
    title: 'Contact Us | AI Trip Planning & Weekend Getaway Support',
    description: 'Need help planning your weekend trip? Contact the Weekend Travellers support team for inquiries, bug reports, and partnership opportunities.',
    keywords: [
        'AI travel planner', 'AI trip planner', 'best AI travel planner', 'vacation itinerary generator', 'custom travel itineraries', 'holiday planner AI', 'weekend getaway planner', 'weekend trip generator', 'global travel planner', 'AI travel guide', 'free AI travel planner', 'weekend travellers', 'road trip planner AI', 'AI travel assistant', 'smart travel itinerary', 'travel planner 2026', 'best travel destinations globally', 'AI trip planner destinations', 'top vacation spots worldwide', 'global weekend getaways'
    ],
    openGraph: {
        title: 'Contact Us | AI Trip Planning & Weekend Getaway Support',
        description: 'Need help planning your weekend trip? Contact the Weekend Travellers support team for inquiries, bug reports, and partnership opportunities.',
        type: 'website',
    },
    alternates: {
        canonical: '/contact',
    },
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
