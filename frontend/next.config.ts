import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: "/sitemap",
                destination: "/sitemap.xml",
            },
        ];
    },
};

export default nextConfig;
