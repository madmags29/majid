'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, ChevronRight, Share2, Facebook, Twitter, Linkedin, Loader2, ArrowLeft } from 'lucide-react';
import InnerHeader from '@/components/InnerHeader';
import { Button } from '@/components/ui/button';
import { API_URL } from '@/lib/config';
import ReactMarkdown from 'react-markdown';

export default function BlogPostDetail() {
    const { slug } = useParams();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`${API_URL}/api/blog/${slug}`);
                const data = await res.json();
                if (data.content && typeof data.content === 'string' && data.content.startsWith('{')) {
                    data.parsedContent = JSON.parse(data.content);
                }
                setPost(data);
            } catch (error) {
                console.error('Failed to fetch blog post:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-4">
                <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
                <Link href="/blog">
                    <Button variant="outline">Back to Blog</Button>
                </Link>
            </div>
        );
    }

    const { parsedContent } = post;

    const blogPostSchema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        image: post.heroImage,
        datePublished: post.publishedDate,
        dateModified: post.updatedAt || post.publishedDate,
        author: {
            '@type': 'Person',
            name: post.author,
        },
        description: post.metaDescription,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://weekendtravellers.com/blog/${post.slug}`,
        },
    };

    return (
        <main className="min-h-screen bg-[#020617] text-slate-200 pb-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostSchema) }}
            />
            <InnerHeader title="Travel Blog" subtitle={post.keyword} showBack backHref="/blog" />

            {/* Hero Section */}
            <header className="relative w-full h-[60vh] min-h-[400px]">
                <Image
                    src={post.heroImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
                <div className="absolute bottom-10 left-0 w-full px-4">
                    <div className="container mx-auto lg:max-w-4xl text-center md:text-left">
                        <span className="inline-block px-4 py-1.5 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest rounded-full mb-6">
                            {post.keyword}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 leading-tight drop-shadow-2xl">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-slate-200 font-medium">
                            <span className="flex items-center gap-2"><User size={18} className="text-blue-400" /> {post.author}</span>
                            <span className="flex items-center gap-2"><Calendar size={18} className="text-blue-400" /> {new Date(post.publishedDate).toLocaleDateString()}</span>
                            <span className="flex items-center gap-2"><Clock size={18} className="text-blue-400" /> {post.readingTime}</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-16 lg:max-w-6xl flex flex-col lg:flex-row gap-16">
                {/* Content Area */}
                <article className="lg:w-2/3">
                    {/* Introduction */}
                    <div className="text-xl text-slate-300 leading-relaxed mb-12 font-medium border-l-4 border-blue-500 pl-6 py-2 italic bg-blue-500/5 rounded-r-2xl">
                        {parsedContent?.introduction}
                    </div>

                    {/* Table of Contents */}
                    <div className="mb-16 p-8 bg-slate-900/50 rounded-3xl border border-slate-800">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <ChevronRight className="text-blue-500" /> In this article
                        </h3>
                        <nav className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {parsedContent?.sections.map((section: any, i: number) => (
                                <a key={i} href={`#section-${i}`} className="text-slate-400 hover:text-blue-400 transition-colors text-sm font-medium">
                                    {i + 1}. {section.heading}
                                </a>
                            ))}
                        </nav>
                    </div>

                    {/* Dynamic Sections */}
                    <div className="space-y-20">
                        {parsedContent?.sections.map((section: any, i: number) => (
                            <section key={i} id={`#section-${i}`} className="prose prose-invert prose-2xl max-w-none">
                                <h2 className="text-3xl md:text-4xl font-black text-white mb-6 italic tracking-tight uppercase">
                                    {section.heading}
                                </h2>
                                <div className="text-slate-400 leading-relaxed space-y-6">
                                    <ReactMarkdown>{section.content}</ReactMarkdown>
                                </div>
                                {post.images[i] && (
                                    <div className="mt-10 relative aspect-video rounded-[2rem] overflow-hidden shadow-2xl">
                                        <Image
                                            src={post.images[i]}
                                            alt={section.heading}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                            </section>
                        ))}
                    </div>

                    {/* FAQ Section */}
                    {post.faqs && post.faqs.length > 0 && (
                        <section className="mt-32 p-10 bg-gradient-to-br from-blue-900/10 to-purple-900/10 rounded-[3rem] border border-white/5">
                            <h2 className="text-3xl font-black text-white mb-10 flex items-center gap-4">
                                Frequently Asked Questions
                            </h2>
                            <div className="space-y-8">
                                {post.faqs.map((faq: any, i: number) => (
                                    <div key={i} className="bg-slate-900/40 p-8 rounded-2xl border border-slate-800/50">
                                        <h4 className="text-lg font-bold text-white mb-3">{faq.question}</h4>
                                        <p className="text-slate-400 leading-relaxed text-sm">{faq.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </article>

                {/* Sidebar */}
                <aside className="lg:w-1/3">
                    <div className="sticky top-32 space-y-12">
                        {/* Author Card */}
                        <div className="p-8 bg-slate-900/50 rounded-3xl border border-slate-800 text-center">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mx-auto mb-6 flex items-center justify-center text-white font-black text-3xl shadow-xl">
                                {post.author.charAt(0)}
                            </div>
                            <h4 className="text-xl font-bold text-white mb-2">{post.author}</h4>
                            <p className="text-slate-400 text-sm mb-6">Expert Travel Writer & AI Specialist at Weekend Travellers.</p>
                            <div className="flex justify-center gap-4">
                                <button className="p-3 bg-slate-800 rounded-xl hover:bg-blue-600 transition-colors"><Facebook size={20} /></button>
                                <button className="p-3 bg-slate-800 rounded-xl hover:bg-blue-400 transition-colors"><Twitter size={20} /></button>
                                <button className="p-3 bg-slate-800 rounded-xl hover:bg-blue-700 transition-colors"><Linkedin size={20} /></button>
                            </div>
                        </div>

                        {/* Share Card */}
                        <div className="p-8 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-3xl border border-blue-500/20">
                            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Share2 size={20} className="text-blue-500" /> Share this Guide
                            </h4>
                            <p className="text-slate-400 text-sm mb-6">Help your friends plan their next getaway by sharing this expert guide.</p>
                            <Button className="w-full bg-white text-slate-950 hover:bg-blue-500 hover:text-white font-bold rounded-2xl py-6 transition-all shadow-xl">
                                Copy Article Link
                            </Button>
                        </div>
                    </div>
                </aside>
            </main>
        </main>
    );
}
