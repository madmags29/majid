'use client';

import { useState, useRef, useEffect, Suspense, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { ArrowLeft, User, LogIn, Calendar, Loader2, Send, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AnimatedLogo = dynamic(() => import('@/components/AnimatedLogo'), { ssr: false });
const RightMenu = dynamic(() => import('@/components/RightMenu'), { ssr: false });
const AuthModal = dynamic(() => import('@/components/AuthModal'), { ssr: false });

import { API_URL } from '@/lib/config';
import InnerHeader from '@/components/InnerHeader';

interface DestinationSuggestion {
    name: string;
    tag: string;
}

// Fallback image map just in case Pexels API isn't built into suggestions yet
const fallbackImages = [
    'https://images.unsplash.com/photo-1502602861348-73599a0edabe?w=800&q=80',
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
    'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5f1?w=800&q=80',
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
    'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=800&q=80',
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
    'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=80',
    'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80'
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

    // Fetch User Location and then Destinations
    useEffect(() => {
        const fetchLocationAndDestinations = async () => {
            try {
                // 1. Get Location
                const locRes = await fetch('https://ipapi.co/json/');
                const locData = await locRes.json();
                const locationStr = locData.city ? `${locData.city}, ${locData.country_name}` : locData.country_name || 'Global';
                setUserLocation(locationStr);

                // 2. Fetch Suggestions based on Location
                const sugRes = await fetch(`${API_URL}/api/suggestions?location=${encodeURIComponent(locationStr)}`);
                if (!sugRes.ok) throw new Error('Failed to fetch suggestions');
                const sugData = await sugRes.json();

                // Format response to ensure it's an array of objects
                const formattedData: DestinationSuggestion[] = Array.isArray(sugData)
                    ? sugData.map((item: any) => typeof item === 'string' ? { name: item, tag: 'Popular Choice' } : item)
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
        };

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

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

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
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth custom-scrollbar pb-32">
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
                                        <div className="hidden md:flex w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 items-center justify-center shrink-0 mt-1 overflow-hidden ring-2 ring-white/10 shadow-lg">
                                            <AnimatedLogo className="w-5 h-5 text-white" solid />
                                        </div>
                                    )}

                                    <div className={cn(
                                        "rounded-2xl px-5 py-4 shadow-2xl relative overflow-hidden group/bubble",
                                        msg.role === 'assistant'
                                            ? "bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-tl-sm text-slate-200"
                                            : "bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-tr-sm shadow-blue-900/20"
                                    )}>
                                        {msg.role === 'assistant' && (
                                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
                                        )}
                                        <p className="leading-relaxed text-sm md:text-base font-medium relative z-10">{msg.content}</p>
                                    </div>

                                    {msg.role === 'user' && (
                                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center shrink-0 mt-1 shadow-lg">
                                            <User className="w-5 h-5 text-slate-300" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-900/40 backdrop-blur-2xl border-t border-white/5 safe-bottom z-10">
                        {user ? (
                            <form onSubmit={handleSend} className="relative flex items-center max-w-3xl mx-auto w-full group">
                                <div className="absolute inset-0 bg-blue-500/5 blur-xl group-focus-within:bg-blue-500/10 transition-colors rounded-2xl" />
                                <input
                                    type="text"
                                    name="chat"
                                    autoComplete="off"
                                    placeholder="E.g., A relaxing weekend trip to Bali..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="w-full bg-slate-900/50 text-white placeholder:text-slate-500 text-sm md:text-base rounded-2xl py-4 pl-5 pr-14 focus:outline-none focus:ring-2 focus:ring-blue-500/40 border border-white/5 transition-all hover:bg-slate-800/80 relative z-10"
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={!input.trim()}
                                    className="absolute right-2 text-white bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl w-10 h-10 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:grayscale z-20 hover:scale-105 active:scale-95 touch-manipulation"
                                >
                                    <Send className="w-4 h-4 ml-0.5 pointer-events-none" />
                                </Button>
                            </form>
                        ) : (
                            <div className="relative flex items-center max-w-3xl mx-auto w-full group">
                                <div className="absolute inset-0 bg-blue-500/5 blur-xl group-hover:bg-blue-500/10 transition-colors rounded-2xl" />
                                <button
                                    onClick={() => setIsAuthOpen(true)}
                                    className="w-full bg-slate-900/50 text-slate-300 text-sm md:text-base rounded-2xl py-4 font-bold hover:text-white border border-white/5 transition-all hover:bg-slate-800/80 flex items-center justify-center gap-2 shadow-lg relative z-10 hover:border-blue-500/30 group/btn touch-manipulation"
                                >
                                    <LogIn className="w-5 h-5 text-blue-400 group-hover/btn:scale-110 transition-transform pointer-events-none" />
                                    Log in to start planning your perfect weekend
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Resize Handle */}
                <div
                    className="hidden md:flex absolute top-0 bottom-0 z-50 w-4 cursor-col-resize items-center justify-center hover:bg-white/5 transition-colors"
                    style={{ left: `calc(${leftWidth}% - 8px)` }}
                    onMouseDown={handleMouseDown}
                >
                    <div className={cn(
                        "h-12 w-1 rounded-full transition-colors",
                        isResizing ? "bg-blue-500" : "bg-slate-700 hover:bg-slate-500"
                    )} />
                </div>

                {/* Right Panel - Popular Destinations */}

                <div
                    className="hidden md:flex flex-col bg-slate-950/80 relative overflow-y-auto custom-scrollbar"
                    style={isDesktop ? { width: `${100 - leftWidth}%` } : {}}
                >
                    <div className="p-8 lg:p-12 w-full max-w-5xl mx-auto">
                        <div className="mb-8">
                            <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight mb-2">Popular Destinations</h2>
                            <p className="text-slate-400">Not sure where to go? Get inspired by these top weekend picks.</p>
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
                                        className="group relative h-48 lg:h-56 rounded-3xl overflow-hidden focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/20 text-left w-full border border-slate-800/50 hover:border-slate-700"
                                    >
                                        <div className="absolute inset-0 bg-slate-900">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={fallbackImages[idx % fallbackImages.length]}
                                                alt={dest.name}
                                                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-900/20" />
                                        </div>

                                        <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded bg-blue-500/20 backdrop-blur-md text-blue-200 border border-blue-500/30 group-hover:border-blue-400 group-hover:bg-blue-500/40 transition-colors">
                                                    {dest.tag}
                                                </span>
                                            </div>
                                            <h3 className="text-2xl lg:text-3xl font-bold text-white group-hover:text-white transition-colors flex items-center justify-between">
                                                {dest.name}
                                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0 shadow-lg shadow-blue-500/50">
                                                    <ArrowLeft className="w-4 h-4 text-white rotate-180" />
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
