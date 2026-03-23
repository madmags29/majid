/** @type {import('next').NextConfig} */
const nextConfig = {
    // basePath removed for subdomain deployment
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.pexels.com',
            },
        ],
    },
};

export default nextConfig;
