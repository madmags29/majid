/** @type {import('next').NextConfig} */
const nextConfig = {
    // basePath removed for subdomain deployment
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'placehold.co',
            },
            {
                protocol: 'https',
                hostname: 'pexels.com',
            },
            {
                protocol: 'https',
                hostname: '**.pexels.com',
            },
            {
                protocol: 'https',
                hostname: 'pixabay.com',
            },
            {
                protocol: 'https',
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
};

export default nextConfig;
