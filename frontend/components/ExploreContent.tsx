'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowLeft, Sparkles, Utensils, Compass, Share2, Maximize2, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { cn, formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

// Dynamically import components to avoid SSR issues
const MapView = dynamic(() => import('@/components/MapView'));
const WeatherWidget = dynamic(() => import('@/components/WeatherWidget'));
const TypewriterText = dynamic(() => import('@/components/TypewriterText'));
import CinematicLoader from '@/components/CinematicLoader';
import AdBanner from '@/components/AdBanner';
import { API_URL } from '@/lib/config';

interface Activity {
    time: string;
    description: string;
    location: string;
    imageUrl?: string;
    ticket_price?: string;
}

interface Day {
    day: number;
    title: string;
    activities: Activity[];
}

interface DestinationData {
    destination: string;
    summary: string;
    deep_content: string;
    trip_details: {
        currency: string;
        estimated_budget: string;
        best_time_to_visit: string;
        hotel_suggestions: {
            name: string;
            tier: string;
            price_range: string;
        }[];
        destination_coordinates: {
            lat: number;
            lng: number;
        };
    };
    days: Day[];
    slug: string;
    heroVideo?: {
        url: string;
        photographer: string;
        photographer_url: string;
    } | null;
    heroImage?: {
        url: string;
        photographer: string;
        photographer_url: string;
    } | null;
}

