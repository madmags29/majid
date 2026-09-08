import React from 'react';
import type { Metadata } from 'next';
import BlogClientPage from './BlogClientPage';
import { API_URL, IS_BUILD } from '@/lib/config';

export const metadata: Metadata = {
    title: 'Travel Blog & Getaway Guides | Weekend Travellers',
    description: 'Explore expert travel guides, weekend trip itineraries, road trip tips, and AI travel advice for top destinations in India, Europe, Asia, and worldwide.',
    keywords: [
        'travel blog', 'weekend getaway guides', 'road trip itineraries', 'best travel spots 2026', 'AI travel planning blog', 'budget travel tips'
    ],
    openGraph: {
        title: 'Travel Blog & Getaway Guides | Weekend Travellers',
        description: 'Explore expert travel guides, weekend trip itineraries, road trip tips, and AI travel advice worldwide.',
        type: 'website',
    },
    alternates: {
        canonical: '/blog',
    },
};

// Revalidate the blog list every hour
export const revalidate = 3600;

export default async function BlogLandingPage() {
    let posts = [];
    const primaryUrl = process.env.BACKEND_URL 
        || process.env.NEXT_PUBLIC_API_URL 
        || 'https://backend-flax-eight-93.vercel.app';
    const fallbackUrl = 'https://backend-flax-eight-93.vercel.app';

    const fetchPostsFromUrl = async (url: string) => {
        const res = await fetch(`${url}/api/blog?t=${Date.now()}`, { 
            cache: 'no-store',
            next: { revalidate: 0 } 
        });
        if (res.ok) {
            return await res.json();
        }
        return null;
    };

    try {
        if (!IS_BUILD || !primaryUrl.includes('localhost')) {
            posts = await fetchPostsFromUrl(primaryUrl);
        }
    } catch (error) {
        // Fallback below
    }

    if ((!posts || posts.length === 0) && primaryUrl !== fallbackUrl) {
        try {
            posts = await fetchPostsFromUrl(fallbackUrl);
        } catch (err) {
            console.error('Failed to fetch blog posts from fallback:', err);
        }
    }
    
    const blogCollectionSchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Weekend Travellers Travel Blog',
        url: 'https://weekendtravellers.com/blog',
        description: 'Explore expert travel guides, weekend trip itineraries, road trip tips, and AI travel advice.',
        publisher: {
            '@type': 'Organization',
            name: 'Weekend Travellers',
            logo: 'https://weekendtravellers.com/icon.svg'
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(blogCollectionSchema) }}
            />
            <div className="sr-only">
                {/* Fallback semantic text strictly for crawlers on index */}
                <h1>Ultimate Weekend Getaway and Travel Blog</h1>
                <p>Welcome to the Weekend Travellers expert blog. Discover our latest AI-generated top weekend travel itineraries, secret destinations, budget guides, and packing tips.</p>
            </div>
            <BlogClientPage posts={Array.isArray(posts) ? posts : []} />
        </>
    );
}
