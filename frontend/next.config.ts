import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.pexels.com',
            },
        ],
    },
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "http://localhost:5001/api/:path*",
            },
            {
                source: "/sitemap",
                destination: "/sitemap.xml",
            },
        ];
    },
};

export default nextConfig;
