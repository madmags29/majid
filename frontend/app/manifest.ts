import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Weekend Travellers',
        short_name: 'WeTravel',
        description: 'Discover your perfect weekend getaway.',
        start_url: '/',
        display: 'standalone',
        background_color: '#0f172a',
        theme_color: '#3b82f6',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    };
}
