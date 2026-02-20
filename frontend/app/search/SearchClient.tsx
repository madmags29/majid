'use client';

import { useEffect, useState, useRef, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { MapPin, Calendar, Loader2, Send, User, Heart, Share2, Check, ArrowLeft, Bus, Train, Plane, Car, LogIn } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
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
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
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
            const origin = searchParams.get('origin');
            setLoading(true);
            try {
                // Extract days from destination string if possible (e.g., "3 days in Paris")
                const daysMatch = dest.match(/(\d+)\s*day/i);
                const requestedDays = daysMatch ? parseInt(daysMatch[1]) : 2;

                const response = await fetch(`${API_URL}/api/search`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ destination: dest, days: requestedDays, origin }),
                });

                if (!response.ok) throw new Error('Failed to fetch itinerary');

                const data = await response.json();
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
            const response = await fetch(`${API_URL}/api/trips`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
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
                title: `My Trip to ${currentItineraryData?.destination}`,
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
            {/* Header */}
            <header className="h-16 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900/50 backdrop-blur-md z-30 shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-sm font-bold text-slate-200 truncate max-w-[150px] md:max-w-none">
                            {destination || 'New Trip'}
                        </h1>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Weekend Getaway</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {currentItineraryData && (
                        <>
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
                        </>
                    )}

                    <div className="h-6 w-[1px] bg-slate-800 mx-1" />

                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-blue-500/20 hover:ring-blue-500/40 transition-all p-0 overflow-hidden">
                                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                                        {user.name.charAt(0)}
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-800 text-slate-200">
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user.name}</p>
                                        <p className="text-xs leading-none text-slate-400">{user.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-slate-800" />
                                <DropdownMenuItem asChild className="focus:bg-slate-800 focus:text-white cursor-pointer">
                                    <Link href="/profile" className="flex items-center">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="focus:bg-slate-800 focus:text-white cursor-pointer">
                                    <Link href="/trips" className="flex items-center">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        <span>My Trips</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-slate-800" />
                                <DropdownMenuItem onClick={handleLogout} className="focus:bg-red-500/10 focus:text-red-500 cursor-pointer text-red-500 font-medium">
                                    <LogIn className="mr-2 h-4 w-4 rotate-180" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button
                            onClick={() => setIsAuthOpen(true)}
                            className="hidden md:inline-flex bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 border-0 rounded-xl px-6 transition-all transform hover:scale-105 active:scale-95"
                        >
                            Sign In
                        </Button>
                    )}
                </div>
            </header>

            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

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
                    style={isDesktop ? { width: `${leftWidth}%` } : {}}
                >
                    <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth custom-scrollbar pb-32">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={cn("flex gap-3", msg.role === 'assistant' ? "mr-auto w-full md:max-w-[95%]" : "ml-auto max-w-[90%] md:max-w-[80%] flex-row-reverse")}>
                                {msg.role === 'assistant' && (
                                    <div className="hidden md:flex w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center shrink-0 mt-1 overflow-hidden ring-1 ring-white/20">
                                        <AnimatedLogo className="w-5 h-5 text-white" solid />
                                    </div>
                                )}

                                <div className={cn(
                                    "rounded-2xl p-4 md:p-5 shadow-xl",
                                    msg.role === 'assistant'
                                        ? "bg-slate-900 border border-slate-800 rounded-tl-sm text-slate-100"
                                        : "bg-blue-600 text-white rounded-tr-sm"
                                )}>
                                    {msg.type === 'text' && typeof msg.content === 'string' && (
                                        <TypingResponse content={msg.content} />
                                    )}

                                    {msg.type === 'itinerary' && typeof msg.content !== 'string' && (
                                        <div className="space-y-6">
                                            {/* Summary Section */}
                                            <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50">
                                                <h3 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-3">
                                                    {['Budget travel', 'Road trips', 'Hidden gems', 'Monsoon trips', 'Winter trips'].includes(destination)
                                                        ? `Trip to ${destination} - ${msg.content.destination}`
                                                        : `Trip to ${msg.content.destination}`
                                                    }
                                                </h3>
                                                <p className="text-sm text-slate-300 leading-relaxed italic border-l-2 border-blue-500 pl-3">
                                                    {msg.content.summary}
                                                </p>
                                            </div>

                                            {/* Trip Vital Signs */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700 hover:border-blue-500/30 transition-colors group">
                                                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1 group-hover:text-blue-400 transition-colors">Budget</div>
                                                    <div className="text-sm font-bold text-slate-200">{formatCurrency(msg.content.trip_details.estimated_budget, msg.content.trip_details.currency)}</div>
                                                </div>
                                                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700 hover:border-blue-500/30 transition-colors group">
                                                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1 group-hover:text-blue-400 transition-colors">When</div>
                                                    <div className="text-sm font-bold text-slate-200">{msg.content.trip_details.best_time_to_visit}</div>
                                                </div>
                                                <div className="col-span-2 bg-slate-800/60 p-3 rounded-xl border border-slate-700">
                                                    <WeatherWidget
                                                        lat={msg.content.trip_details.destination_coordinates.lat}
                                                        lng={msg.content.trip_details.destination_coordinates.lng}
                                                    />
                                                </div>
                                            </div>

                                            {/* Distance Info */}
                                            <DistanceDisplay destinationCoords={msg.content.trip_details.destination_coordinates} />

                                            {/* Logistics */}
                                            {msg.content.trip_details.travel_logistics && (
                                                <div className="bg-slate-900/40 rounded-xl p-4 border border-slate-800">
                                                    <h4 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                                                        <Bus className="w-3 h-3" />
                                                        Travel Times from {searchParams.get('origin') || 'Current Location'}
                                                    </h4>
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                        <div className="flex items-center gap-3 group">
                                                            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                                                                <Bus className="w-4 h-4 text-orange-400" />
                                                            </div>
                                                            <div>
                                                                <div className="text-[10px] text-slate-500 font-bold">Bus</div>
                                                                <div className="text-xs text-slate-300 font-semibold">{msg.content.trip_details.travel_logistics.bus}</div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3 group">
                                                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                                                                <Train className="w-4 h-4 text-blue-400" />
                                                            </div>
                                                            <div>
                                                                <div className="text-[10px] text-slate-500 font-bold">Train</div>
                                                                <div className="text-xs text-slate-300 font-semibold">{msg.content.trip_details.travel_logistics.train}</div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3 group">
                                                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                                                                <Plane className="w-4 h-4 text-purple-400" />
                                                            </div>
                                                            <div>
                                                                <div className="text-[10px] text-slate-500 font-bold">Flight</div>
                                                                <div className="text-xs text-slate-300 font-semibold">{msg.content.trip_details.travel_logistics.flight}</div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3 group">
                                                            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                                                                <Car className="w-4 h-4 text-green-400" />
                                                            </div>
                                                            <div>
                                                                <div className="text-[10px] text-slate-500 font-bold">Car</div>
                                                                <div className="text-xs text-slate-300 font-semibold">{msg.content.trip_details.travel_logistics.car}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Accommodations */}
                                            <div className="space-y-3">
                                                <h4 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold flex items-center gap-2">
                                                    <Heart className="w-3 h-3" />
                                                    Recommended Stays
                                                </h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                    {((msg.content as Itinerary).trip_details?.hotel_suggestions || []).map((hotel, hIdx) => (
                                                        <div key={hIdx} className="bg-slate-800/60 p-3 rounded-xl border border-slate-700 flex flex-col justify-between hover:border-slate-500 transition-colors group">
                                                            <div>
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <span className={cn(
                                                                        "text-[8px] px-1.5 py-0.5 rounded uppercase font-black",
                                                                        hotel.tier === 'Luxury' ? "bg-amber-500/20 text-amber-500" :
                                                                            hotel.tier === 'Mid' ? "bg-blue-500/20 text-blue-500" :
                                                                                "bg-slate-700 text-slate-400"
                                                                    )}>
                                                                        {hotel.tier}
                                                                    </span>
                                                                    <span className="text-[10px] font-bold text-slate-400">{hotel.price_range}</span>
                                                                </div>
                                                                <h5 className="text-sm font-bold text-slate-200 line-clamp-1 group-hover:text-blue-400 transition-colors">{hotel.name}</h5>
                                                            </div>
                                                            <a
                                                                href={`https://www.google.com/search?q=hotels+in+${(msg.content as Itinerary).destination}+${hotel.name}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="mt-2 text-[10px] text-blue-400 font-bold flex items-center gap-1 hover:underline"
                                                            >
                                                                Book Now
                                                                <ArrowLeft className="w-3 h-3 rotate-180" />
                                                            </a>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Daily Timeline */}
                                            <div className="space-y-6">
                                                {((msg.content as Itinerary).days || ((msg.content as any).itinerary) || []).map((day: any, dIdx: number) => (
                                                    <div key={dIdx} className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                                                        <div className="bg-slate-800/80 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
                                                            <h4 className="text-sm font-black flex items-center gap-3">
                                                                <span className="flex items-center justify-center px-2.5 py-0.5 rounded-lg bg-blue-600/20 text-blue-400 text-xs whitespace-nowrap">
                                                                    Day {day.day}
                                                                </span>
                                                                {day.title}
                                                            </h4>
                                                        </div>
                                                        <div className="p-1 sm:p-4 space-y-4">
                                                            {(day.activities || []).map((activity: any, aIdx: number) => (
                                                                <div
                                                                    key={aIdx}
                                                                    className={cn(
                                                                        "p-4 rounded-xl border border-slate-800 transition-all duration-300 cursor-pointer group",
                                                                        selectedActivity === `${day.day}-${aIdx}`
                                                                            ? "bg-blue-600/10 border-blue-500/50 ring-1 ring-blue-500/20"
                                                                            : "bg-slate-800/30 hover:bg-slate-800/50 hover:border-slate-700"
                                                                    )}
                                                                    onClick={() => setSelectedActivity(`${day.day}-${aIdx}`)}
                                                                >
                                                                    <div className="flex items-start justify-between mb-2">
                                                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{activity.time}</div>
                                                                        {activity.ticket_price && (
                                                                            <span className="text-[10px] font-bold text-green-400 bg-green-900/20 px-2 py-0.5 rounded border border-green-500/30 max-w-[50%] truncate" title={activity.ticket_price}>
                                                                                {activity.ticket_price}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <div className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-2">
                                                                        <MapPin className="w-3 h-3 text-blue-500 shrink-0" />
                                                                        <span>{activity.location}</span>
                                                                    </div>
                                                                    {/* Activity Image */}
                                                                    {activity.imageUrl && (
                                                                        <div className="mt-2 mb-2 rounded-lg overflow-hidden h-32 w-full relative">
                                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                            <img
                                                                                src={activity.imageUrl}
                                                                                alt={activity.location}
                                                                                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                    <div className="text-sm text-slate-400 mt-1">{activity.description}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}

                                                {/* Ad Banner after itineraries */}
                                                <AdBanner dataAdSlot="5821234567" className="mt-4" />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {
                                    msg.role === 'user' && (
                                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0 mt-1">
                                            <User className="w-5 h-5 text-slate-300" />
                                        </div>
                                    )
                                }
                            </div>
                        ))}

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
                            <div className="flex gap-3">
                                <div className="hidden md:flex w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center shrink-0 mt-1 overflow-hidden ring-1 ring-white/20">
                                    <AnimatedLogo className="w-5 h-5 text-white" solid />
                                </div>
                                <div className="bg-slate-800 rounded-2xl px-4 py-3 rounded-tl-sm border border-slate-700 flex items-center gap-1">
                                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-900/90 backdrop-blur-lg border-t border-slate-800 safe-bottom">
                        <form onSubmit={handleSend} className="relative flex items-center max-w-2xl mx-auto w-full">
                            <input
                                type="text"
                                name="chat"
                                autoComplete="off"
                                placeholder="Ask for changes (e.g., 'Add 1 day more')..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="w-full bg-slate-800 text-white placeholder:text-slate-500 text-sm md:text-base rounded-xl py-4 md:py-5 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-slate-700 transition-all"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={!input.trim() || loading}
                                className="absolute right-2 text-blue-400 hover:text-white bg-transparent hover:bg-blue-600 rounded-lg w-8 h-8 transition-all"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
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
                        isResizing ? "bg-blue-500" : "bg-slate-700 group-hover:bg-slate-500"
                    )} />
                </div>

                {/* Right Panel - Map */}
                <div
                    className="hidden md:block bg-slate-950 relative"
                    style={isDesktop ? { width: `${100 - leftWidth}%` } : {}}
                >
                    {currentItineraryData ? (
                        <MapView itinerary={currentItineraryData} selectedActivity={selectedActivity} />
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4 bg-slate-900/20">
                            <MapPin className="w-16 h-16 opacity-20" />
                            <p>Map view updates with your itinerary</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Cinematic Loading Overlay */}
            {loading && (
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
            )}
        </div>
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
