'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowRight, Loader2 } from 'lucide-react';
import InnerHeader from '@/components/InnerHeader';
import AdBanner from '@/components/AdBanner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { API_URL } from '@/lib/config';
import { toast } from 'sonner';

interface BlogPostItem {
    _id: string;
    slug: string;
    title: string;
    heroImage: string;
    keyword?: string;
    publishedDate?: string;
    readingTime?: string;
    metaDescription?: string;
    author?: string;
}

export default function BlogClientPage({ posts }: { posts: BlogPostItem[] }) {
    const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
    const [newsletterEmail, setNewsletterEmail] = React.useState('');
    const [subscribing, setSubscribing] = React.useState(false);
    const [subscribed, setSubscribed] = React.useState(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        const email = newsletterEmail.trim();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error('Please enter a valid email address.');
            return;
        }
        setSubscribing(true);
        try {
            const res = await fetch(`${API_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'Blog Newsletter Reader',
                    email,
                    comment: 'Subscribed to Weekend Travellers weekly travel guide updates from /blog.',
                }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setSubscribed(true);
                setNewsletterEmail('');
                toast.success('Thanks for subscribing! We will send new weekend guides to your inbox.');
            } else {
                toast.error(data.message || 'Unable to subscribe right now. Please try again.');
            }
        } catch {
            toast.error('Connection error. Please try again later.');
        } finally {
            setSubscribing(false);
        }
    };

    const featuredPost = posts[0];
    const latestPosts = posts.slice(1);

    const filteredPosts = React.useMemo(() => {
        if (!selectedCategory) return latestPosts;
        return latestPosts.filter(post => 
            (post.keyword && post.keyword.toLowerCase().includes(selectedCategory.toLowerCase())) ||
            (post.title && post.title.toLowerCase().includes(selectedCategory.toLowerCase()))
        );
    }, [latestPosts, selectedCategory]);

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500/30">
            <InnerHeader title="Weekend Travellers Blog" subtitle="Stories & Guides" />

            <main className="container mx-auto px-4 py-12 md:py-20 lg:max-w-7xl">
                <header className="mb-10 space-y-2">
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
                        Weekend Travel Guides &amp; Stories
                    </h1>
                    <p className="text-slate-400 text-base md:text-lg max-w-2xl">
                        Practical 2-to-4 day itineraries, seasonal travel advice, and destination deep-dives.
                    </p>
                </header>
                {!posts || posts.length === 0 ? (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-bold text-white mb-4">No stories found yet.</h2>
                        <p className="text-slate-400">New editorial guides are being prepared. Check back soon!</p>
                    </div>
                ) : (
                    <>
                        {/* Hero section with Featured Post */}
                        {featuredPost && (
                            <section className="relative flex flex-col justify-end rounded-[2.5rem] overflow-hidden mb-20 min-h-[500px] lg:min-h-[600px] group shadow-2xl">
                                <Image
                                    src={featuredPost.heroImage}
                                    alt={featuredPost.title}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                                
                                <div className="relative z-10 p-6 md:p-12 w-full md:max-w-3xl mt-auto">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <div className="flex flex-wrap items-center gap-2 mb-4">
                                            <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg shadow-blue-500/20">
                                                Featured Story
                                            </span>
                                        </div>
                                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6 leading-tight drop-shadow-lg">
                                            {featuredPost.title}
                                        </h2>
                                        <p className="text-slate-200 text-base md:text-xl mb-8 font-medium opacity-90 drop-shadow-md">
                                            {featuredPost.metaDescription}
                                        </p>
                                        <div className="flex items-center gap-6 mb-8 text-sm md:text-base text-slate-300">
                                            <span className="flex items-center gap-2"><User size={18} className="text-blue-400" /> {featuredPost.author}</span>
                                            <span className="flex items-center gap-2"><Calendar size={18} className="text-blue-400" /> {featuredPost.publishedDate ? new Date(featuredPost.publishedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recent'}</span>
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
                            <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
                                <h3 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter text-white">Popular Topics</h3>
                                {selectedCategory && (
                                    <Button 
                                        variant="ghost" 
                                        onClick={() => setSelectedCategory(null)}
                                        className="text-blue-400 hover:text-white"
                                    >
                                        Clear Filter
                                    </Button>
                                )}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {['Destinations', 'Travel Tips', 'Itineraries', 'Photography'].map((cat) => (
                                    <button 
                                        key={cat} 
                                        onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                                        className={cn(
                                            "group relative overflow-hidden rounded-3xl p-8 border transition-all text-center",
                                            selectedCategory === cat 
                                                ? "bg-blue-600 border-blue-500 shadow-md shadow-blue-500/20" 
                                                : "bg-slate-900/50 border-slate-800 hover:border-blue-500/50 hover:bg-blue-500/5"
                                        )}
                                    >
                                        <div className={cn(
                                            "absolute inset-0 transition-colors",
                                            selectedCategory === cat ? "bg-blue-600/10" : "bg-blue-600/0"
                                        )} />
                                        <span className={cn(
                                            "relative z-10 text-lg font-bold transition-colors",
                                            selectedCategory === cat ? "text-white" : "text-slate-300 group-hover:text-blue-400"
                                        )}>
                                            {cat}
                                        </span>
                                    </button>
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
                                {filteredPosts.length > 0 ? (
                                    filteredPosts.map((post, index) => (
                                    <motion.article 
                                        key={post._id || post.slug}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="group flex flex-col h-full bg-slate-900/40 rounded-[2rem] overflow-hidden border border-slate-800/50 hover:border-blue-500/50 transition-all shadow-xl hover:shadow-2xl hover:shadow-blue-500/5"
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
                                                    {post.keyword ? post.keyword.split(' ')[0] : 'TRAVEL'}
                                                </span>
                                            </div>
                                        </Link>
                                        <div className="p-8 flex flex-col flex-1">
                                            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">
                                                <span className="flex items-center gap-1.5"><Clock size={12} className="text-blue-500" /> {post.readingTime || '5 min'}</span>
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
                                                        {post.author ? post.author.charAt(0) : 'W'}
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-300">{post.author || 'Editorial'}</span>
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-500">{post.publishedDate ? new Date(post.publishedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recent'}</span>
                                            </div>
                                        </div>
                                    </motion.article>
                                    ))
                                ) : (
                                    <div className="col-span-full py-20 text-center bg-slate-900/20 rounded-[2.5rem] border border-slate-800/50">
                                        <h4 className="text-xl font-bold text-white mb-2">No posts found in this category</h4>
                                        <p className="text-slate-400">Try a different category or clear the filter.</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </>
                )}

                {/* AdSense Ready - Editorial Vision Contextual Text */}
                <AdBanner
                    dataAdSlot="8765432109"
                    dataAdFormat="auto"
                    dataFullWidthResponsive={true}
                />
                <section className="py-24 border-t border-slate-800/50">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                        <div className="space-y-8">
                            <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase">Our <span className="text-purple-400">Editorial</span> Approach</h3>
                            <p className="text-slate-400 leading-relaxed text-lg">
                                Weekend Travellers focuses on practical, 2-to-4 day travel guides rather than generic long-haul roundups. Every guide is structured around realistic transit windows, seasonal weather, and neighborhood pacing.
                            </p>
                            <p className="text-slate-400 leading-relaxed text-lg">
                                We use AI tools to help draft and organize itinerary outlines, then review guides against public tourism boards, highway and rail corridors, and transparent cost estimates. Read our{' '}
                                <Link href="/editorial-policy" className="text-blue-400 hover:underline">Editorial Policy</Link>{' '}
                                and <Link href="/authors" className="text-blue-400 hover:underline">Authors page</Link> for full details.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-10 bg-slate-900/40 rounded-[2.5rem] border border-slate-800 flex flex-col items-center text-center space-y-4">
                                <span className="text-3xl font-black text-white italic tracking-tighter">AI + Review</span>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    AI assists with itinerary structuring, while editorial review checks seasonal fit and geographical feasibility.
                                </p>
                            </div>
                            <div className="p-10 bg-slate-900/40 rounded-[2.5rem] border border-slate-800 flex flex-col items-center text-center space-y-4">
                                <span className="text-3xl font-black text-white italic tracking-tighter">2–4 Days</span>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Built specifically for weekend and long-weekend travel windows—minimizing transit fatigue.
                                </p>
                            </div>
                            <div className="p-10 bg-slate-900/40 rounded-[2.5rem] border border-slate-800 flex flex-col items-center text-center space-y-4">
                                <span className="text-3xl font-black text-white italic tracking-tighter">Estimates</span>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Budgets, entry fees, and travel times are clearly labeled as planning estimates; verify live fares before booking.
                                </p>
                            </div>
                            <div className="p-10 bg-slate-900/40 rounded-[2.5rem] border border-slate-800 flex flex-col items-center text-center space-y-4">
                                <span className="text-3xl font-black text-white italic tracking-tighter">Corrections</span>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Spot an outdated price or route? Reach out anytime via our <Link href="/contact" className="text-blue-400 hover:underline">Contact page</Link>.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Newsletter */}
                <section className="mt-32 relative rounded-[3rem] overflow-hidden p-px bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 shadow-2xl">
                    <div className="bg-slate-950/90 backdrop-blur-xl rounded-[2.9rem] px-8 py-16 md:px-20 md:py-24 text-center">
                        <h3 className="text-4xl md:text-5xl lg:text-6xl font-black italic uppercase tracking-tighter text-white mb-6">Weekend Route Updates</h3>
                        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium">Get newly reviewed weekend guides and long-weekend route ideas in your inbox. No spam, ever.</p>
                        
                        {subscribed ? (
                            <p className="text-emerald-400 font-semibold text-base">
                                You&apos;re subscribed! Thank you for joining Weekend Travellers updates.
                            </p>
                        ) : (
                            <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto group">
                                <input 
                                    type="email" 
                                    required
                                    aria-label="Email address for weekend route updates"
                                    value={newsletterEmail}
                                    onChange={(e) => setNewsletterEmail(e.target.value)}
                                    placeholder="Your email address" 
                                    className="flex-1 bg-slate-900 border border-slate-800 focus:border-blue-500 outline-none rounded-2xl px-6 py-4 text-white placeholder:text-slate-500 transition-all shadow-inner"
                                />
                                <button type="submit" disabled={subscribing} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-black uppercase tracking-widest text-xs px-10 py-4 rounded-2xl transition-all shadow-lg shadow-blue-900/40 active:scale-95">
                                    {subscribing ? 'Subscribing...' : 'Subscribe'}
                                </button>
                            </form>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
