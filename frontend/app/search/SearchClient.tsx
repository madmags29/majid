'use client';

import { useEffect, useState, useRef, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { MapPin, Calendar, Loader2, Send, User, Heart, Share2, Check, ArrowLeft, Bus, Train, Plane, Car, LogIn } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';
import { API_URL } from '@/lib/config';
import ReactMarkdown from 'react-markdown';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Dynamically import map to avoid SSR issues
const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });
import CinematicLoader from '@/components/CinematicLoader';
import InnerHeader from '@/components/InnerHeader';
import ItineraryDisplay from '@/components/ItineraryDisplay';
const AnimatedLogo = dynamic(() => import('@/components/AnimatedLogo'), { ssr: false });
const AuthModal = dynamic(() => import('@/components/AuthModal'), { ssr: false });
const TypewriterText = dynamic(() => import('@/components/TypewriterText'), { ssr: false });
const WeatherWidget = dynamic(() => import('@/components/WeatherWidget'), { ssr: false });
const AdBanner = dynamic(() => import('@/components/AdBanner'), { ssr: false });

const TypingResponse = ({ content, onComplete }: { content: string, onComplete?: () => void }) => {
    const [displayed, setDisplayed] = useState('');

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            if (i < content.length) {
                setDisplayed(content.slice(0, i + 1));
                i++;
            } else {
                clearInterval(interval);
                onComplete?.();
            }
        }, 10);
        return () => clearInterval(interval);
    }, [content, onComplete]);

    return (
        <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-slate-800 prose-pre:p-4 prose-pre:rounded-lg max-w-none text-slate-300">
            <ReactMarkdown
                components={{
                    ul: ({ node, ...props }) => <ul className="list-disc pl-4 space-y-2">{props.children}</ul>,
                    ol: ({ node, ...props }) => <ol className="list-decimal pl-4 space-y-2">{props.children}</ol>,
                    li: ({ node, ...props }) => <li className="pl-1">{props.children}</li>,
                    strong: ({ node, ...props }) => <span className="font-bold text-blue-400">{props.children}</span>,
                    p: ({ node, ...props }) => <p className="leading-relaxed mb-4">{props.children}</p>,
                }}
            >
                {displayed}
            </ReactMarkdown>
        </div>
    );
};

interface Activity {
    time: string;
    description: string;
    location: string;
    ticket_price?: string;
    imageUrl?: string;
}

interface Day {
    day: number;
    title: string;
    activities: Activity[];
}

interface TripDetails {
    currency: string;
    estimated_budget: string;
    best_time_to_visit: string;
    hotel_suggestions: {
        name: string;
        tier: string;
        price_range: string;
    }[];
    travel_logistics?: {
        bus: string;
        train: string;
        flight: string;
        car: string;
    };
    destination_coordinates: {
        lat: number;
        lng: number;
    };
}

interface SpecialEvent {
    name: string;
    date: string;
    description: string;
    location: string;
}

interface Itinerary {
    destination: string;
    summary: string;
    special_events?: SpecialEvent[];
    trip_details: TripDetails;
    days: Day[];
}

interface Message {
    role: 'user' | 'assistant';
    content: string | Itinerary;
    type: 'text' | 'itinerary';
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

const DistanceDisplay = ({ destinationCoords }: { destinationCoords: { lat: number, lng: number } }) => {
    const [userLoc, setUserLoc] = useState<{ lat: number, lng: number } | null>(null);
    const [distance, setDistance] = useState<number | null>(null);

    const searchParams = useSearchParams();
    const originParam = searchParams.get('origin');

    useEffect(() => {
        const checkLocation = async () => {
            // 1. Check LocalStorage Cache first
            const cached = localStorage.getItem('user_precise_location');
            let cachedCoords = null;
            if (cached) {
                try {
                    const { coords, timestamp } = JSON.parse(cached);
                    // Use cache if it's less than 24 hours old
                    if (Date.now() - timestamp < 86400000) {
                        cachedCoords = coords;
                    }
                } catch (e) {
                    console.error("Error parsing cached location", e);
                }
            }

            if (originParam) {
                if (cachedCoords) {
                    setUserLoc(cachedCoords);
                }
                return;
            }

            if (cachedCoords) {
                setUserLoc(cachedCoords);
                return;
            }

            const fetchIPLocation = async () => {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 5000);
                    const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
                    clearTimeout(timeoutId);
                    if (res.ok) {
                        const data = await res.json();
                        if (data.latitude && data.longitude) {
                            setUserLoc({ lat: data.latitude, lng: data.longitude });
                        }
                    }
                } catch (err) {
                    console.warn("IP Location failed", err);
                }
            };

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setUserLoc({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        });
                        localStorage.setItem('user_precise_location', JSON.stringify({
                            name: 'Current Location',
                            coords: { lat: position.coords.latitude, lng: position.coords.longitude },
                            timestamp: Date.now()
                        }));
                    },
                    (error) => {
                        console.warn("Geolocation denied/error, falling back to IP.", error);
                        fetchIPLocation();
                    }
                );
            } else {
                fetchIPLocation();
            }
        };

        checkLocation();
    }, [originParam]);

    useEffect(() => {
        if (userLoc && destinationCoords) {
            const dist = calculateDistance(userLoc.lat, userLoc.lng, destinationCoords.lat, destinationCoords.lng);
            setDistance(dist);
        }
    }, [userLoc, destinationCoords]);

    if (!distance) return null;

    return (
        <div className="mb-4 bg-slate-800/50 p-2 rounded border border-slate-700 flex items-center justify-between">
            <span className="text-xs text-slate-400">Distance from you</span>
            <span className="text-sm font-bold text-blue-400">~{distance} km</span>
        </div>
    );
};

