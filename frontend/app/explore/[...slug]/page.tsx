'use client';

import { useEffect, useState, use } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { MapPin, ArrowLeft, Loader2, Sparkles, Globe, History, Utensils, Compass, Camera, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { API_URL } from '@/lib/config';

// Dynamically import map to avoid SSR issues
const MapView = dynamic(() => import('@/components/MapView'));
const WeatherWidget = dynamic(() => import('@/components/WeatherWidget'));

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
}

export default function ExplorePage({ params }: { params: Promise<{ slug: string[] }> }) {
    const resolvedParams = use(params);
    const slug = resolvedParams.slug.join('/');
    const [data, setData] = useState<DestinationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${API_URL}/api/explore?slug=${encodeURIComponent(slug)}`);
                if (!res.ok) throw new Error('Destination not found');
                const result = await res.json();
                setData(result);
            } catch (err) {
                console.error(err);
                setError('We couldn\'t load this destination. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <p className="text-xl font-medium">Generating your deep-dive guide...</p>
                <p className="text-slate-400 mt-2">Creating 2000 words of travel wisdom</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Oops!</h1>
                    <p className="text-xl text-slate-400 mb-8">{error}</p>
                    <Link href="/">
                        <Button className="bg-blue-600 hover:bg-blue-700">Back to Safety</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/50 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <ArrowLeft className="w-5 h-5 text-blue-400" />
                    <span className="font-cursive text-xl">weekendtravellers</span>
                </Link>
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                        <Share2 className="w-5 h-5" />
                    </Button>
                    <Link href={`/search?destination=${encodeURIComponent(data.destination)}`}>
                        <Button className="bg-blue-600 hover:bg-blue-700 rounded-full px-6">Customize Trip</Button>
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative h-[70vh] w-full pt-20">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/20 to-transparent z-10" />
                <div className="absolute inset-0 bg-black/40 z-0" />
                {/* Fallback image (Pexels will enrich this later) */}
                <div className="absolute inset-0 z-[-1] bg-[url('https://images.pexels.com/photos/2044434/pexels-photo-2044434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center" />

                <div className="relative z-20 h-full flex flex-col items-center justify-end pb-12 px-6 text-center max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center justify-center gap-2 mb-4 bg-blue-500/20 backdrop-blur-md border border-blue-500/30 px-4 py-1.5 rounded-full text-blue-300 text-sm font-bold uppercase tracking-widest">
                            <Globe className="w-4 h-4" />
                            <span>Ultimate Exploration Guide</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black text-white mb-6 drop-shadow-2xl uppercase tracking-tighter italic">
                            {data.destination}
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto leading-relaxed drop-shadow-md font-medium">
                            {data.summary}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Content Layout */}
            <main className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-20">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-16">
                    {/* Deep Dive Content (SEO Text) */}
                    <article className="prose prose-invert prose-blue max-w-none prose-h2:text-4xl prose-h2:font-black prose-h2:tracking-tight prose-h2:italic prose-h2:mb-8 prose-p:text-slate-300 prose-p:text-lg prose-p:leading-relaxed prose-li:text-slate-300">
                        <div
                            dangerouslySetInnerHTML={{ __html: data.deep_content }}
                            className="[&>h2]:mt-20 [&>h2]:mb-8 [&>h2]:flex [&>h2]:items-center [&>h2]:gap-4"
                        />
                    </article>

                    {/* Itinerary Visualization */}
                    <div className="pt-12 border-t border-white/10">
                        <h2 className="text-4xl font-black italic tracking-tight mb-8 flex items-center gap-4">
                            <Compass className="w-10 h-10 text-blue-500" />
                            THE PERFECT WEEKEND PLAN
                        </h2>

                        <div className="space-y-12">
                            {data.days.map((day) => (
                                <div key={day.day} className="bg-slate-900/40 rounded-3xl border border-white/5 overflow-hidden">
                                    <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 px-8 py-6 border-b border-white/5">
                                        <h3 className="text-2xl font-bold flex items-center gap-3">
                                            <span className="bg-white text-[#0f172a] w-8 h-8 rounded-full flex items-center justify-center text-sm font-black">
                                                {day.day}
                                            </span>
                                            {day.title}
                                        </h3>
                                    </div>
                                    <div className="p-8 space-y-8">
                                        {day.activities.map((activity, idx) => (
                                            <div key={idx} className="flex flex-col md:flex-row gap-8 group">
                                                {activity.imageUrl && (
                                                    <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden shrink-0">
                                                        <img src={activity.imageUrl} alt={activity.location} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
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

                {/* Sidebar Column */}
                <div className="space-y-8 h-fit lg:sticky lg:top-28">
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
                                    <p className="text-lg font-bold">{data.trip_details.currency}{data.trip_details.estimated_budget}</p>
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
                            <WeatherWidget location={data.destination} />
                        </div>
                    </div>

                    {/* Interactive Map */}
                    <div className="h-[400px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                        <MapView itinerary={data as any} selectedActivity={null} />
                    </div>

                    {/* Where to Stay */}
                    <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Utensils className="w-5 h-5 text-purple-500" />
                            TOP SLEEP SPOTS
                        </h3>
                        <div className="space-y-4">
                            {data.trip_details.hotel_suggestions.map((hotel, idx) => {
                                const hotelUrl = `https://search.hotellook.com/hotels?destination=${encodeURIComponent(hotel.name + ' ' + data.destination)}&marker=497779`;
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
                                        <p className="text-xs text-slate-500 mt-1">{hotel.price_range}</p>
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
                    <p className="text-xl text-slate-400 mb-10">Get a personalized PDF of this itinerary or chat with our AI to tweak the details.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href={`/search?destination=${encodeURIComponent(data.destination)}`}>
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-10 rounded-2xl h-14 text-lg">
                                Customize This Itinerary
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
