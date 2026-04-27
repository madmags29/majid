import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, User, ChevronRight, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import InnerHeader from '@/components/InnerHeader';
import { Button } from '@/components/ui/button';
import { API_URL, IS_BUILD } from '@/lib/config';
import ReactMarkdown from 'react-markdown';
import CommentSection from '@/components/blog/CommentSection';
import Breadcrumbs from '@/components/Breadcrumbs';

// Configure dynamic routing handling gracefully
interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    
    const backendUrl = process.env.BACKEND_URL
        || process.env.NEXT_PUBLIC_API_URL
        || 'https://backend-flax-eight-93.vercel.app';

    let post = null;
    try {
        const res = await fetch(`${backendUrl}/api/blog/${slug}`);
        if (res.ok) post = await res.json();
    } catch (e) {}

    if (!post) return { title: 'Blog Post Not Found' };

    return {
        title: post.title,
        description: post.metaDescription,
        keywords: [post.keyword, 'weekend getaway India', 'travel guide India', 'trip planning'],
        openGraph: {
            title: post.title,
            description: post.metaDescription,
            images: [post.heroImage],
            type: 'article',
            publishedTime: post.publishedDate,
            authors: [post.author],
        },
        alternates: {
            canonical: `/blog/${slug}`,
        }
    };
}

export default async function BlogPostDetail({ params }: Props) {
    const { slug } = await params;
    let post = null;

    // For SSR on Vercel: rewrites only apply to browser requests, NOT server-side fetch.
    const backendUrl = process.env.BACKEND_URL
        || process.env.NEXT_PUBLIC_API_URL
        || 'https://backend-flax-eight-93.vercel.app';

    try {
        if (IS_BUILD && backendUrl.includes('localhost')) {
            console.log(`Skipping blog post fetch for ${slug} during build...`);
        } else {
            const res = await fetch(`${backendUrl}/api/blog/${slug}`, { 
                next: { revalidate: 3600 }
            });
            if (res.ok) {
                const data = await res.json();
                if (data.content && typeof data.content === 'string' && data.content.startsWith('{')) {
                    data.parsedContent = JSON.parse(data.content);
                }
                post = data;
            }
        }
    } catch (error) {
        console.error('Failed to fetch blog post:', error);
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
            <InnerHeader title="Weekend Travellers Blog" subtitle={post.keyword || 'Blog'} showBack backHref="/blog" />

            <div className="container mx-auto px-4 pt-6 lg:max-w-6xl">
                <Breadcrumbs 
                    items={[
                        { label: 'Travel Blog', href: '/blog' },
                        { label: post.title, href: `/blog/${post.slug}`, active: true }
                    ]} 
                />
            </div>

            {/* Hero Section */}
            <header className="relative w-full h-[60vh] min-h-[400px]">
                <Image
                    src={post.heroImage || '/placeholder.jpg'}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
                <div className="absolute bottom-10 left-0 w-full px-4">
                    <div className="container mx-auto lg:max-w-4xl text-center md:text-left">
                        <span className="inline-block px-4 py-1.5 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest rounded-full mb-6">
                            {post.keyword || 'TRAVEL'}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 leading-tight drop-shadow-2xl">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-slate-200 font-medium">
                            <span className="flex items-center gap-2"><User size={18} className="text-blue-400" /> {post.author}</span>
                            <span className="flex items-center gap-2"><Calendar size={18} className="text-blue-400" /> {post.publishedDate ? new Date(post.publishedDate).toLocaleDateString() : 'Recent'}</span>
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
                            {parsedContent?.sections?.map((section: any, i: number) => (
                                <a key={i} href={`#section-${i}`} className="text-slate-400 hover:text-blue-400 transition-colors text-sm font-medium">
                                    {i + 1}. {section.heading}
                                </a>
                            ))}
                        </nav>
                    </div>

                    {/* Dynamic Sections */}
                    <div className="space-y-20">
                        {parsedContent?.sections?.map((section: any, i: number) => (
                            <section key={i} id={`section-${i}`} className="prose prose-invert prose-2xl max-w-none">
                                <h2 className="text-3xl md:text-4xl font-black text-white mb-6 italic tracking-tight uppercase">
                                    {section.heading}
                                </h2>
                                <div className="text-slate-400 leading-relaxed space-y-6">
                                    <ReactMarkdown>{section.content}</ReactMarkdown>
                                </div>
                                {post.images && post.images[i] && (
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
                    {/* Comment Section (Remains a highly interactive client component!) */}
                    <CommentSection postSlug={post.slug} apiUrl={API_URL} />
                </article>

                {/* Sidebar */}
                <aside className="lg:w-1/3">
                    <div className="sticky top-32 space-y-12">
                        {/* Author Card */}
                        <div className="p-8 bg-slate-900/50 rounded-3xl border border-slate-800 text-center">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mx-auto mb-6 flex items-center justify-center text-white font-black text-3xl shadow-xl">
                                {post.author ? post.author.charAt(0) : 'W'}
                            </div>
                            <h4 className="text-xl font-bold text-white mb-2">{post.author || 'Editorial'}</h4>
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

            {/* AdSense Optimization: High-Value Content Section */}
            <section className="container mx-auto px-4 py-20 lg:max-w-4xl border-t border-white/5 mt-20">
                <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-8 md:p-12">
                    <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tight italic">Structural Quality & Editorial Integrity</h2>
                    <div className="space-y-6 text-slate-400 text-sm leading-relaxed">
                        <p>
                            At Weekend Travellers, we believe that travel journalism in 2026 demands a higher standard of accuracy and logistical verification. Every article published under our &quot;Editorial&quot; banner—including this guide—is subjected to a comprehensive multi-point audit combining computational data and human expertise.
                        </p>
                        <p>
                            <strong>A Commitment to E-E-A-T</strong><br/>
                            This content is designed to meet the highest standards of Experience, Expertise, Authoritativeness, and Trustworthiness (E-E-A-T). For more details on how we curate our weekend itineraries and verify local gems, please visit our <Link href="/about" className="text-blue-400 hover:underline">About Us</Link> page.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
