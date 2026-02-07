import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Search Your Next Weekend Trip',
    description: 'Find the best AI-recommended weekend getaways tailored to your travel style. Explore instant itineraries, driving routes, and more.',
};

export default function SearchLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
