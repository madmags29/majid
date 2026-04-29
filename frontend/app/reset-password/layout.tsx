import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Reset Password | Weekend Travellers Travel App',
    description: 'Securely reset the password for your Weekend Travellers account.',
    keywords: [
        'AI travel planner', 'AI trip planner', 'best AI travel planner', 'vacation itinerary generator', 'custom travel itineraries', 'holiday planner AI', 'weekend getaway planner', 'weekend trip generator', 'global travel planner', 'AI travel guide', 'free AI travel planner', 'weekend travellers', 'road trip planner AI', 'AI travel assistant', 'smart travel itinerary', 'travel planner 2026', 'best travel destinations globally', 'AI trip planner destinations', 'top vacation spots worldwide', 'global weekend getaways'
    ],
    alternates: {
        canonical: '/reset-password',
    },
};

export default function ResetPasswordLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
