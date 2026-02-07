import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Search Trips',
    description: 'Find the best weekend getaways tailored to your preferences. Explore destinations and itineraries.',
};

export default function SearchLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