function SearchClient() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const destination = (searchParams.get('destination') || '') as string;

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Save/Share State
    const [isSaved, setIsSaved] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [currentItineraryData, setCurrentItineraryData] = useState<Itinerary | null>(null);
    const [user, setUser] = useState<{ name: string, email: string } | null>(null);

    const [leftWidth, setLeftWidth] = useState(50);
    const [isResizing, setIsResizing] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkIsDesktop = () => {
            setIsDesktop(window.innerWidth >= 768);
        };
        checkIsDesktop();
        window.addEventListener('resize', checkIsDesktop);
        return () => window.removeEventListener('resize', checkIsDesktop);
    }, []);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizing(true);
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isResizing || !containerRef.current) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
        if (newWidth > 20 && newWidth < 80) {
            setLeftWidth(newWidth);
        }
    }, [isResizing]);

    const handleMouseUp = useCallback(() => {
        setIsResizing(false);
    }, []);

    useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing, handleMouseMove, handleMouseUp]);

    useEffect(() => {
        const checkUser = () => {
            const userData = localStorage.getItem('user');
            if (userData) {
                setUser(JSON.parse(userData));
            } else {
                setUser(null);
            }
        };
        checkUser();
        window.addEventListener('storage', checkUser);
        return () => window.removeEventListener('storage', checkUser);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        toast.success('Logged out successfully');
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (!loading && messages.length > 1) {
            scrollToBottom();
        }
    }, [messages, loading, isTyping]);

    useEffect(() => {
        const fetchItinerary = async (dest: string) => {
            const origin = searchParams.get('origin') || '';
            const cacheKey = `itinerary_${dest}_${origin}`;

            // Check cache first
            const cachedItinerary = localStorage.getItem(cacheKey);
            if (cachedItinerary) {
                try {
                    const parsedData = JSON.parse(cachedItinerary);
                    setCurrentItineraryData(parsedData);
                    setMessages([
                        {
                            role: 'assistant',
                            type: 'itinerary',
                            content: parsedData
                        }
                    ]);
                    setLoading(false);
                    return;
                } catch (e) {
                    console.error("Failed to parse cached itinerary", e);
                    // If parsing fails, proceed to fetch
                }
            }

            setLoading(true);
            try {
                // Extract parameters from URL
                const origin = searchParams.get('origin') || '';
                const startDate = searchParams.get('startDate') || '';
                const endDate = searchParams.get('endDate') || '';
                const oldDate = searchParams.get('date') || ''; // Fallback for old parameter

                // Calculate days from range if possible
                let requestedDays = 2;
                if (startDate && endDate) {
                    const start = new Date(startDate);
                    const end = new Date(endDate);
                    requestedDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
                } else {
                    const daysMatch = dest.match(/(\d+)\s*day/i);
                    requestedDays = daysMatch ? parseInt(daysMatch[1]) : 2;
                }

                const response = await fetch(`${API_URL}/api/search`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        destination: dest,
                        days: requestedDays,
                        origin,
                        startDate: startDate || oldDate,
                        endDate: endDate
                    }),
                });

                if (!response.ok) throw new Error('Failed to fetch itinerary');

                const data = await response.json();

                // Save to itinerary cache
                localStorage.setItem(cacheKey, JSON.stringify(data));

                // Save to Recent Searches
                if (data && data.destination && data.summary) {
                    try {
                        const recents = JSON.parse(localStorage.getItem('recentSearches') || '[]');
                        // Add new search
                        const newSearch = {
                            _id: `local_${Date.now()}`,
                            destination: data.destination,
                            summary: data.summary,
                            createdAt: new Date().toISOString(),
                            isLocal: true,
                            imageUrl: data.heroImage?.url || data.days?.[0]?.activities?.[0]?.imageUrl
                        };

                        // Filter out duplicates (same destination)
                        const filteredRecents = recents.filter((r: { destination: string }) => r.destination.toLowerCase() !== data.destination.toLowerCase());

                        // Keep only top 20
                        const updatedRecents = [newSearch, ...filteredRecents].slice(0, 20);
                        localStorage.setItem('recentSearches', JSON.stringify(updatedRecents));
                    } catch (e) {
                        console.error('Failed to save to recent searches', e);
                    }
                }

                setCurrentItineraryData(data);
                setMessages([
                    {
                        role: 'assistant',
                        type: 'itinerary',
                        content: data
                    }
                ]);
            } catch (error) {
                console.error("Search error:", error);
                setMessages([
                    {
                        role: 'assistant',
                        type: 'text',
                        content: "I couldn't generate an itinerary for that destination. Please try again or check your connection."
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        if (destination) {
            fetchItinerary(destination);
        } else {
            setLoading(false);
        }
    }, [destination, searchParams]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading || !currentItineraryData) return;

        if (!user) {
            setIsAuthOpen(true);
            toast.error("Please login to customize your itinerary");
            return;
        }

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', type: 'text', content: userMsg }]);
        setIsTyping(true);

        try {
            const response = await fetch(`${API_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userRequest: userMsg,
                    currentItinerary: currentItineraryData
                }),
            });

            if (!response.ok) throw new Error('Failed to refine itinerary');

            const data = await response.json();
            setCurrentItineraryData(data);
            setMessages(prev => [...prev, {
                role: 'assistant',
                type: 'itinerary',
                content: data
            }]);
        } catch (error) {
            console.error("Chat error:", error);
            toast.error("Failed to update itinerary");
        } finally {
            setIsTyping(false);
        }
    };

    const handleSaveTrip = async () => {
        if (!user) {
            setIsAuthOpen(true);
            return;
        }

        if (!currentItineraryData) return;

        try {
            const response = await fetch(`${API_URL} /api/trips`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')} `
                },
                body: JSON.stringify(currentItineraryData),
            });

            if (response.ok) {
                setIsSaved(true);
                toast.success('Trip saved to your profile!');
            } else {
                toast.error('Failed to save trip');
            }
        } catch (error) {
            console.error("Save error:", error);
            toast.error('Error saving trip');
        }
    };

    const handleShare = async () => {
        setIsSharing(true);
        try {
            await navigator.share({
                title: `My Trip to ${currentItineraryData?.destination} `,
                text: currentItineraryData?.summary,
                url: window.location.href,
            });
        } catch (err) {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard!');
        } finally {
            setIsSharing(false);
        }
    };

    return (
        <div className="flex flex-col h-[100dvh] bg-slate-950 text-white overflow-hidden">
            <InnerHeader
                title={destination || 'New Trip'}
                subtitle="Weekend Getaway"
                showBack
                backHref="/"
                actions={currentItineraryData && (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSaveTrip}
                            className={cn(
                                "flex items-center gap-2 h-9 px-4 rounded-full transition-all",
                                isSaved ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                            )}
                        >
                            <Heart className={cn("w-4 h-4", isSaved && "fill-current")} />
                            <span className="hidden sm:inline font-semibold">{isSaved ? 'Saved' : 'Save'}</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleShare}
                            className="flex items-center gap-2 h-9 px-4 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all font-semibold"
                        >
                            <Share2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Share</span>
                        </Button>
                    </div>
                )}
            />


            <div
                ref={containerRef}
                className={cn(
                    "flex-1 flex overflow-hidden relative",
                    isResizing && "cursor-col-resize select-none"
                )}
            >
                {/* Left Panel - Chat & Content */}
                <div
                    className="flex flex-col min-w-0 bg-slate-950 border-r border-slate-800 w-full relative h-full"
                    style={isDesktop ? { width: `${leftWidth}% ` } : {}}
                >
                    <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth custom-scrollbar pb-32">
                        <AnimatePresence initial={false}>
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className={cn("flex gap-3", msg.role === 'assistant' ? "mr-auto w-full md:max-w-[95%]" : "ml-auto max-w-[90%] md:max-w-[80%] flex-row-reverse")}
                                >
                                    {msg.role === 'assistant' && (
                                        <div className="hidden md:flex w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 items-center justify-center shrink-0 mt-1 overflow-hidden ring-2 ring-white/10 shadow-lg">
                                            <AnimatedLogo className="w-5 h-5 text-white" solid />
                                        </div>
                                    )}

                                    <div className={cn(
                                        "rounded-2xl p-4 md:p-5 shadow-2xl relative overflow-hidden group/bubble",
                                        msg.role === 'assistant'
                                            ? "bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-tl-sm text-slate-100"
                                            : "bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-tr-sm shadow-blue-900/20"
                                    )}>
                                        {msg.role === 'assistant' && (
                                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
                                        )}
                                        {msg.type === 'text' && typeof msg.content === 'string' && (
                                            <div className="relative z-10">
                                                <TypingResponse content={msg.content} />
                                            </div>
                                        )}

                                        {msg.type === 'itinerary' && typeof msg.content !== 'string' && (
                                            <div className="space-y-6 relative z-10">
                                                <ItineraryDisplay itinerary={msg.content as Itinerary} />
                                            </div>
                                        )}
                                    </div >

                                    {
                                        msg.role === 'user' && (
                                            <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center shrink-0 mt-1 shadow-lg">
                                                <User className="w-5 h-5 text-slate-300" />
                                            </div>
                                        )
                                    }
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {loading && (
                            <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
                                <CinematicLoader
                                    messages={[
                                        "Planning your trip...",
                                        "Finding great spots...",
                                        "Checking weather forecasts...",
                                        "Optimizing your itinerary...",
                                        "Finalizing details..."
                                    ]}
                                    className="bg-transparent"
                                />
                            </div>
                        )}

                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex gap-3"
                            >
                                <div className="hidden md:flex w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 items-center justify-center shrink-0 mt-1 overflow-hidden ring-2 ring-white/10 shadow-lg">
                                    <AnimatedLogo className="w-5 h-5 text-white" solid />
                                </div>
                                <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl px-4 py-3 rounded-tl-sm border border-white/10 flex items-center gap-1 shadow-xl">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-900/40 backdrop-blur-2xl border-t border-white/5 safe-bottom z-10">
                        <form onSubmit={handleSend} className="relative flex items-center max-w-2xl mx-auto w-full group">
                            <div className="absolute inset-0 bg-blue-500/5 blur-xl group-focus-within:bg-blue-500/10 transition-colors rounded-2xl" />
                            <input
                                type="text"
                                name="chat"
                                autoComplete="off"
                                placeholder={user ? "Ask for changes (e.g., 'Add 1 day more')..." : "Login to customize your itinerary..."}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="w-full bg-slate-900/50 text-white placeholder:text-slate-500 text-sm md:text-base rounded-2xl py-4 md:py-5 pl-5 pr-14 focus:outline-none focus:ring-2 focus:ring-blue-500/40 border border-white/5 transition-all hover:bg-slate-800/80 relative z-10 font-medium"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={(!input.trim() && user !== null) || loading}
                                className={cn(
                                    "absolute right-2.5 rounded-xl w-10 h-10 transition-all shadow-lg z-20 hover:scale-105 active:scale-95 touch-manipulation",
                                    user
                                        ? "bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-900/40"
                                        : "bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white shadow-amber-900/40"
                                )}
                            >
                                {user ? <Send className="w-4 h-4 ml-0.5 pointer-events-none" /> : <LogIn className="w-4 h-4 pointer-events-none" />}
                            </Button>
                        </form>
                    </div>
                </div >

                {/* Resize Handle */}
                < div
                    className="hidden md:flex absolute top-0 bottom-0 z-50 w-4 cursor-col-resize items-center justify-center hover:bg-white/5 transition-colors"
                    style={{ left: `calc(${leftWidth}% - 8px)` }}
                    onMouseDown={handleMouseDown}
                >
                    <div className={cn(
                        "h-12 w-1 rounded-full transition-colors",
                        isResizing ? "bg-blue-500" : "bg-slate-700 group-hover:bg-slate-500"
                    )} />
                </div >

                {/* Right Panel - Map */}
                < div
                    className="hidden md:block bg-slate-950 relative"
                    style={isDesktop ? { width: `${100 - leftWidth}%` } : {}}
                >
                    {
                        currentItineraryData ? (
                            <MapView itinerary={currentItineraryData} selectedActivity={selectedActivity} />
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4 bg-slate-900/20">
                                <MapPin className="w-16 h-16 opacity-20" />
                                <p>Map view updates with your itinerary</p>
                            </div >
                        )}
                </div >
            </div >
            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
            {/* Cinematic Loading Overlay */}
            {
                loading && (
                    <div className="fixed inset-0 z-[100]">
                        <CinematicLoader
                            messages={[
                                "Designing your perfect escape...",
                                "Scouting the best local spots...",
                                "Optimizing your travel route...",
                                "Curating premium stay options...",
                                "Finalizing your weekend adventure..."
                            ]}
                        />
                    </div>
                )
            }
        </div >
    );
}

export default function SuspendedSearchClient() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-screen bg-slate-950 text-white">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        }>
            <SearchClient />
        </Suspense>
    );
}
