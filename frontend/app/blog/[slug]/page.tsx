import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, User, ChevronRight, Share2, Facebook, Twitter, Linkedin, Sparkles, MapPin, Compass, CheckCircle2 } from 'lucide-react';
import InnerHeader from '@/components/InnerHeader';
import { Button } from '@/components/ui/button';
import { API_URL, IS_BUILD } from '@/lib/config';
import ReactMarkdown from 'react-markdown';
import CommentSection from '@/components/blog/CommentSection';
import BlogSidebar from '@/components/blog/BlogSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';

// Configure dynamic routing handling gracefully
interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    
    const primaryUrl = process.env.BACKEND_URL
        || process.env.NEXT_PUBLIC_API_URL
        || 'https://backend-flax-eight-93.vercel.app';
    const fallbackUrl = 'https://backend-flax-eight-93.vercel.app';

    let post = null;
    try {
        const res = await fetch(`${primaryUrl}/api/blog/${slug}`);
        if (res.ok) post = await res.json();
    } catch (e) {}

    if (!post && primaryUrl !== fallbackUrl) {
        try {
            const res = await fetch(`${fallbackUrl}/api/blog/${slug}`);
            if (res.ok) post = await res.json();
        } catch (e) {}
    }

    if (!post) return { title: 'Blog Post Not Found' };

    return {
        title: post.metaTitle || post.title,
        description: post.metaDescription,
        keywords: [post.keyword, 'weekend getaway India', 'travel guide India', 'trip planning', 'weekend itineraries', 'AI weekend planner'],
        openGraph: {
            title: post.metaTitle || post.title,
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
    const primaryUrl = process.env.BACKEND_URL
        || process.env.NEXT_PUBLIC_API_URL
        || 'https://backend-flax-eight-93.vercel.app';
    const fallbackUrl = 'https://backend-flax-eight-93.vercel.app';

    const fetchPostFromUrl = async (url: string) => {
        const res = await fetch(`${url}/api/blog/${slug}?t=${Date.now()}`, { 
            cache: 'no-store',
            next: { revalidate: 0 }
        });
        if (res.ok) {
            const data = await res.json();
            if (data.content && typeof data.content === 'string' && data.content.startsWith('{')) {
                data.parsedContent = JSON.parse(data.content);
            }
            return data;
        }
        return null;
    };

    try {
        if (!IS_BUILD || !primaryUrl.includes('localhost')) {
            post = await fetchPostFromUrl(primaryUrl);
        }
    } catch (error) {
        // Fallback below
    }

    if (!post && primaryUrl !== fallbackUrl) {
        try {
            post = await fetchPostFromUrl(fallbackUrl);
        } catch (err) {
            console.error('Failed to fetch blog post from fallback URL:', err);
        }
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
            '@type': 'Organization',
            name: post.author || 'Weekend Travellers',
            url: 'https://weekendtravellers.com'
        },
        publisher: {
            '@type': 'Organization',
            name: 'Weekend Travellers',
            logo: {
                '@type': 'ImageObject',
                url: 'https://weekendtravellers.com/icon.svg'
            }
        },
        description: post.metaDescription,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://weekendtravellers.com/blog/${post.slug}`,
        },
        about: {
            '@type': 'Thing',
            name: post.keyword || post.title
        },
        speakable: {
            '@type': 'SpeakableSpecification',
            cssSelector: ['h1', '.blog-intro-text', '.aeo-direct-answer']
        }
    };

    const touristTripSchema = parsedContent?.tripSnapshot ? {
        '@context': 'https://schema.org',
        '@type': 'TouristTrip',
        name: post.title,
        description: post.metaDescription,
        touristType: ['Weekend Travelers', 'Short Vacationers', 'Adventure Seekers'],
        itinerary: parsedContent.sections ? {
            '@type': 'ItemList',
            numberOfItems: parsedContent.sections.length,
            itemListElement: parsedContent.sections.map((sec: any, idx: number) => ({
                '@type': 'ListItem',
                position: idx + 1,
                name: sec.heading
            }))
        } : undefined,
        offers: {
            '@type': 'Offer',
            price: parsedContent.tripSnapshot.estimatedBudget || 'Free',
            priceCurrency: 'INR'
        }
    } : null;

    const faqsList = post.faqs || parsedContent?.faqs || [];
    const faqSchema = faqsList.length > 0 ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqsList.map((f: any) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: f.answer
            }
        }))
    } : null;

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://weekendtravellers.com'
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Blog',
                item: 'https://weekendtravellers.com/blog'
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: post.title,
                item: `https://weekendtravellers.com/blog/${post.slug}`
            }
        ]
    };

    return (
        <main className="min-h-screen bg-[#020617] text-slate-200 pb-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostSchema) }}
            />
            {touristTripSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(touristTripSchema) }}
                />
            )}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            {faqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}
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
                    src={post.heroImage || 'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=1200'}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
                <div className="absolute bottom-10 left-0 w-full px-4">
                    <div className="container mx-auto lg:max-w-4xl text-center md:text-left">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-6">
                            <span className="inline-block px-4 py-1.5 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg shadow-blue-500/20">
                                {post.keyword || 'TRAVEL'}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6 leading-tight drop-shadow-2xl">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-slate-200 font-medium">
                            <span className="flex items-center gap-2"><User size={18} className="text-blue-400" /> {post.author}</span>
                            <span className="flex items-center gap-2"><Calendar size={18} className="text-blue-400" /> {post.publishedDate ? new Date(post.publishedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recent'}</span>
                            <span className="flex items-center gap-2"><Clock size={18} className="text-blue-400" /> {post.readingTime}</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-16 lg:max-w-6xl flex flex-col lg:flex-row gap-16">
                {/* Content Area */}
                <article className="lg:w-2/3">
                    {/* Introduction */}
                    <div className="text-xl text-slate-300 leading-relaxed mb-10 font-medium border-l-4 border-blue-500 pl-6 py-2 italic bg-blue-500/5 rounded-r-2xl blog-intro-text">
                        {parsedContent?.introduction}
                    </div>

                    {/* AEO Direct Answer Callout */}
                    {parsedContent?.directAnswer && (
                        <div className="mb-10 p-6 md:p-8 rounded-3xl bg-gradient-to-br from-blue-950/50 via-slate-900/70 to-slate-900/90 border border-blue-500/30 shadow-2xl relative overflow-hidden">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="flex h-2 w-2 rounded-full bg-blue-400" />
                                <span className="text-xs font-bold uppercase tracking-wider text-blue-300 bg-blue-950/80 px-3 py-1 rounded-full border border-blue-500/30">
                                    Trip Overview • Quick Summary
                                </span>
                            </div>
                            <p className="text-slate-100 text-base md:text-lg font-medium leading-relaxed aeo-direct-answer">
                                {parsedContent.directAnswer}
                            </p>
                        </div>
                    )}

                    {/* Trip Snapshot Quick Facts Widget */}
                    {parsedContent?.tripSnapshot && (
                        <div className="mb-10 grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 p-5 md:p-6 bg-slate-900/60 rounded-3xl border border-slate-800">
                            <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/30">
                                <span className="text-[10px] md:text-xs text-slate-400 uppercase font-semibold tracking-wider block mb-1">Ideal Duration</span>
                                <span className="text-sm md:text-base font-bold text-white flex items-center gap-1"><Clock size={14} className="text-blue-400" /> {parsedContent.tripSnapshot.idealDuration}</span>
                            </div>
                            <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/30">
                                <span className="text-[10px] md:text-xs text-slate-400 uppercase font-semibold tracking-wider block mb-1">Est. Budget</span>
                                <span className="text-sm md:text-base font-bold text-emerald-400">{parsedContent.tripSnapshot.estimatedBudget}</span>
                            </div>
                            <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/30">
                                <span className="text-[10px] md:text-xs text-slate-400 uppercase font-semibold tracking-wider block mb-1">Best Season</span>
                                <span className="text-sm md:text-base font-bold text-slate-200">{parsedContent.tripSnapshot.bestSeason}</span>
                            </div>
                            <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/30">
                                <span className="text-[10px] md:text-xs text-slate-400 uppercase font-semibold tracking-wider block mb-1">Transit Hub</span>
                                <span className="text-xs md:text-sm font-bold text-blue-300 truncate block" title={parsedContent.tripSnapshot.nearestHub}>{parsedContent.tripSnapshot.nearestHub}</span>
                            </div>
                        </div>
                    )}

                    {/* Key Takeaways */}
                    {parsedContent?.keyTakeaways && parsedContent.keyTakeaways.length > 0 && (
                        <div className="mb-12 p-6 md:p-8 rounded-3xl bg-slate-900/40 border border-slate-800">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Sparkles className="text-yellow-400" size={18} /> Essential Trip Highlights & Takeaways
                            </h3>
                            <ul className="space-y-3">
                                {parsedContent.keyTakeaways.map((takeaway: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-3 text-slate-300 text-sm md:text-base leading-relaxed">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold mt-0.5">
                                            {idx + 1}
                                        </span>
                                        <span>{takeaway}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

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

                    {/* Interactive AI Trip Planner Callout */}
                    <div className="my-16 p-8 md:p-10 rounded-[2.5rem] bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-slate-900 border border-blue-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                        <div>
                            <span className="text-xs uppercase font-bold text-blue-400 tracking-widest block mb-2">
                                Instant AI Customization
                            </span>
                            <h3 className="text-2xl md:text-3xl font-black text-white mb-2">
                                Customize This {post.keyword || 'Weekend'} Trip
                            </h3>
                            <p className="text-slate-300 text-sm md:text-base max-w-xl leading-relaxed">
                                Want a personalized version adjusted for your travel dates, departure city, hotel preferences, and exact budget? Let our AI assistant generate your custom itinerary in 30 seconds.
                            </p>
                        </div>
                        <Link href={`/chat?q=${encodeURIComponent('Plan a customized weekend trip for ' + (post.keyword || post.title))}`} className="w-full md:w-auto">
                            <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-6 rounded-2xl shadow-xl shadow-blue-500/20 whitespace-nowrap text-base">
                                Personalize in AI Chat
                            </Button>
                        </Link>
                    </div>

                    {/* FAQ Section */}
                    {post.faqs && post.faqs.length > 0 && (
                        <section className="mt-20 p-8 md:p-12 bg-gradient-to-br from-blue-900/10 to-purple-900/10 rounded-[2.5rem] border border-white/5">
                            <h2 className="text-2xl md:text-3xl font-black text-white mb-8 flex items-center gap-3">
                                <Compass className="text-blue-400" size={28} /> Frequently Asked Questions
                            </h2>
                            <div className="space-y-6">
                                {post.faqs.map((faq: any, i: number) => (
                                    <div key={i} className="bg-slate-900/40 p-6 md:p-8 rounded-2xl border border-slate-800/50">
                                        <h4 className="text-lg font-bold text-white mb-3 flex items-start gap-2">
                                            <span className="text-blue-400 font-black">Q:</span>
                                            <span>{faq.question}</span>
                                        </h4>
                                        <p className="text-slate-400 leading-relaxed text-sm md:text-base pl-6">
                                            {faq.answer}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                    {/* Comment Section (Remains a highly interactive client component!) */}
                    <CommentSection postSlug={post.slug} apiUrl={API_URL} />
                </article>

                {/* Sidebar */}
                <BlogSidebar author={post.author} title={post.title} slug={post.slug} />
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
