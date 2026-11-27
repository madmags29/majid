import { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import ExploreContent from '@/components/ExploreContent';
import { EXLPORE_DESTINATIONS } from '@/lib/destinations';
import { REGION_HUBS } from '@/lib/destinationMetadata';

type PageProps = {
    params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const slug = resolvedParams.slug?.join('/') || '';
    const title = slug.split('/').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return {
        title: `${title} Weekend Itinerary | Travel Guide`,
        description: `Plan a 2-to-3 day weekend getaway to ${title} with route options, seasonal advice, and realistic budget estimates.`,
        alternates: {
            canonical: `/explore/${slug}`,
        }
    };
}

export default async function ExplorePage({ params }: PageProps) {
    const resolvedParams = await params;
    const parts = resolvedParams.slug || [];
    const slug = parts.join('/');

    // Redirect multi-segment destination paths cleanly to canonical single-slug guides if known
    const lastSegment = parts[parts.length - 1]?.toLowerCase();
    if (lastSegment) {
        const canonicalDest = EXLPORE_DESTINATIONS.find(d => d.id === lastSegment);
        if (canonicalDest && slug !== canonicalDest.id) {
            redirect(`/explore/${canonicalDest.id}`);
        }
        if (REGION_HUBS[lastSegment] && slug !== lastSegment) {
            redirect(`/explore/${lastSegment}`);
        }
    }

    let initialData = null;
    try {
        const backendUrl = process.env.BACKEND_URL
            || process.env.NEXT_PUBLIC_API_URL
            || 'https://backend-flax-eight-93.vercel.app';

        const res = await fetch(`${backendUrl}/api/explore?slug=${encodeURIComponent(slug)}`, {
            next: { revalidate: 604800 },
            signal: AbortSignal.timeout(8000),
        });

        if (res.ok) {
            const json = await res.json();
            if (json && json.destination) {
                initialData = json;
            }
        }
    } catch (e) {
        console.error('Explore SSR fetch error:', e);
    }

    if (!initialData) {
        notFound();
    }

    return <ExploreContent slug={slug} initialData={initialData} />;
}
