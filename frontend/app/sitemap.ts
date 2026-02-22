import { MetadataRoute } from 'next';
import { EXLPORE_DESTINATIONS } from '@/lib/destinations';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.weekendtravellers.com';

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
        }
    ];

    return [
        ...staticPages,
        ...categoryEntries,
        ...destinationEntries
    ];
}
