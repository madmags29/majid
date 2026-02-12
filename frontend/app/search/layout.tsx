import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Search Your Next Weekend Trip | AI Itinerary Generator',
    description: 'Find the best AI-recommended weekend getaways for 2025 tailored to your travel style. Explore instant itineraries, driving routes, and personalized recommendations.',
};

export default function SearchLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
