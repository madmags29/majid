import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://weekendtravellers.com';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [],
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
                    'Bytespider',
                    'Cohere-ai',
                    'Diffbot',
                    'Omgilibot',
                    'Mediapartners-Google'
                ],
                allow: '/',
            },
        ],
        sitemap: [
            `${baseUrl}/sitemap.xml`,
            `${baseUrl}/llms.txt`,
            `${baseUrl}/llms-full.txt`
        ],
    };
}
