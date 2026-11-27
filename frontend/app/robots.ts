import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://weekendtravellers.com';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/profile', '/reset-password', '/trips'],
            },
            {
                userAgent: [
                    'GPTBot',
                    'ChatGPT-User',
                    'PerplexityBot',
                    'ClaudeBot',
                    'Claude-Web',
                    'Google-Extended',
                    'Applebot-Extended',
                    'Amazonbot',
                    'Cohere-ai',
                    'Mediapartners-Google'
                ],
                allow: '/',
                disallow: ['/api/', '/profile', '/reset-password', '/trips'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
