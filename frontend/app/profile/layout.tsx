import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'User Profile | Manage Your AI Trip Plans & Getaways',
    description: 'Manage your account settings,
    keywords: [
        'AI travel planner', 'AI trip planner', 'best AI travel planner', 'vacation itinerary generator', 'custom travel itineraries', 'holiday planner AI', 'weekend getaway planner', 'weekend trip generator', 'global travel planner', 'AI travel guide', 'free AI travel planner', 'weekend travellers', 'road trip planner AI', 'AI travel assistant', 'smart travel itinerary', 'travel planner 2026', 'best travel destinations globally', 'AI trip planner destinations', 'top vacation spots worldwide', 'global weekend getaways'
    ], preferences, and profile information.',
    alternates: {
        canonical: '/profile',
    },
};

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
