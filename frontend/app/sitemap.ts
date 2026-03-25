import { MetadataRoute } from 'next';
import { EXLPORE_DESTINATIONS } from '@/lib/destinations';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://weekendtravellers.com';

    // Categories and dynamic destinations
    const categories = [
        'explore/india',
        'explore/europe',
        'explore/asia',
        'explore/americas',
        'explore/middle-east'
    ];

    const categoryEntries = categories.map(route => ({
        url: `${baseUrl}/${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    const destinationEntries = EXLPORE_DESTINATIONS.map(dest => ({
        url: `${baseUrl}/explore/${dest.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/search`,
            lastModified: new Date(),
            changeFrequency: 'always' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/trips`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/profile`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/admin`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.6,
        },
        {
            url: `${baseUrl}/signup`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        },
        {
            url: `${baseUrl}/reset-password`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.3,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        },
        {
            url: `${baseUrl}/faq`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'yearly' as const,
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date(),
            changeFrequency: 'yearly' as const,
            priority: 0.3,
        },
        {
            url: `${baseUrl}/cookie-policy`,
            lastModified: new Date(),
            changeFrequency: 'yearly' as const,
            priority: 0.3,
        },
        {
            url: `${baseUrl}/chat`,
            lastModified: new Date(),
            changeFrequency: 'always' as const,
            priority: 0.7,
        },
        {
            url: `${baseUrl}/inspiration-trip`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.7,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        }
    ];

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    let blogEntries: any[] = [];
    let tripEntries: any[] = [];

    try {
        const blogPosts = await fetch(`${apiUrl}/api/blog`, { next: { revalidate: 3600 } }).then(res => res.json());
        if (Array.isArray(blogPosts)) {
            blogEntries = blogPosts.map((post: any) => ({
                url: `${baseUrl}/blog/${post.slug}`,
                lastModified: new Date(post.updatedAt || post.publishedDate || Date.now()),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            }));
        }
    } catch (e) {
        console.warn('Could not fetch blog posts for sitemap');
    }

    try {
        const publicTrips = await fetch(`${apiUrl}/api/trips/public?limit=500`, { next: { revalidate: 3600 } }).then(res => res.json());
        if (Array.isArray(publicTrips)) {
            tripEntries = publicTrips.map((trip: any) => ({
                url: `${baseUrl}/trip/${trip._id}`,
                lastModified: new Date(trip.createdAt || Date.now()),
                changeFrequency: 'monthly' as const,
                priority: 0.6,
            }));
        }
    } catch (e) {
        console.warn('Could not fetch public trips for sitemap');
    }

    return [
        ...staticPages,
        ...categoryEntries,
        ...destinationEntries,
        ...blogEntries,
        ...tripEntries
    ];
}
