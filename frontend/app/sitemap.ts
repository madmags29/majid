import { MetadataRoute } from 'next';
import { EXLPORE_DESTINATIONS } from '@/lib/destinations';

export const revalidate = 604800; // Auto-update sitemap exactly every week (7 days)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://weekendtravellers.com';
    // Use production fallback if environment variable is missing
    const apiUrl = process.env.NEXT_PUBLIC_API_URL 
        || process.env.BACKEND_URL 
        || 'https://backend-flax-eight-93.vercel.app';

    // 1. Static Pages
    const staticPages = [
        { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1.0 },
        { url: `${baseUrl}/explore`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
        { url: `${baseUrl}/explore/all`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
        { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.8 },
        { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
        { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
        { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
        { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
        { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
        { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
        { url: `${baseUrl}/cookie-policy`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
        { url: `${baseUrl}/inspiration-trip`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.7 },
    ];

    // 2. Categories
    const categories = ['india', 'europe', 'asia', 'americas', 'middle-east'].map(route => ({
        url: `${baseUrl}/explore/${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    // 3. Destinations from lib/destinations.ts
    const destinationEntries = EXLPORE_DESTINATIONS.map(dest => ({
        url: `${baseUrl}/explore/${dest.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    // 4. Dynamic Blog Posts
    let blogEntries: MetadataRoute.Sitemap = [];
    try {
        const res = await fetch(`${apiUrl}/api/blog`, { next: { revalidate: 604800 } });
        if (res.ok) {
            const posts = await res.json();
            if (Array.isArray(posts)) {
                blogEntries = posts.map((post: any) => ({
                    url: `${baseUrl}/blog/${post.slug}`,
                    lastModified: new Date(post.updatedAt || post.publishedDate || Date.now()),
                    changeFrequency: 'weekly' as const,
                    priority: 0.8,
                }));
            }
        }
    } catch (e) {
        console.warn('Could not fetch blog posts for sitemap');
    }

    // 5. Public Trips
    let tripEntries: MetadataRoute.Sitemap = [];
    try {
        const res = await fetch(`${apiUrl}/api/trips/public?limit=500`, { next: { revalidate: 604800 } });
        if (res.ok) {
            const trips = await res.json();
            if (Array.isArray(trips)) {
                tripEntries = trips.map((trip: any) => ({
                    url: `${baseUrl}/trips/${trip._id}`,
                    lastModified: new Date(trip.updatedAt || trip.createdAt || Date.now()),
                    changeFrequency: 'monthly' as const,
                    priority: 0.6,
                }));
            }
        }
    } catch (e) {
        console.warn('Could not fetch public trips for sitemap');
    }

    return [
        ...staticPages,
        ...categories,
        ...destinationEntries,
        ...blogEntries,
        ...tripEntries
    ];
}
