'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { MapPin, Calendar, Loader2, Send, User, Heart, Share2, Check, ArrowLeft, Bus, Train, Plane, Car, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from './ui/textarea';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import DistanceDisplay from '@/components/DistanceDisplay';

const AnimatedLogo = dynamic(() => import('@/components/AnimatedLogo'));
const AuthModal = dynamic(() => import('@/components/AuthModal'));
// DistanceDisplay is not a default export or file might not exist. Using a placeholder for now if it doesn't exist.
// Assuming it was a component in the search page previously.
// Checking file existence first is better, but for now commenting out if it causes issues or ensuring it exists.
// Based on previous file, it was used. Let's assume it's a component.
// If it was inline, I need to recreate it.
// Checking previous search page content... it was imported dynamically there too? No, it was likely inline or imported.
// Let's comment it out for now to fix build, or check if it exists.
// Actually, I'll check if the file exists first.
const WeatherWidget = dynamic(() => import('@/components/WeatherWidget'));
const AdBanner = dynamic(() => import('@/components/AdBanner'));
import CinematicLoader from '@/components/CinematicLoader';
import MapView from '@/components/MapView';

const TypingResponse = ({ content, onComplete }: { content: string, onComplete?: () => void }) => {
    const [displayed, setDisplayed] = useState('');
    const index = useRef(0);

    useEffect(() => {
        const timer = setInterval(() => {
            if (index.current < content.length) {
                setDisplayed((prev) => prev + content.charAt(index.current));
                index.current++;
            } else {
                clearInterval(timer);
                if (onComplete) onComplete();
            }
        }, 15);
        return () => clearInterval(timer);
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

interface TripDetails {
    estimated_budget: string;
    best_time_to_visit: string;
    currency: string;
    travel_logistics: {
        bus: string;
        train: string;
        flight: string;
        car: string;
        [key: string]: string;
    };
    hotel_suggestions: {
        name: string;
        price_range: string;
        tier: string;
    }[];
    destination_coordinates?: {
        lat: number;
        lng: number;
    };
}

interface Itinerary {
    destination: string;
    duration: string;
    summary: string;
    trip_details?: TripDetails;
    days: {
        day: number;
        title: string;
        activities: {
            time: string;
            activity: string;
            location: string;
            description: string;
            imageUrl?: string;
        }[];
    }[];
}

interface Message {
    role: 'user' | 'assistant';
    content: string | Itinerary;
    type: 'text' | 'itinerary';
    timestamp: number;
}

export default function SearchContent() {
    const searchParams = useSearchParams();
    const initialDestination = searchParams.get('destination');
    const origin = searchParams.get('origin');

    const [input, setInput] = useState(initialDestination || '');
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [currentItineraryData, setCurrentItineraryData] = useState<Itinerary | null>(null);
    const [user, setUser] = useState<{ name: string, email: string } | null>(null);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    useEffect(() => {
        if (initialDestination) {
            handleInitialSearch(initialDestination, origin);
        } else {
            setLoading(false);
            setMessages([{
                role: 'assistant',
                content: "Hi there! I'm your AI travel planner. Where would you like to go for your weekend trip?",
                type: 'text',
                timestamp: Date.now()
            }]);
        }
    }, [initialDestination, origin]);

    const handleInitialSearch = async (dest: string, userOrigin: string | null) => {
        setMessages([
            {
                role: 'assistant',
                content: "Hi there! I'm your AI travel planner.",
                type: 'text',
                timestamp: Date.now() - 1000
            },
            {
                role: 'user',
                content: dest,
                type: 'text',
                timestamp: Date.now()
            }
        ]);
        setLoading(true);

        try {
            await generateItinerary(dest, userOrigin);
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate itinerary. Please try again.");
            setLoading(false);
        }
    };

    const generateItinerary = async (dest: string, userOrigin: string | null) => {
        const { API_URL } = await import('@/lib/config');
        setIsTyping(true);

        // Construct a richer prompt context
        let promptContext = dest;
        if (userOrigin) {
            promptContext += ` starting from ${userOrigin}`;
        }

        try {
            const res = await fetch(`${API_URL}/api/search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    destination: dest,
                    origin: userOrigin,
                    days: 2
                })
            });

            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();

            // Simulate network/processing delay for realism if it's too fast
            await new Promise(resolve => setTimeout(resolve, 1500));

            const itinerary: Itinerary = data;
            setCurrentItineraryData(itinerary);
            console.log('Production Search Response:', itinerary);

            // 1. Add intro text
            const introMsg: Message = {
                role: 'assistant',
                content: `Here is a custom weekend itinerary for **${itinerary.destination}**!`,
                type: 'text',
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, introMsg]);

            // 2. Add rich card
            setTimeout(() => {
                const cardMsg: Message = {
                    role: 'assistant',
                    content: itinerary,
                    type: 'itinerary',
                    timestamp: Date.now()
                };
                setMessages(prev => [...prev, cardMsg]);
                setIsTyping(false);
                setLoading(false);
            }, 1000);

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I'm sorry, I couldn't generate a trip plan for that destination. Please try another one.",
                type: 'text',
                timestamp: Date.now()
            }]);
            setIsTyping(false);
            setLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!input.trim() || loading || !currentItineraryData) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg, type: 'text', timestamp: Date.now() }]);
        setIsTyping(true);

        const { API_URL } = await import('@/lib/config');

        try {
            // Context helps the AI modify the existing plan
            const res = await fetch(`${API_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userRequest: userMsg,
                    currentItinerary: currentItineraryData
                })
            });

            if (!res.ok) throw new Error('Refinement failed');
            const data = await res.json();

            const newItinerary = data;
            setCurrentItineraryData(newItinerary);

            setTimeout(() => {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: `I've updated the itinerary based on your request: "${userMsg}"`,
                    type: 'text',
                    timestamp: Date.now()
                }]);

                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        role: 'assistant',
                        content: newItinerary,
                        type: 'itinerary',
                        timestamp: Date.now()
                    }]);
                    setIsTyping(false);
                }, 800);
            }, 800);

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I'm having trouble modifying the plan right now.",
                type: 'text',
                timestamp: Date.now()
            }]);
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleSaveTrip = async () => {
        if (!user) {
            toast.error('Please login to save trips');
            setIsAuthOpen(true);
            return;
        }

        if (!currentItineraryData) return;

        setIsSaving(true);
        const token = localStorage.getItem('token');
        const { API_URL } = await import('@/lib/config');

        try {
            const res = await fetch(`${API_URL}/api/trips`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    destination: currentItineraryData.destination,
                    itinerary: currentItineraryData
                })
            });

            if (res.ok) {
                toast.success('Trip saved to My Trips!');
            } else {
                toast.error('Failed to save trip');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error saving trip');
        } finally {
            setIsSaving(false);
        }
    };

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        setIsSharing(true);
        toast.success('Link copied to clipboard!');
        setTimeout(() => setIsSharing(false), 2000);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        toast.success('Logged out successfully');
        window.location.href = '/';
    };

    return (
        <div className="flex flex-col h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-blue-500/30">
            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

            {/* Header */}
            <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-6 fixed top-0 w-full z-50">
                <div className="flex items-center gap-3">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                            <ArrowLeft className="w-5 h-5 text-slate-300" />
                        </Button>
                    </Link>
                    <Link href="/" className="flex items-center gap-2 group">
                        <AnimatedLogo className="w-8 h-8 text-blue-500 group-hover:text-blue-400 transition-colors" />
                        <span className="font-cursive text-2xl text-white hidden sm:block">weekendtravellers.com</span>
                    </Link>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    {/* Action Buttons */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="hidden sm:flex border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300">
                                <Share2 className="w-4 h-4 mr-2" /> Share
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-200">
                            <DropdownMenuItem onClick={handleShare} className="focus:bg-slate-800 cursor-pointer">
                                Copy Link
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="sm:hidden text-slate-300"
                        onClick={handleShare}
                    >
                        <Share2 className="w-5 h-5" />
                    </Button>

                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700">
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
                            className="h-8 sm:h-9 px-2 sm:px-3 text-white border-0 shadow-lg shadow-blue-900/20 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center gap-1 sm:gap-2"
                        >
                            <LogIn className="w-4 h-4" />
                            <span className="hidden sm:inline">Login</span>
                        </Button>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden w-full pt-16">
                {/* Left Panel - Chat */}
                <div className="w-full md:w-[45%] lg:w-[40%] border-r border-slate-800 flex flex-col bg-slate-900/50 backdrop-blur-sm relative">

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent" ref={scrollRef}>
                        {messages.map((msg, idx) => (
                            <div key={idx} className={cn("flex gap-3", msg.role === 'user' ? "justify-end" : "justify-start")}>

                                {msg.role === 'assistant' && (
                                    <div className="hidden md:flex w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center shrink-0 mt-1 shadow-lg shadow-blue-900/20 overflow-hidden ring-1 ring-white/20">
                                        <AnimatedLogo className="w-5 h-5 text-white" solid />
                                    </div>
                                )}

                                <div className={cn(
                                    "w-full md:max-w-[85%] rounded-2xl p-4 shadow-md",
                                    msg.role === 'user' ? "bg-blue-600 text-white rounded-tr-sm" : "bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700"
                                )}>
                                    {msg.type === 'text' ? (
                                        <TypingResponse content={msg.content as string} />
                                    ) : (
                                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                            {/* Trip Overview Card */}
                                            <div className="bg-slate-900/80 rounded-3xl p-6 border border-white/10 shadow-2xl mb-8">
                                                <h3 className="text-3xl font-bold text-white mb-6">
                                                    Trip to {(msg.content as Itinerary).destination}
                                                </h3>

                                                <div className="border-l-4 border-blue-500 pl-6 py-2 mb-8">
                                                    <p className="text-slate-300 italic text-lg leading-relaxed">
                                                        Experience the rich culture and history of {(msg.content as Itinerary).destination} with this 2-day weekend trip itinerary filled with iconic landmarks, vibrant markets, and delicious cuisine.
                                                    </p>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                                    <div className="bg-slate-800/40 p-6 rounded-3xl border border-white/5 flex flex-col justify-between">
                                                        <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2">BUDGET</div>
                                                        <div className="text-2xl font-bold text-white">
                                                            {(msg.content as Itinerary).trip_details?.currency} {(msg.content as Itinerary).trip_details?.estimated_budget}
                                                        </div>
                                                    </div>
                                                    <div className="bg-slate-800/40 p-6 rounded-3xl border border-white/5 flex flex-col justify-between">
                                                        <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2">WHEN</div>
                                                        <div className="text-lg font-bold text-white leading-tight">
                                                            {(msg.content as Itinerary).trip_details?.best_time_to_visit}
                                                        </div>
                                                    </div>
                                                    {/* Weather Widget */}
                                                    {(msg.content as Itinerary).trip_details?.destination_coordinates ? (
                                                        <div className="bg-slate-800/40 rounded-3xl border border-white/5 overflow-hidden">
                                                            <WeatherWidget
                                                                lat={(msg.content as Itinerary).trip_details!.destination_coordinates!.lat}
                                                                lng={(msg.content as Itinerary).trip_details!.destination_coordinates!.lng}
                                                                className="h-full w-full"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="bg-slate-800/40 p-6 rounded-3xl border border-white/5 flex items-center justify-center text-slate-500 text-xs italic">
                                                            Weather unavailable
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Distance (calculated client-side) */}
                                                <div className="mb-6">
                                                    <DistanceDisplay destinationCoords={(msg.content as Itinerary).trip_details?.destination_coordinates} />
                                                </div>

                                                {/* Transportation */}
                                                <div className="bg-slate-800/30 rounded-3xl p-6 border border-white/5 mb-8">
                                                    <div className="flex items-center gap-3 mb-6">
                                                        <Bus className="w-5 h-5 text-slate-400" />
                                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">TRAVEL TIMES FROM {origin ? origin.toUpperCase() : 'YOUR LOCATION'}</span>
                                                    </div>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                        <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
                                                                <Bus className="w-5 h-5 text-orange-500" />
                                                            </div>
                                                            <div>
                                                                <div className="text-[10px] text-slate-500 font-bold uppercase">Bus</div>
                                                                <div className="text-sm font-bold text-white">{(msg.content as Itinerary).trip_details?.travel_logistics?.bus?.split(' ')[0] || "N/A"} hours</div>
                                                            </div>
                                                        </div>
                                                        <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                                                                <Train className="w-5 h-5 text-blue-500" />
                                                            </div>
                                                            <div>
                                                                <div className="text-[10px] text-slate-500 font-bold uppercase">Train</div>
                                                                <div className="text-sm font-bold text-white">{(msg.content as Itinerary).trip_details?.travel_logistics?.train?.split(' ')[0] || "N/A"} hours</div>
                                                            </div>
                                                        </div>
                                                        <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
                                                                <Plane className="w-5 h-5 text-purple-500" />
                                                            </div>
                                                            <div>
                                                                <div className="text-[10px] text-slate-500 font-bold uppercase">Flight</div>
                                                                <div className="text-sm font-bold text-white">{(msg.content as Itinerary).trip_details?.travel_logistics?.flight?.split(' ')[0] || "N/A"} hours</div>
                                                            </div>
                                                        </div>
                                                        <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                                                                <Car className="w-5 h-5 text-green-500" />
                                                            </div>
                                                            <div>
                                                                <div className="text-[10px] text-slate-500 font-bold uppercase">Car</div>
                                                                <div className="text-sm font-bold text-white">{(msg.content as Itinerary).trip_details?.travel_logistics?.car?.split(' ')[0] || "N/A"} hours</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Distance (calculated client-side) */}
                                                <DistanceDisplay destinationCoords={(msg.content as Itinerary).trip_details?.destination_coordinates} />

                                                {/* Hotels */}
                                                <div className="mt-8 border-t border-white/10 pt-8">
                                                    <div className="flex items-center gap-2 mb-6">
                                                        <Heart className="w-4 h-4 text-pink-500" />
                                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">RECOMMENDED STAYS</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {(msg.content as Itinerary).trip_details?.hotel_suggestions?.map((hotel, hIdx) => {
                                                            const hotelUrl = `https://search.hotellook.com/hotels?destination=${encodeURIComponent(hotel.name + ' ' + (msg.content as Itinerary).destination)}&marker=497779`;
                                                            return (
                                                                <a key={hIdx} href={hotelUrl} target="_blank" rel="noopener noreferrer" className="block bg-slate-800/40 hover:bg-slate-800 p-5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all group flex flex-col justify-between h-full">
                                                                    <div>
                                                                        <div className="flex justify-between items-start mb-2">
                                                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-bold uppercase tracking-wide">{hotel.tier}</span>
                                                                        </div>
                                                                        <div className="font-bold text-base text-white group-hover:text-blue-400 transition-colors mb-2 leading-tight">{hotel.name}</div>
                                                                    </div>
                                                                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
                                                                        <div className="text-xs text-slate-400">Avg. Night</div>
                                                                        <div className="text-sm font-bold text-blue-400">{hotel.price_range}</div>
                                                                    </div>
                                                                    <div className="mt-3 text-xs font-bold text-blue-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                                                                        Book Now <ArrowLeft className="w-3 h-3 rotate-180" />
                                                                    </div>
                                                                </a>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex flex-col sm:flex-row gap-3 mt-4">
                                                <Button
                                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                                    onClick={handleSaveTrip}
                                                    disabled={isSaving}
                                                >
                                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Heart className="w-4 h-4 mr-2" />}
                                                    Save Trip
                                                </Button>
                                                <Button
                                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                                                    onClick={handleShare}
                                                >
                                                    {isSharing ? <Check className="w-4 h-4 mr-2" /> : <Share2 className="w-4 h-4 mr-2" />}
                                                    {isSharing ? 'Copied!' : 'Share Plan'}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {msg.role === 'user' && (
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
                                        "Analyzing travel patterns...",
                                        "Finding the best hotels...",
                                        "Checking weather forecasts...",
                                        "Optimizing your itinerary...",
                                        "Finalizing your perfect trip..."
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
                        <div ref={scrollRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-slate-900 border-t border-slate-800">
                        <div className="relative">
                            <Textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Refine your trip (e.g., 'Make it budget-friendly' or 'Add more nature spots')..."
                                className="w-full bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500 rounded-xl pr-12 resize-none focus:ring-blue-500/50 min-h-[50px] max-h-[120px]"
                                rows={1}
                                disabled={isTyping}
                            />
                            <Button
                                size="icon"
                                className="absolute right-2 bottom-2 h-8 w-8 bg-blue-600 hover:bg-blue-500 rounded-lg text-white disabled:opacity-50"
                                onClick={handleSendMessage}
                                disabled={!input.trim() || isTyping}
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-2 text-center">
                            AI can make mistakes. Please verify logistics independently.
                        </p>
                    </div>
                </div>

                {/* Right Panel - Map/Itinerary Visualization (Hidden on mobile) */}
                <div className="hidden md:block md:w-[55%] lg:w-[60%] relative bg-[#0f172a] overflow-y-auto">
                    {currentItineraryData ? (
                        <div className="h-full flex flex-col">
                            {/* Map Fixed at Top */}
                            <div className="h-[45%] min-h-[300px] w-full relative z-10 border-b border-slate-800">
                                <MapView
                                    itinerary={currentItineraryData}
                                    selectedActivity={selectedActivity}
                                    isExpanded={true}
                                />
                            </div>

                            {/* Scrollable Itinerary Timeline */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                                <div className="space-y-8 max-w-4xl mx-auto w-full">
                                    {currentItineraryData.days?.map((day) => (
                                        <div key={day.day} className="relative pl-8 border-l border-slate-800">
                                            <div className="absolute -left-3 top-0 w-6 h-6 bg-slate-900 border border-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-blue-500">
                                                {day.day}
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-6 pl-2">{day.title}</h3>
                                            <div className="space-y-6">
                                                {day.activities.map((act, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="bg-slate-900/50 p-5 rounded-xl border border-white/5 hover:border-blue-500/30 transition-all group cursor-pointer"
                                                        onClick={() => {
                                                            setSelectedActivity(act);
                                                            console.log("Clicked activity:", act);
                                                        }}
                                                    >
                                                        <div className="flex items-start justify-between mb-2">
                                                            <span className="text-blue-400 font-mono text-xs font-bold bg-blue-950/30 px-2 py-1 rounded">
                                                                {act.time}
                                                            </span>
                                                        </div>
                                                        <h4 className="text-lg font-bold text-slate-200 mb-1 group-hover:text-blue-400 transition-colors">
                                                            {act.activity}
                                                        </h4>
                                                        <div className="flex items-center text-xs text-slate-500 mb-2">
                                                            <MapPin className="w-3 h-3 mr-1" />
                                                            {act.location}
                                                        </div>
                                                        {act.imageUrl && (
                                                            <div className="mb-3 rounded-lg overflow-hidden h-32 w-full">
                                                                <img src={act.imageUrl} alt={act.activity} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                                                            </div>
                                                        )}
                                                        <p className="text-slate-400 text-sm leading-relaxed">
                                                            {act.description}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Ad Banner in Right Panel */}
                                    <div className="mt-8">
                                        <AdBanner dataAdSlot="5821234567" className="mt-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 p-8 text-center opacity-50">
                            <MapPin className="w-16 h-16 mb-4 text-slate-700" />
                            <h3 className="text-xl font-bold text-slate-600 mb-2">Map & Itinerary View</h3>
                            <p className="max-w-md">
                                Your detailed itinerary timeline and interactive map will appear here once you start chatting.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
