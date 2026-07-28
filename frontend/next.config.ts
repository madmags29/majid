import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
    turbopack: {
        root: path.resolve(__dirname, '..'),
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'placehold.co',
            },
            {
                protocol: 'http',
                hostname: 'placehold.co',
            },
            {
                protocol: 'https',
                hostname: 'pexels.com',
            },
            {
                protocol: 'http',
                hostname: 'pexels.com',
            },
            {
                protocol: 'https',
                hostname: '**.pexels.com',
            },
            {
                protocol: 'http',
                hostname: '**.pexels.com',
            },
            {
                protocol: 'https',
                hostname: 'pixabay.com',
            },
            {
                protocol: 'http',
                hostname: 'pixabay.com',
            },
            {
                protocol: 'https',
                hostname: '**.pixabay.com',
            },
            {
                protocol: 'http',
                hostname: '**.pixabay.com',
            },
            {
                protocol: 'https',
                hostname: 'unsplash.com',
            },
            {
                protocol: 'https',
                hostname: '**.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: '**.googleusercontent.com',
            },
            {
                protocol: 'https',
                hostname: '**.cloudinary.com',
            },
            {
                protocol: 'https',
                hostname: '**.imgur.com',
            }
        ],
    },
    async rewrites() {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5001";
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
