'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowRight, MessageSquare, Tag, Loader2 } from 'lucide-react';
import InnerHeader from '@/components/InnerHeader';
import { Button } from '@/components/ui/button';
import { API_URL } from '@/lib/config';

export default function BlogLandingPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch(`${API_URL}/api/blog`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    setPosts(data);
                }
            } catch (error) {
                console.error('Failed to fetch blog posts:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const featuredPost = posts[0];
    const latestPosts = posts.slice(1);
    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500/30">
            <InnerHeader title="Weekend Travellers Blog" subtitle="Stories & Guides" />

            <main className="container mx-auto px-4 py-12 md:py-20 lg:max-w-7xl">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                        <p className="text-slate-400 font-medium">Loading amazing travel stories...</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-bold text-white mb-4">No stories found yet.</h2>
                        <p className="text-slate-400">Our AI writers are busy exploring the world. Check back soon!</p>
                    </div>
                ) : (
                    <>
                        {/* Hero section with Featured Post */}
                        {featuredPost && (
                            <section className="relative rounded-[2.5rem] overflow-hidden mb-20 aspect-[16/9] md:aspect-[21/9] group shadow-2xl">
                                <Image
                                    src={featuredPost.heroImage}
                                    alt={featuredPost.title}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                                
                                <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full md:max-w-3xl">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest rounded-full mb-4 shadow-lg shadow-blue-500/20">
                                            Featured Story
                                        </span>
                                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6 leading-tight drop-shadow-lg">
                                            {featuredPost.title}
                                        </h2>
                                        <p className="text-slate-200 text-base md:text-xl mb-8 font-medium opacity-90 drop-shadow-md">
                                            {featuredPost.metaDescription}
                                        </p>
                                        <div className="flex items-center gap-6 mb-8 text-sm md:text-base text-slate-300">
                                            <span className="flex items-center gap-2"><User size={18} className="text-blue-400" /> {featuredPost.author}</span>
                                            <span className="flex items-center gap-2"><Calendar size={18} className="text-blue-400" /> {featuredPost.publishedDate ? new Date(featuredPost.publishedDate).toLocaleDateString() : 'Recent'}</span>
                                        </div>
                                        <Link href={`/blog/${featuredPost.slug}`} className="inline-flex items-center gap-2 bg-white text-slate-950 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-500 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-xl">
                                            Read More <ArrowRight size={20} />
                                        </Link>
                                    </motion.div>
                                </div>
                            </section>
                        )}

                        {/* Popular Categories */}
                        <section className="mb-20">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter text-white">Popular Topics</h3>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {['Destinations', 'Travel Tips', 'Itineraries', 'Photography'].map((cat) => (
                                    <div key={cat} 
                                        className="group relative overflow-hidden rounded-3xl p-8 bg-slate-900/50 border border-slate-800 transition-all text-center">
                                        <div className="absolute inset-0 bg-blue-600/0 transition-colors" />
                                        <span className="relative z-10 text-lg font-bold text-slate-300 group-hover:text-white">{cat}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Latest Posts */}
                        <section>
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                                <div>
                                    <h3 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white mb-4">Latest Stories</h3>
                                    <p className="text-slate-400 text-lg max-w-2xl font-medium">Curated travel inspiration and tactical advice for your next weekend escape.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                {latestPosts.map((post, index) => (
                                    <motion.article 
                                        key={post._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="group flex flex-col h-full bg-slate-900/30 rounded-[2rem] overflow-hidden border border-slate-800/50 hover:border-blue-500/30 transition-all shadow-xl hover:shadow-2xl"
                                    >
                                        <Link href={`/blog/${post.slug}`} className="block relative aspect-[16/10] overflow-hidden">
                                            <Image
                                                src={post.heroImage}
                                                alt={post.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute top-4 left-4">
                                                <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full border border-white/10">
                                                    {post.keyword.split(' ')[0]}
                                                </span>
                                            </div>
                                        </Link>
                                        <div className="p-8 flex flex-col flex-1">
                                            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">
                                                <span className="flex items-center gap-1.5"><Clock size={12} className="text-blue-500" /> {post.readingTime}</span>
                                            </div>
                                            <h4 className="text-2xl font-bold text-white mb-4 leading-snug group-hover:text-blue-400 transition-colors">
                                                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                                            </h4>
                                            <p className="text-slate-400 text-sm mb-8 leading-relaxed font-medium flex-1">
                                                {post.metaDescription}
                                            </p>
                                            <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                                                        {post.author.charAt(0)}
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-300">{post.author}</span>
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-500">{new Date(post.publishedDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </motion.article>
                                ))}
                            </div>
                        </section>
                    </>
                )}

                {/* Newsletter */}
                <section className="mt-32 relative rounded-[3rem] overflow-hidden p-1 p-px bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 shadow-2xl">
                    <div className="bg-slate-950/90 backdrop-blur-xl rounded-[2.9rem] px-8 py-16 md:px-20 md:py-24 text-center">
                        <h3 className="text-4xl md:text-5xl lg:text-6xl font-black italic uppercase tracking-tighter text-white mb-6">Join the Weekend Tribe</h3>
                        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium">Get secret weekend routes and early access to our AI features delivered once a week. No spam, ever.</p>
                        
                        <form className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto group">
                            <input 
                                type="email" 
                                placeholder="Your email address" 
                                className="flex-1 bg-slate-900 border border-slate-800 focus:border-blue-500 outline-none rounded-2xl px-6 py-4 text-white placeholder:text-slate-500 transition-all shadow-inner"
                            />
                            <button className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-xs px-10 py-4 rounded-2xl transition-all shadow-lg shadow-blue-900/40 active:scale-95">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </section>
            </main>
        </div>
    );
}
