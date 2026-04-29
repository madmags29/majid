import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'FAQ | AI Trip Planner & Weekend Getaway Questions',
    description: 'Find answers to common questions about using our AI travel planner, customizing itineraries, and managing your weekend trips.',
    keywords: [
        'AI travel planner', 'AI trip planner', 'best AI travel planner', 'vacation itinerary generator', 'custom travel itineraries', 'holiday planner AI', 'weekend getaway planner', 'weekend trip generator', 'global travel planner', 'AI travel guide', 'free AI travel planner', 'weekend travellers', 'road trip planner AI', 'AI travel assistant', 'smart travel itinerary', 'travel planner 2026', 'best travel destinations globally', 'AI trip planner destinations', 'top vacation spots worldwide', 'global weekend getaways'
    ],
    openGraph: {
        title: 'FAQ | AI Trip Planner & Weekend Getaway Questions',
        description: 'Find answers to common questions about using our AI travel planner, customizing itineraries, and managing your weekend trips.',
        type: 'website',
    },
    alternates: {
        canonical: '/faq',
    },
};

export default function FAQLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
