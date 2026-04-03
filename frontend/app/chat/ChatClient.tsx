'use client';

import { useState, useRef, useEffect, Suspense, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { ArrowLeft, User, LogIn, Loader2, Send, RefreshCw, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const AnimatedLogo = dynamic(() => import('@/components/AnimatedLogo'), { ssr: false });
const AuthModal = dynamic(() => import('@/components/AuthModal'), { ssr: false });

import { API_URL } from '@/lib/config';
import InnerHeader from '@/components/InnerHeader';

interface DestinationSuggestion {
    name: string;
    tag: string;
}

// Fallback image map just in case Pexels API isn't built into suggestions yet
const fallbackImages = [
    'https://images.unsplash.com/photo-1599661046289-e31897c93e14?w=800&q=80', // Jaipur
    'https://images.unsplash.com/photo-1502602861348-73599a0edabe?w=800&q=80', // Paris
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80', // Bali
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80', // Tokyo
    'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5f1?w=800&q=80', // Santorini
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80', // Dubai
    'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80', // New York
    'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=800&q=80', // Rome
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80', // Kyoto
    'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=80'  // London
];

function ChatClient() {
    const router = useRouter();
    const [user, setUser] = useState<{ name: string, email: string } | null>(null);
    const [isAuthOpen, setIsAuthOpen] = useState(false);

    // Layout State
    const [leftWidth, setLeftWidth] = useState(50);
    const [isResizing, setIsResizing] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Chat State
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
        { role: 'assistant', content: "Hi there! Want to plan a weekend trip? Tell me where you'd like to go or what kind of vibe you're looking for." }
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Destinations State
    const [popularDestinations, setPopularDestinations] = useState<DestinationSuggestion[]>([]);
    const [isLoadingDestinations, setIsLoadingDestinations] = useState(true);
    const [userLocation, setUserLocation] = useState<string>('');

    const fetchLocationAndDestinations = useCallback(async () => {
        setIsLoadingDestinations(true);
        try {
            // 1. Get Location safely
            let locationStr = 'Global';
            try {
                const locRes = await fetch('https://ipapi.co/json/');
                if (locRes.ok) {
                    const locData = await locRes.json();
                    locationStr = locData.city ? `${locData.city}, ${locData.country_name}` : locData.country_name || 'Global';
                }
            } catch (locErr) {
                console.warn('Geolocation failed, defaulting to Global:', locErr);
            }
            setUserLocation(locationStr);

            // 2. Fetch Suggestions based on Location
            const sugRes = await fetch(`/api/suggestions?location=${encodeURIComponent(locationStr)}`);
            if (!sugRes.ok) throw new Error('Failed to fetch suggestions');
            const sugData = await sugRes.json();

            // Format response to ensure it's an array of objects
            const formattedData: DestinationSuggestion[] = Array.isArray(sugData)
                ? sugData.map((item: string | DestinationSuggestion) => typeof item === 'string' ? { name: item, tag: 'Popular Choice' } : item)
                : [];

            setPopularDestinations(formattedData);
        } catch (err) {
            console.error("Failed to load local destinations:", err);
            // Fallback
            setPopularDestinations([
                { name: 'Paris', tag: 'Romantic Getaway' },
                { name: 'Bali', tag: 'Tropical Escape' },
                { name: 'Tokyo', tag: 'Cultural Hub' },
                { name: 'New York', tag: 'City Vibes' }
            ]);
        } finally {
            setIsLoadingDestinations(false);
        }
    }, []);

    // Fetch User Location and then Destinations initially
    useEffect(() => {
        fetchLocationAndDestinations();

        const checkIsDesktop = () => setIsDesktop(window.innerWidth >= 768);
        checkIsDesktop();
        window.addEventListener('resize', checkIsDesktop);
        return () => window.removeEventListener('resize', checkIsDesktop);
    }, []);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Resizing Logic
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizing(true);
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isResizing || !containerRef.current) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
        if (newWidth > 30 && newWidth < 70) {
            setLeftWidth(newWidth);
        }
    }, [isResizing]);

    const handleMouseUp = useCallback(() => setIsResizing(false), []);

    useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing, handleMouseMove, handleMouseUp]);


    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Push to search page right away like the Landing page does
        const query = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: query }]);

        // Brief artificial delay to show message sending before routing
        setTimeout(() => {
            router.push(`/search?destination=${encodeURIComponent(query)}`);
        }, 500);
    };

    const handleDestinationClick = (dest: string) => {
        router.push(`/search?destination=${encodeURIComponent(dest)}`);
    };

    return (
        <div className="flex flex-col h-[100dvh] bg-slate-950 text-white overflow-hidden">
            <InnerHeader title="Weekend Planner" />

            {/* Dual Pane Layout */}
            <div
                ref={containerRef}
                className={cn(
                    "flex-1 flex overflow-hidden relative",
                    isResizing && "cursor-col-resize select-none"
                )}
            >
                {/* Left Panel - Chat Interface */}
                <div
                    className="flex flex-col min-w-0 bg-slate-950 border-r border-slate-800 w-full relative h-full"
                    style={isDesktop ? { width: `${leftWidth}%` } : {}}
                >
                    <div 
                        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth custom-scrollbar pb-32"
                        data-lenis-prevent
                    >
                        <AnimatePresence initial={false}>
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className={cn("flex gap-3", msg.role === 'assistant' ? "mr-auto w-full md:max-w-[85%]" : "ml-auto max-w-[85%] flex-row-reverse")}
                                >
                                    {msg.role === 'assistant' && (
                                        <div className="flex w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 items-center justify-center shrink-0 mt-1 overflow-hidden ring-2 ring-white/10 shadow-xl shadow-blue-900/40">
                                            <AnimatedLogo className="w-5 h-5 text-white" solid />
                                        </div>
                                    )}

                                    <div className={cn(
                                        "rounded-2xl px-5 py-4 shadow-2xl relative overflow-hidden group/bubble transition-all duration-300",
                                        msg.role === 'assistant'
                                            ? "bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-tl-sm text-slate-200 hover:bg-blue-500/5 hover:border-blue-500/30 transition-all"
                                            : "bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 text-white rounded-tr-sm shadow-blue-900/40 border border-white/5"
                                    )}>
                                        {msg.role === 'assistant' && (
                                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-purple-500/10 pointer-events-none opacity-50" />
                                        )}
                                        <p className="leading-relaxed text-sm md:text-base font-medium relative z-10 selection:bg-blue-400/30">{msg.content}</p>
                                    </div>

                                    {msg.role === 'user' && (
                                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center shrink-0 mt-1 shadow-lg ring-2 ring-white/5">
                                            <User className="w-5 h-5 text-slate-300" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <div ref={messagesEndRef} />

                        {/* AdSense Optimization: High-Value Content Section */}
                        <div className="mt-32 p-8 md:p-10 bg-white/[0.02] border border-white/5 rounded-[2rem] backdrop-blur-sm group/adsense transition-all hover:bg-blue-500/5 hover:border-blue-500/30">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                    <RefreshCw className="w-4 h-4" />
                                </span>
                                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] italic">Conversational Strategy</h3>
                            </div>
                            <div className="space-y-6 text-[11px] md:text-xs text-slate-500 leading-relaxed max-w-2xl">
                                <p className="group-hover/adsense:text-slate-400 transition-colors">
                                    Our conversational interface is the primary entry point for personalized 2026 micro-vacation planning. When you input a destination or a &quot;vibe&quot; into this chat, our natural language processing models immediately begin deconstructing your request into actionable travel parameters. This isn&apos;t just a simple search; it&apos;s a multi-layered query that cross-references your current geographical location with global travel trends and seasonal logistics.
                                </p>
                                <p className="group-hover/adsense:text-slate-400 transition-colors">
                                    <strong className="text-slate-300">The Generative Advantage</strong><br/>
                                    By using generative AI, Weekend Travellers moves beyond the limitations of static brochures. The itineraries generated through this interface are structurally sound—meaning they account for closing times, travel distances, and pedestrian-friendly routing. Whether you are looking for a &quot;quiet retreat&quot; or a &quot;high-energy city break,&quot; the intelligence behind this chat adapts its lexical weights to prioritize the results that most closely align with your stated mood.
                                </p>
                                <p className="group-hover/adsense:text-slate-400 transition-colors">
                                    <strong className="text-slate-300">Scaling Your Adventure</strong><br/>
                                    Every interaction in this chat helps refine our destination index. By analyzing the nuanced requests of thousands of travelers, we can identify emerging hotspots and &quot;hidden gems&quot; before they reach mainstream saturation. Our commitment to ethical AI ensures that your specific travel dreams are matched with verified, safe, and high-quality local vendors, promoting sustainable tourism one weekend at a time.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-950/60 backdrop-blur-3xl border-t border-white/10 safe-bottom z-10 shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.5)]">
                        {user ? (
                            <form onSubmit={handleSend} className="relative flex items-center max-w-3xl mx-auto w-full group">
                                <div className="absolute inset-0 bg-blue-500/5 blur-2xl group-focus-within:bg-blue-500/10 transition-colors rounded-2xl" />
                                <input
                                    type="text"
                                    name="chat"
                                    autoComplete="off"
                                    placeholder="E.g., A relaxing weekend trip to Bali..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="w-full bg-slate-900 border border-white/10 text-white placeholder:text-slate-500 text-sm md:text-base rounded-2xl py-4 pl-5 pr-14 outline-none focus:ring-1 focus:ring-blue-500/40 transition-all hover:bg-slate-800/80 relative z-10 shadow-inner"
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={!input.trim()}
                                    className="absolute right-2 text-white bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-600 hover:via-blue-500 rounded-xl w-10 h-10 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:grayscale z-20 hover:scale-105 active:scale-95 group-hover:shadow-blue-500/40"
                                >
                                    <Send className="w-4 h-4 ml-0.5" />
                                </Button>
                            </form>
                        ) : (
                            <div className="relative flex items-center max-w-3xl mx-auto w-full group">
                                <div className="absolute inset-0 bg-blue-500/5 blur-2xl group-hover:bg-blue-500/10 transition-colors rounded-2xl" />
                                <button
                                    onClick={() => setIsAuthOpen(true)}
                                    className="w-full bg-slate-900/60 backdrop-blur-md text-slate-300 text-sm md:text-base rounded-2xl py-4 font-black uppercase tracking-widest hover:text-blue-300 border border-white/10 transition-all hover:bg-blue-500/10 flex items-center justify-center gap-3 shadow-2xl relative z-10 hover:border-blue-500/60 group/btn"
                                >
                                    <LogIn className="w-5 h-5 text-blue-400 group-hover/btn:scale-110 transition-transform pointer-events-none" />
                                    Sign In to start planning
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Resize Handle */}
                <div
                    className="hidden md:flex absolute top-0 bottom-0 z-50 w-6 cursor-col-resize items-center justify-center hover:bg-blue-500/5 transition-colors group/resize"
                    style={{ left: `calc(${leftWidth}% - 12px)` }}
                    onMouseDown={handleMouseDown}
                >
                    <div className={cn(
                        "h-20 w-1.5 rounded-full transition-all duration-300 flex flex-col items-center justify-center gap-1.5 px-0.5",
                        isResizing ? "bg-blue-500 h-24" : "bg-slate-800 group-hover/resize:bg-slate-700"
                    )}>
                        <div className="w-0.5 h-0.5 rounded-full bg-white/20" />
                        <div className="w-0.5 h-0.5 rounded-full bg-white/20" />
                        <div className="w-0.5 h-0.5 rounded-full bg-white/20" />
                    </div>
                </div>

                {/* Right Panel - Popular Destinations */}

                <div
                    className="hidden md:flex flex-col bg-slate-950/80 relative overflow-y-auto custom-scrollbar h-full min-h-0"
                    style={isDesktop ? { width: `${100 - leftWidth}%` } : {}}
                    data-lenis-prevent
                >
                    <div className="p-8 lg:p-12 w-full max-w-5xl mx-auto">
                        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                            <div>
                                <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight mb-2">Popular Destinations</h2>
                                <p className="text-slate-400">Not sure where to go? Get inspired by these top weekend picks.</p>
                            </div>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={fetchLocationAndDestinations}
                                disabled={isLoadingDestinations}
                                className="bg-slate-900/50 border-slate-700 hover:bg-blue-500/10 hover:border-blue-500/50 hover:text-blue-300 text-slate-300 w-fit transition-all"
                            >
                                <RefreshCw className={cn("w-4 h-4 mr-2", isLoadingDestinations && "animate-spin")} />
                                {userLocation ? `Near ${userLocation}` : 'Locate Me'}
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6 pb-20">
                            {isLoadingDestinations ? (
                                <div className="col-span-1 xl:col-span-2 flex flex-col items-center justify-center py-20 text-slate-500">
                                    <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
                                    <p>Discovering getaways near {userLocation || 'you'}...</p>
                                </div>
                            ) : (
                                popularDestinations.map((dest, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleDestinationClick(dest.name)}
                                        className="group relative h-48 lg:h-56 rounded-3xl overflow-hidden focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/30 text-left w-full border border-white/5 hover:border-blue-500/60 bg-slate-900"
                                    >
                                        <div className="absolute inset-0 bg-slate-950">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={fallbackImages[idx % fallbackImages.length]}
                                                alt={dest.name}
                                                className="w-full h-full object-cover opacity-30 group-hover:opacity-70 transition-all duration-700 group-hover:scale-105 saturate-[0.8] brightness-[0.8] group-hover:saturate-[1.2] group-hover:brightness-100"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />
                                        </div>

                                        <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-[10px] uppercase font-black tracking-[0.2em] px-3 py-1 rounded-lg bg-blue-600/20 backdrop-blur-md text-blue-400 border border-blue-500/20 transition-all group-hover:bg-blue-600/40">
                                                    {dest.tag}
                                                </span>
                                            </div>
                                            <h3 className="text-2xl lg:text-4xl font-black italic text-white leading-tight uppercase tracking-tighter group-hover:text-blue-400 transition-colors flex items-end justify-between drop-shadow-lg">
                                                {dest.name}
                                                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 shadow-xl shadow-blue-500/50">
                                                    <ArrowLeft className="w-5 h-5 text-white rotate-180" />
                                                </div>
                                            </h3>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Auth Modal at top level to ensure correct centering and z-index */}
            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </div>
    );
}

export default function SuspendedChatClient() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-screen bg-slate-950 text-white">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        }>
            <ChatClient />
        </Suspense>
    );
}
