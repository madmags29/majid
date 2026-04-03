import React from 'react';
import BlogClientPage from './BlogClientPage';
import { API_URL, IS_BUILD } from '@/lib/config';

// Revalidate the blog list every hour
export const revalidate = 3600;

export default async function BlogLandingPage() {
    let posts = [];
    try {
        // During build, if pointing to local, skip fetching to avoid ECONNREFUSED/timeout
        if (IS_BUILD && API_URL.includes('localhost')) {
            console.log('Skipping blog posts fetch during build to prevent timeout...');
        } else {
            // Run fetch on the Server during SSR/SSG
            const res = await fetch(`${API_URL}/api/blog`, { 
                next: { revalidate: 3600 }
            });
            if (res.ok) {
                posts = await res.json();
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
