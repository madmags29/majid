import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Plan Your Perfect Escape | Smart Weekend Itineraries',
    description: 'Instant AI-generated weekend itineraries tailored to your style. Explore driving routes, best hotels, and curated travel plans for the perfect 2-day trip.',
};

export default function SearchLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
