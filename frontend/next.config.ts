import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.pexels.com',
            },
            {
                protocol: 'https',
                hostname: 'pixabay.com',
            },
            {
                protocol: 'https',
                hostname: 'cdn.pixabay.com',
            }
        ],
    },
    async redirects() {
        return [
            {
                source: '/:path*',
                has: [
                    {
                        type: 'host',
                        value: 'www.weekendtravellers.com',
                    },
                ],
                destination: 'https://weekendtravellers.com/:path*',
                permanent: true,
            },
        ];
    },
    async rewrites() {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
        return [
            {
                source: "/api/:path*",
                destination: `${apiUrl}/api/:path*`,
            },
            {
                source: "/sitemap",
                destination: "/sitemap.xml",
            },
        ];
    },
};

export default nextConfig;
