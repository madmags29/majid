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
        title: `${title} 2-Day Itinerary & Travel Guide 2025`,
        description: `Discover the best 2-day itinerary for ${title}. AI-curated guide including hidden gems, top hotels, and budget tips for your perfect weekend getaway.`,
    };
}

export default async function ExplorePage({ params }: PageProps) {
    const resolvedParams = await params;
    const slug = resolvedParams.slug.join('/');

    return <ExploreContent slug={slug} />;
}
