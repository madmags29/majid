import { Metadata } from 'next';
import ExploreContent from '@/components/ExploreContent';

type PageProps = {
    params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const slug = resolvedParams.slug?.join('/') || '';
    // Simple capitalization for title if fetch fails or for initial render
    const title = slug.split('/').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return {
        title: `${title} Weekend Itinerary | AI Travel Guide & 2-Day Planner (2026)`,
        description: `Plan your perfect ${title} getaway with our AI-powered travel guide. Get custom 2-day itineraries, hidden gems, and local tips for your next weekend trip.`,
    };
}

export default async function ExplorePage({ params }: PageProps) {
    const resolvedParams = await params;
    const slug = resolvedParams.slug.join('/');

    return <ExploreContent slug={slug} />;
}
