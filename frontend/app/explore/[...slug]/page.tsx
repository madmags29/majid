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
        title: `${title} Weekend Itinerary | AI Travel Guide India & 2-Day Planner (2026)`,
        description: `Plan your perfect ${title}, India getaway with our AI-powered travel guide. Get custom 2-day itineraries, hidden gems, and local tips for your next weekend trip in India.`,
        keywords: [`${title} weekend trip`, `${title} itinerary India`, 'weekend getaways India', 'short trips India'],
        alternates: {
            canonical: `/explore/${slug}`,
        }
    };
}

export default async function ExplorePage({ params }: PageProps) {
    const resolvedParams = await params;
    const slug = resolvedParams.slug.join('/');
    
    let initialData = null;
    try {
        const backendUrl = process.env.BACKEND_URL 
            || process.env.NEXT_PUBLIC_API_URL 
            || 'https://backend-flax-eight-93.vercel.app';
            
        const res = await fetch(`${backendUrl}/api/explore?slug=${encodeURIComponent(slug)}`, {
            next: { revalidate: 604800 } // Cache for 7 days
        });
        
        if (res.ok) {
            initialData = await res.json();
        }
    } catch (e) {
        console.error('Explore SSR fetch error:', e);
    }

    return <ExploreContent slug={slug} initialData={initialData} />;
}
