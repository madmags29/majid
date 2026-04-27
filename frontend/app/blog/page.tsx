import React from 'react';
import BlogClientPage from './BlogClientPage';
import { API_URL, IS_BUILD } from '@/lib/config';

// Revalidate the blog list every hour
export const revalidate = 3600;

export default async function BlogLandingPage() {
    let posts = [];
    try {
        // For SSR on Vercel: next.config.ts rewrites only apply to browser/client requests.
        // Server-side fetch MUST use the absolute backend URL directly.
        const backendUrl = process.env.BACKEND_URL 
            || process.env.NEXT_PUBLIC_API_URL 
            || 'https://backend-flax-eight-93.vercel.app';
        
        // Skip fetching during local builds pointing to localhost (avoids ECONNREFUSED)
        if (IS_BUILD && backendUrl.includes('localhost')) {
            console.log('Skipping blog posts fetch during build (localhost not available)...');
        } else {
            const res = await fetch(`${backendUrl}/api/blog`, { 
                next: { revalidate: 3600 } 
            });
            if (res.ok) {
                posts = await res.json();
            } else {
                console.error('Blog API returned non-OK status:', res.status);
            }
        }
    } catch (error) {
        console.error('Failed to fetch blog posts:', error);
    }
    
    // Pass the purely-rendered posts to the client component to animate them
    // This perfectly solves exactly what the client requested - SSR!
    return (
        <>
            <div className="sr-only">
                {/* Fallback semantic text strictly for crawlers on index */}
                <h1>Ultimate Weekend Getaway and Travel Blog</h1>
                <p>Welcome to the Weekend Travellers expert blog. Discover our latest AI-generated top weekend travel itineraries, secret destinations, budget guides, and packing tips.</p>
            </div>
            <BlogClientPage posts={Array.isArray(posts) ? posts : []} />
        </>
    );
}