export default function ExploreContent({ slug }: { slug: string }) {
    const [leftWidth, setLeftWidth] = useState(60); // Percentage width of left panel
    const [isResizing, setIsResizing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDesktop, setIsDesktop] = useState(true);

    useEffect(() => {
        const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
        checkDesktop();
        window.addEventListener('resize', checkDesktop);
        return () => window.removeEventListener('resize', checkDesktop);
    }, []);

    const [data, setData] = useState<DestinationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSharing, setIsSharing] = useState(false);
    const [isMapFullscreen, setIsMapFullscreen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Use relative path to leverage Next.js rewrites (more robust for CORS)
                const fetchUrl = `/api/explore?slug=${encodeURIComponent(slug)}`;
                const res = await fetch(fetchUrl);
                if (!res.ok) throw new Error('Destination not found');
                const result = await res.json();
                setData(result);
            } catch (err) {
                console.error('Explore fetch error:', err);
                setError('We couldn\'t load this destination. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    const loadingMessages = [
        "Curating your ultimate exploration guide...",
        "Sourcing high-definition travel wisdom...",
        "Discovering hidden gems and local secrets...",
        "Mapping out your perfect weekend escape...",
        "Compiling 2000 words of wanderlust-worthy insights..."
    ];

    const handleShare = async () => {
        if (!data) return;
        const url = window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Discover ${data.destination}`,
                    text: `Check out this amazing guide to ${data.destination} on Weekend Travellers!`,
                    url
                });
            } catch (err) {
                console.error('Share failed:', err);
            }
        } else if (navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(url);
                setIsSharing(true);
                toast.success('Link copied to clipboard!');
                setTimeout(() => setIsSharing(false), 2000);
            } catch (err) {
                console.error('Clipboard write failed:', err);
                toast.error('Failed to copy link');
            }
        } else {
            console.warn('Clipboard API unavailable');
            toast.error('Clipboard not supported');
        }
    };

    const [isMediaReady, setIsMediaReady] = useState(false);

    // Prioritize CinematicLoader while loading
    if (loading) {
        return (
            <AnimatePresence>
                <CinematicLoader
                    key="explore-loader"
                    messages={loadingMessages}
                />
            </AnimatePresence>
        );
    }

    // Only show error or empty state AFTER loading is finished
    if (error || !data) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center text-white p-6 relative overflow-hidden">
                {/* Background decorative elements to stay within theme */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="text-center z-10 max-w-md">
                    <div className="mb-8 flex justify-center">
                        <div className="p-6 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                            <Compass className="w-12 h-12 text-slate-400 animate-pulse" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-black italic tracking-tighter mb-4 uppercase">Lost in Translation</h1>
                    <p className="text-lg text-slate-400 mb-10 leading-relaxed">
                        {error || "We couldn't find the guide for this destination yet. Our AI scouts are out exploring!"}
                    </p>
                    <Link href="/">
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-8 h-12 font-bold shadow-lg shadow-blue-500/20 border-0 transition-all hover:scale-105 active:scale-95">
                            Return to Homepage
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizing(true);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isResizing || !containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

        // Clamp width between 30% and 70%
        if (newLeftWidth >= 30 && newLeftWidth <= 70) {
            setLeftWidth(newLeftWidth);
        }
    };

    const handleMouseUp = () => {
        setIsResizing(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className={cn("min-h-screen bg-[#0f172a] text-slate-100 flex flex-col", isResizing && "cursor-col-resize select-none")}
        >
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/50 backdrop-blur-xl border-b border-white/10 px-6 py-4">
                <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                        <ArrowLeft className="w-6 h-6 text-blue-400" />
                        <TypewriterText
                            text="weekendtravellers.com"
                            className="font-cursive text-xl md:text-4xl"
                            delay={500}
                        />
                    </Link>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10" onClick={handleShare}>
                            {isSharing ? <Check className="w-5 h-5 text-green-400" /> : <Share2 className="w-5 h-5" />}
                        </Button>
                        <Link href={`/search?destination=${encodeURIComponent(data.destination)}`}>
                            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 border-0 rounded-xl px-6 transition-all transform hover:scale-105 active:scale-95">Customize Trip</Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative h-[70vh] w-full pt-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/20 to-[#0f172a]/40 z-20" />
                <div className="absolute inset-0 bg-black/40 z-10" />

                {/* Dynamic Hero Media */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isMediaReady ? 1 : 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 z-0"
                >
                    {data.heroVideo ? (
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            onLoadedData={() => setIsMediaReady(true)}
                            className="w-full h-full object-cover"
                            poster={data.heroImage?.url}
                        >
                            <source src={data.heroVideo.url} type="video/mp4" />
                        </video>
                    ) : (
                        <div
                            className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${data.heroImage?.url || 'https://images.pexels.com/photos/2044434/pexels-photo-2044434.jpeg'})` }}
                            onLoad={() => setIsMediaReady(true)}
                        />
                    )}
                </motion.div>

                {/* Photographer Attribution */}
                {(data.heroVideo || data.heroImage) && (
                    <div className="absolute bottom-4 right-6 z-30 text-[10px] text-slate-400 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                        {data.heroVideo ? (
                            <>Video by <a href={data.heroVideo.photographer_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{data.heroVideo.photographer}</a></>
                        ) : (
                            <>Photo by <a href={data.heroImage?.photographer_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{data.heroImage?.photographer}</a></>
                        )}
                        <span className="ml-1 opacity-50">on Pexels</span>
                    </div>
                )}

                <div className="relative z-30 h-full flex flex-col items-center justify-end pb-12 px-6 text-center max-w-7xl mx-auto w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex justify-center mb-6">
                            <TypewriterText
                                text="Ultimate Exploration Guide"
                                className="text-xs md:text-sm font-black tracking-[0.3em] uppercase text-blue-400 opacity-80"
                            />
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white mb-6 drop-shadow-2xl uppercase">
                            {data.destination}
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto leading-relaxed drop-shadow-md font-medium">
                            {data.summary}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Content Layout */}
            <main className={cn(
                "max-w-7xl mx-auto px-6 py-16 flex flex-col lg:flex-row gap-8 relative",
                isMapFullscreen ? "z-[10000]" : "z-20"
            )} ref={containerRef} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>

                {/* Main Content Column (Resizable) */}
                <div
                    className="flex-shrink-0 relative group/resize"
                    style={{
                        width: isDesktop ? `${leftWidth}%` : '100%'
                    }}
                >
                    <div className="space-y-16 pr-4">
                        {/* Deep Dive Content (SEO Text) */}
                        <article className="prose prose-invert max-w-4xl 
                        prose-p:font-sans prose-p:text-slate-300 prose-p:text-base md:prose-p:text-lg prose-p:leading-relaxed prose-p:mb-6 [&>p]:whitespace-pre-line
                        prose-headings:font-sans prose-headings:italic prose-headings:tracking-tighter
                        prose-h1:text-2xl md:prose-h1:text-4xl prose-h1:font-black prose-h1:mb-8 prose-h1:text-white prose-h1:uppercase
                        prose-h2:text-xl md:prose-h2:text-3xl prose-h2:font-black prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-blue-400 prose-h2:italic prose-h2:uppercase
                        prose-h3:text-lg md:prose-h3:text-xl prose-h3:font-black prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-slate-100 prose-h3:uppercase
                        prose-li:font-sans prose-li:text-slate-300 prose-li:text-base md:prose-li:text-lg
                        prose-strong:text-white prose-strong:font-bold
                        antialiased">
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: (data.deep_content || '')
                                        // Robust fallback: post-process HTML to ensure spacing if AI bunches text
                                        .replace(/([A-Z][a-zA-Z\s]+):/g, '<br/><br/><strong class="text-white text-lg block mb-1">$1</strong>')
                                        .replace(/<br\/><br\/>/g, '<div class="h-4"></div>') // Semantic spacer
                                }}
                                className="[&>h1]:font-sans [&>h1]:font-black [&>h1]:italic [&>h1]:text-white [&>h1]:text-2xl md:[&>h1]:text-4xl [&>h1]:mb-8 [&>h1]:leading-[1.1] [&>h1]:uppercase
                                       [&>p]:font-sans [&>p]:text-slate-300 [&>p]:text-base md:[&>p]:text-lg [&>p]:leading-relaxed [&>p]:mb-6 [&>p]:whitespace-pre-line
                                       [&>h2]:font-sans [&>h2]:font-black [&>h2]:italic [&>h2]:text-xl md:[&>h2]:text-3xl [&>h2]:mt-12 [&>h2]:mb-6 [&>h2]:text-blue-400 [&>h2]:uppercase [&>h2]:flex [&>h2]:items-start [&>h2]:gap-4
                                       [&>h2]:before:content-[''] [&>h2]:before:w-1.5 [&>h2]:before:h-6 md:[&>h2]:before:h-8 [&>h2]:before:bg-blue-600 [&>h2]:before:rounded-full [&>h2]:before:shrink-0 [&>h2]:before:mt-1
                                       [&>h3]:font-sans [&>h3]:font-black [&>h3]:italic [&>h3]:text-lg md:[&>h3]:text-xl [&>h3]:mt-8 [&>h3]:mb-4 [&>h3]:text-slate-100 [&>h3]:uppercase [&>h3]:tracking-tight
                                       [&>ul]:mb-8 [&>li]:mb-8 [&>li]:leading-relaxed
                                       [&>hr]:border-none [&>hr]:h-px [&>hr]:bg-gradient-to-r [&>hr]:from-transparent [&>hr]:via-white/10 [&>hr]:to-transparent [&>hr]:my-16"
                            />
                        </article>

                        {/* AdSense - Main Content Interstitial */}
                        <div className="w-full flex justify-center py-8">
                            <AdBanner
                                dataAdSlot="8888999900"
                                className="bg-slate-900/50 rounded-2xl border border-white/5"
                            />
                        </div>

                        {/* Itinerary Visualization */}
                        <div className="pt-12 border-t border-white/10">
                            <h2 className="text-4xl font-black italic tracking-tight mb-8 flex items-center gap-4">
                                <Compass className="w-10 h-10 text-blue-500" />
                                THE PERFECT WEEKEND PLAN
                            </h2>

                            <div className="space-y-12">
                                {(data.days || []).map((day: Day) => (
                                    <div key={day.day} className="bg-slate-900/40 rounded-3xl border border-white/5 overflow-hidden">
                                        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 px-8 py-6 border-b border-white/5">
                                            <h3 className="text-2xl font-bold flex items-center gap-3">
                                                <span className="bg-white text-[#0f172a] px-4 py-1.5 rounded-full flex items-center justify-center text-sm font-black whitespace-nowrap shadow-lg shadow-white/10">
                                                    Day {day.day}
                                                </span>
                                                {day.title}
                                            </h3>
                                        </div>
                                        <div className="p-8 space-y-8">
                                            {(day.activities || []).map((activity: Activity, idx: number) => (
                                                <div key={idx} className="flex flex-col md:flex-row gap-8 group">
                                                    {activity.imageUrl && (
                                                        <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden shrink-0 relative">
                                                            <Image
                                                                src={activity.imageUrl}
                                                                alt={activity.location}
                                                                fill
                                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                                sizes="(max-width: 768px) 100vw, 192px"
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <span className="text-blue-400 text-sm font-bold tracking-widest uppercase">
                                                                {activity.time}
                                                            </span>
                                                            {activity.ticket_price && (
                                                                <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold border border-white/5">
                                                                    {activity.ticket_price}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <h4 className="text-xl font-bold mb-2 flex items-center gap-2">
                                                            <MapPin className="w-4 h-4 text-slate-500" />
                                                            {activity.location}
                                                        </h4>
                                                        <p className="text-slate-400 leading-relaxed">
                                                            {activity.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>

                {/* Resize Handle (Desktop Only) */}
                {isDesktop && (
                    <div
                        className="w-4 cursor-col-resize flex items-center justify-center hover:bg-white/5 transition-colors absolute top-0 bottom-0 z-50 select-none touch-none"
                        style={{ left: `calc(${leftWidth}% + 1rem)` }}
                        onMouseDown={handleMouseDown}
                    >
                        <div className="h-12 w-1.5 rounded-full bg-slate-700/50 group-hover:bg-blue-500 transition-colors" />
                    </div>
                )}

                {/* Sidebar / Map Column */}
                <div
                    className="flex-grow space-y-8 sticky top-24 h-fit"
                    style={{
                        width: isDesktop ? `${100 - leftWidth}%` : '100%',
                        marginLeft: isDesktop ? '2rem' : 0
                    }}
                >
                    {/* Quick Stats */}
                    <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-yellow-500" />
                            TRIP VITAL SIGNS
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                                    <span className="text-green-500 font-bold">$</span>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Est. Budget</p>
                                    <p className="text-lg font-bold text-emerald-400">{formatCurrency(data.trip_details.estimated_budget, data.trip_details.currency)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                                    <Compass className="w-5 h-5 text-orange-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Best Time</p>
                                    <p className="text-lg font-bold">{data.trip_details.best_time_to_visit}</p>
                                </div>
                            </div>
                            <WeatherWidget
                                lat={data.trip_details?.destination_coordinates?.lat || 0}
                                lng={data.trip_details?.destination_coordinates?.lng || 0}
                            />
                        </div>
                    </div>

                    {/* Interactive Map */}
                    <div className={cn(
                        "overflow-hidden border border-white/10 shadow-2xl relative transition-all duration-500",
                        isMapFullscreen
                            ? "fixed inset-0 z-[9999] bg-[#0f172a] rounded-none border-none"
                            : "h-[400px] rounded-3xl"
                    )}>
                        <div className={cn(
                            "absolute z-[10001] flex gap-2 transition-all duration-500",
                            isMapFullscreen ? "top-8 right-8" : "top-4 right-4"
                        )}>
                            <Button
                                variant="default"
                                size="icon"
                                className="rounded-2xl bg-blue-600 hover:bg-blue-700 border-none shadow-2xl w-12 h-12"
                                onClick={() => setIsMapFullscreen(!isMapFullscreen)}
                            >
                                {isMapFullscreen ? <X className="w-6 h-6 text-white" /> : <Maximize2 className="w-6 h-6 text-white" />}
                            </Button>
                        </div>
                        <MapView itinerary={data} selectedActivity={null} isExpanded={isMapFullscreen} />
                    </div>

                    {/* AdSense - Sidebar */}
                    <AdBanner
                        dataAdSlot="2222333344"
                        className="bg-slate-900/50 rounded-2xl border border-white/5"
                    />

                    {/* Where to Stay */}
                    <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Utensils className="w-5 h-5 text-purple-500" />
                            TOP SLEEP SPOTS
                        </h3>
                        <div className="space-y-4">
                            {(data.trip_details?.hotel_suggestions || []).map((hotel, idx) => {
                                const hotelUrl = `https://www.agoda.com/partners/partnersearch.aspx?cid=1959241&apikey=83110ffd-89b7-4c2e-a4e9-d4a8f52de4ec&searchText=${encodeURIComponent(hotel.name + ' ' + data.destination)}`;
                                return (
                                    <a
                                        key={idx}
                                        href={hotelUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-blue-500/50 transition-all group"
                                    >
                                        <div className="flex items-start justify-between">
                                            <h4 className="font-bold group-hover:text-blue-400 transition-colors">{hotel.name}</h4>
                                            <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-black uppercase">
                                                {hotel.tier}
                                            </span>
                                        </div>
                                        <p className="text-xs font-bold text-emerald-400 mt-1">{formatCurrency(hotel.price_range, data.trip_details?.currency || hotel.price_range)}</p>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </main>

            {/* CTA Footer */}
            <section className="bg-slate-950/80 backdrop-blur-2xl border-t border-white/10 py-20 px-6 text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-black italic tracking-tight mb-6">READY TO PACK YOUR BAGS?</h2>
                    <p className="text-xl text-slate-400 mb-10">Customize this itinerary or chat with our AI to craft your perfect getaway.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href={`/search?destination=${encodeURIComponent(data.destination)}`}>
                            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 rounded-2xl h-14 text-lg shadow-xl shadow-blue-500/20 border-0 transition-all transform hover:scale-105 active:scale-95 font-bold">
                                Customize This Itinerary
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </motion.div>
    );
}
