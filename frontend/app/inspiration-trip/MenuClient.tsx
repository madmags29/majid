'use client';

import { useState, useRef, useEffect, Suspense, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { ArrowLeft, User, LogIn, Calendar, Loader2, MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });
import InnerHeader from '@/components/InnerHeader';

// Mock Curated Destinations for Menu
const curatedDestinations = [
    {
        title: 'Mountain Retreats',
        description: 'Escape to the peaks for serene views and crisp air.',
        destinations: ['Manali', 'Shimla', 'Munnar', 'Darjeeling', 'Ooty', 'Nainital'],
        icon: '⛰️'
    },
    {
        title: 'Coastal Getaways',
        description: 'Sun, sand, and relaxing ocean sounds.',
        destinations: ['Goa', 'Andaman', 'Gokarna', 'Pondicherry', 'Varkala', 'Tarkarli'],
        icon: '🌊'
    },
    {
        title: 'Cultural Explorations',
        description: 'Dive deep into heritage and vibrant history.',
        destinations: ['Jaipur', 'Varanasi', 'Hampi', 'Agra', 'Mysore', 'Khajuraho'],
        icon: '🏛️'
    },
    {
        title: 'Wildlife Safaris',
        description: 'Spot majestic wildlife in their natural habitat.',
        destinations: ['Ranthambore', 'Jim Corbett', 'Bandhavgarh', 'Kaziranga', 'Kanha', 'Gir'],
        icon: '🐅'
    },
    {
        title: 'Desert Escapes',
        description: 'Experience golden dunes and starry night skies.',
        destinations: ['Jaisalmer', 'Pushkar', 'Bikaner', 'Jodhpur', 'Barmer', 'Khimsar'],
        icon: '🐪'
    }
];

function MenuClient() {
    const router = useRouter();
    const [user, setUser] = useState<{ name: string, email: string } | null>(null);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [leftWidth, setLeftWidth] = useState(50);
    const [isResizing, setIsResizing] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    // Placeholder Map State
    const [activeLocation, setActiveLocation] = useState<string | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);

    // Initializations
    useEffect(() => {
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

    // Resizing Logic
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

    const handleSearchClick = (dest: string) => {
        router.push(`/search?destination=${encodeURIComponent(dest)}`);
    };

    return (
        <div className="flex flex-col h-[100dvh] bg-slate-950 text-white overflow-hidden">
            <InnerHeader title="Inspirational Trip" subtitle="Curated Picks" />

            {/* Dual Pane Layout */}
            <div
                ref={containerRef}
                className={cn(
                    "flex-1 flex overflow-hidden relative",
                    isResizing && "cursor-col-resize select-none"
                )}
            >
                {/* Left Panel - Curated Menu Options */}
                <div
                    className="flex flex-col min-w-0 bg-slate-950 border-r border-slate-800 w-full relative h-full"
                    style={isDesktop ? { width: `${leftWidth}%` } : {}}
                >
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth custom-scrollbar pb-32">
                        <div>
                            <h2 className="text-2xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">Inspirational Trip</h2>
                            <p className="text-slate-400 italic">Hand-picked destinations for your next 3-day itinerary.</p>
                        </div>

                        <div className="space-y-6">
                            {curatedDestinations.map((category, idx) => (
                                <div key={idx} className="bg-slate-900/50 rounded-2xl border border-slate-800 p-5 hover:border-slate-700 transition-colors">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-2xl">{category.icon}</span>
                                        <h3 className="text-lg font-bold text-slate-200">{category.title}</h3>
                                    </div>
                                    <p className="text-sm text-slate-400 mb-4">{category.description}</p>

                                    <div className="flex flex-wrap gap-2">
                                        {category.destinations.map((dest) => (
                                            <Button
                                                key={dest}
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleSearchClick(dest)}
                                                onMouseEnter={() => setActiveLocation(dest)}
                                                className="bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-blue-600 hover:text-white rounded-full transition-all group"
                                            >
                                                {dest}
                                                <Search className="w-3 h-3 ml-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
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

                {/* Right Panel - Map */}
                <div
                    className="hidden md:block bg-slate-950 relative"
                    style={isDesktop ? { width: `${100 - leftWidth}%` } : {}}
                >
                    {/* Note: since there's no actual specific itinerary to pass initially, we just show a placeholder interactive state for the map until integration. */}
                    <div className="h-full flex flex-col items-center justify-center bg-slate-900/20 text-slate-500">
                        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 flex flex-col items-center max-w-sm text-center">
                            <MapPin className={cn("w-12 h-12 mb-4 transition-all duration-500", activeLocation ? "text-blue-500 animate-bounce" : "text-slate-600")} />
                            {activeLocation ? (
                                <>
                                    <h3 className="text-xl font-bold text-white mb-2">{activeLocation}</h3>
                                    <p className="text-sm">Select to instantly generate a weekend itinerary for {activeLocation}.</p>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-lg font-bold text-slate-300 mb-2">Hover to Explore</h3>
                                    <p className="text-sm">Hover over our curated destinations to preview their location.</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SuspendedMenuClient() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-screen bg-slate-950 text-white">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        }>
            <MenuClient />
        </Suspense>
    );
}
