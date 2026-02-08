'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { MapPin, Calendar, Loader2, Send, User, Bot, Heart, Share2, Check, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';
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
const AnimatedLogo = dynamic(() => import('@/components/AnimatedLogo'), { ssr: false });
const AuthModal = dynamic(() => import('@/components/AuthModal'), { ssr: false });
const TypewriterText = dynamic(() => import('@/components/TypewriterText'), { ssr: false });

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

    useEffect(() => {
        const fetchIPLocation = async () => {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);

                const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
                clearTimeout(timeoutId);

                if (!res.ok) {
                    throw new Error(`Location fetch failed: ${res.status}`);
                }

                const data = await res.json();
                if (data.latitude && data.longitude) {
                    setUserLoc({ lat: data.latitude, lng: data.longitude });
                }
            } catch (err) {
                console.warn("Could not determine user location (IP API failed).", err);
            }
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLoc({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.warn("Geolocation denied/error, falling back to IP API.", error);
                    fetchIPLocation();
                }
            );
        } else {
            fetchIPLocation();
        }
    }, []);

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

function SearchPageContent() {
    const searchParams = useSearchParams();
    const destination = searchParams.get('destination') || '';

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
        // Only scroll to bottom if we're not in the initial loading state
        // and we have messages (means we've moved past the first load)
        if (!loading && messages.length > 1) {
            scrollToBottom();
        }
    }, [messages, loading, isTyping]);

    useEffect(() => {
        if (destination) {
            fetchItinerary(destination);
        }
    }, [destination]);

    const fetchItinerary = async (dest: string) => {
        setLoading(true);
        const { API_URL } = await import('@/lib/config');
        try {
            const response = await fetch(`${API_URL}/api/search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ destination: dest, days: 2 }),
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
        } catch {
            setMessages([
                {
                    role: 'assistant',
                    type: 'text',
                    content: 'Sorry, I succeeded in finding the destination but failed to generate an itinerary. Please try again.'
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim()) return;

        const userMessage = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', type: 'text', content: userMessage }]);
        setIsTyping(true);

        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'assistant',
                type: 'text',
                content: "I'm focusing on the initial itinerary for now, but I'll be able to help with that request soon!"
            }]);
            setIsTyping(false);
        }, 1500);
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsAuthOpen(true);
            return;
        }

        if (!currentItineraryData) return;

        try {
            const { API_URL } = await import('@/lib/config');
            const res = await fetch(`${API_URL}/api/trips`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    destination,
                    itinerary: currentItineraryData
                })
            });

            if (res.ok) {
                setIsSaved(true);
                toast.success('Trip saved to your profile!');
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to save trip');
        }
    };

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Trip to ${destination}`,
                    text: `Check out this weekend trip to ${destination}!`,
                    url
                });
            } catch {
                // Ignore abort
            }
        } else {
            navigator.clipboard.writeText(url);
            setIsSharing(true);
            toast.success('Link copied to clipboard!');
            setTimeout(() => setIsSharing(false), 2000);
        }
    };

    // Helper to extract the latest itinerary for the map
    const currentItinerary = messages
        .filter(m => m.type === 'itinerary')
        .map(m => m.content as Itinerary)
        .at(-1);

    return (
        <div className="h-screen flex flex-col bg-slate-950 text-slate-100">
            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

            {/* Header */}
            <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between shadow-sm z-10 w-full">
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link href="/" className="contents">
                            <div className="w-10 h-10 text-blue-400 hover:opacity-90 transition-opacity">
                                <AnimatedLogo />
                            </div>
                            <h1 className="text-xl md:text-3xl text-white tracking-tight hover:opacity-90 transition-opacity">
                                <TypewriterText text="weekendtravellers.com" className="font-cursive text-2xl md:text-4xl" delay={500} />
                            </h1>
                        </Link>
                        <div className="flex flex-col md:flex-row md:items-center md:gap-3">
                            <span className="hidden md:inline text-slate-500">|</span>
                            <h2 className="text-sm md:text-lg font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Trip to {destination}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleShare}
                        size="sm"
                        className={cn(
                            "gap-2 text-white border-0 shadow-lg shadow-blue-900/20",
                            isSharing
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        )}
                    >
                        {isSharing ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                        <span className="hidden sm:inline">{isSharing ? 'Copied' : 'Share'}</span>
                    </Button>

                    <Button
                        onClick={handleSave}
                        size="sm"
                        className={cn(
                            "gap-2 transition-all text-white border-0 shadow-lg",
                            isSaved
                                ? "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-red-900/20 scale-105"
                                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-blue-900/20 opacity-90 hover:opacity-100"
                        )}
                    >
                        <Heart className={cn("w-4 h-4", isSaved && "fill-current")} />
                        <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
                    </Button>

                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700">
                                    <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-xs">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 bg-slate-900 border-slate-800 text-slate-100" align="end">
                                <DropdownMenuLabel>
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user.name}</p>
                                        <p className="text-xs leading-none text-slate-400">{user.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-slate-800" />
                                <DropdownMenuItem asChild className="focus:bg-slate-800 focus:text-white cursor-pointer">
                                    <Link href="/profile">My Profile</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-slate-800" />
                                <DropdownMenuItem asChild className="focus:bg-slate-800 focus:text-white cursor-pointer">
                                    <Link href="/trips">My Trips</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-slate-800" />
                                <DropdownMenuItem onClick={handleLogout} className="text-red-400 focus:text-red-300 focus:bg-slate-800 cursor-pointer">
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button
                            onClick={() => setIsAuthOpen(true)}
                            size="sm"
                            className="text-white border-0 shadow-lg shadow-blue-900/20 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                            Login
                        </Button>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden w-full">
                {/* Left Panel - Chat */}
                <div className="w-full md:w-[45%] lg:w-[40%] border-r border-slate-800 flex flex-col bg-slate-900/50 backdrop-blur-sm relative">

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={cn("flex gap-3", msg.role === 'user' ? "justify-end" : "justify-start")}>

                                {msg.role === 'assistant' && (
                                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-1 shadow-lg shadow-blue-900/20 overflow-hidden">
                                        <AnimatedLogo className="w-5 h-5 text-white" />
                                    </div>
                                )}

                                <div className={cn(
                                    "max-w-[85%] rounded-2xl p-4 shadow-md",
                                    msg.role === 'user'
                                        ? "bg-blue-600 text-white rounded-tr-sm"
                                        : "bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700"
                                )}>
                                    {msg.type === 'text' ? (
                                        <p className="leading-relaxed">{msg.content as string}</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {/* Trip Overview Card */}
                                            <div className="bg-slate-900/80 rounded-xl p-4 border border-blue-500/20 shadow-lg mb-6">
                                                <h3 className="text-lg font-bold text-blue-200 mb-3 flex items-center">
                                                    <MapPin className="w-5 h-5 mr-2 text-blue-400" />
                                                    Overview: {(msg.content as Itinerary).destination}
                                                </h3>

                                                <div className="grid grid-cols-2 gap-4 mb-4">
                                                    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                                                        <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Est. Budget</div>
                                                        <div className="text-xl font-bold text-green-400">
                                                            {(msg.content as Itinerary).trip_details?.currency} {(msg.content as Itinerary).trip_details?.estimated_budget}
                                                        </div>
                                                    </div>
                                                    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                                                        <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Best Time</div>
                                                        <div className="text-sm font-bold text-slate-200 flex items-center h-full">
                                                            <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                                                            {(msg.content as Itinerary).trip_details?.best_time_to_visit}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Distance (calculated client-side) */}
                                                <DistanceDisplay destinationCoords={(msg.content as Itinerary).trip_details?.destination_coordinates} />

                                                {/* Hotels */}
                                                <div className="mt-4">
                                                    <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Where to Stay</div>
                                                    <div className="space-y-2">
                                                        {(msg.content as Itinerary).trip_details?.hotel_suggestions?.map((hotel, hIdx) => (
                                                            <div key={hIdx} className="flex justify-between items-center bg-slate-800/30 p-2 rounded border border-slate-700/50">
                                                                <div>
                                                                    <div className="font-semibold text-slate-200 text-sm">{hotel.name}</div>
                                                                    <div className="text-[10px] text-slate-500 uppercase">{hotel.tier}</div>
                                                                </div>
                                                                <div className="text-xs font-bold text-blue-300">{hotel.price_range}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                {/* Special Events Card */}
                                                {(msg.content as Itinerary).special_events && (msg.content as Itinerary).special_events!.length > 0 && (
                                                    <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-xl p-4 border border-purple-500/30 shadow-lg mb-6 relative overflow-hidden group">
                                                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                                            <Calendar className="w-16 h-16 text-purple-400 transform rotate-12" />
                                                        </div>
                                                        <h3 className="text-lg font-bold text-purple-200 mb-3 flex items-center relative z-10">
                                                            <Calendar className="w-5 h-5 mr-2 text-purple-400" />
                                                            Special Events & Festivals
                                                        </h3>
                                                        <div className="space-y-3 relative z-10">
                                                            {(msg.content as Itinerary).special_events!.map((event, eIdx) => (
                                                                <div key={eIdx} className="bg-slate-900/60 p-3 rounded-lg border border-purple-500/20 backdrop-blur-sm hover:border-purple-500/40 transition-colors">
                                                                    <div className="flex justify-between items-start">
                                                                        <div className="font-bold text-slate-200 text-sm">{event.name}</div>
                                                                        <div className="text-[10px] uppercase font-bold text-purple-300 bg-purple-900/30 px-2 py-0.5 rounded border border-purple-500/30">
                                                                            {event.date}
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                                                        <MapPin className="w-3 h-3 text-slate-500" /> {event.location}
                                                                    </div>
                                                                    <div className="text-sm text-slate-300 mt-2 leading-snug">
                                                                        {event.description}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <p className="font-medium text-blue-200">
                                                Here&apos;s a {(msg.content as Itinerary).days.length}-day itinerary for {(msg.content as Itinerary).destination}:
                                            </p>
                                            <div className="space-y-6">
                                                {(msg.content as Itinerary).days.map((day) => (
                                                    <div key={day.day} className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                                                        <h4 className="font-semibold text-blue-300 mb-3 flex items-center">
                                                            <Calendar className="w-4 h-4 mr-2" /> Day {day.day}: {day.title}
                                                        </h4>
                                                        <div className="space-y-4 relative pl-4 border-l-2 border-slate-700">
                                                            {day.activities.map((activity, i) => (
                                                                <div
                                                                    key={i}
                                                                    className={cn(
                                                                        "cursor-pointer p-2 rounded-lg transition-all border border-transparent",
                                                                        selectedActivity === `${day.day}-${i}`
                                                                            ? "bg-blue-500/10 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                                                                            : "hover:bg-white/5"
                                                                    )}
                                                                    onClick={() => setSelectedActivity(`${day.day}-${i}`)}
                                                                >
                                                                    <div className="flex justify-between items-start mb-1">
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
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {msg.role === 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0 mt-1">
                                        <User className="w-5 h-5 text-slate-300" />
                                    </div>
                                )}
                            </div>
                        ))}

                        {loading && (
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-1 animate-pulse overflow-hidden">
                                    <AnimatedLogo className="w-5 h-5 text-white" />
                                </div>
                                <div className="bg-slate-800 rounded-2xl p-4 rounded-tl-sm border border-slate-700 flex items-center">
                                    <Loader2 className="w-5 h-5 text-blue-400 animate-spin mr-2" />
                                    <span className="text-slate-400 text-sm">Planning your trip and finding great spots...</span>
                                </div>
                            </div>
                        )}

                        {isTyping && (
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-1 overflow-hidden">
                                    <AnimatedLogo className="w-5 h-5 text-white" />
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
                    <div className="p-4 bg-slate-900 border-t border-slate-800">
                        <form onSubmit={handleSend} className="relative flex items-center">
                            <input
                                type="text"
                                placeholder="Ask for changes (e.g., 'Add a vegan lunch spot')..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="w-full bg-slate-800 text-white placeholder:text-slate-500 text-sm rounded-xl py-5 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-slate-700 transition-all hover:border-slate-600"
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

                {/* Right Panel - Map */}
                <div className="hidden md:block flex-1 bg-slate-950 relative">
                    {currentItinerary ? (
                        <MapView itinerary={currentItinerary} selectedActivity={selectedActivity} />
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4 bg-slate-900/20">
                            <MapPin className="w-16 h-16 opacity-20" />
                            <p>Map view updates with your itinerary</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>}>
            <SearchPageContent />
        </Suspense>
    );
}
