'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, Share2, MapPin, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import Link from 'next/link';
const TypewriterText = dynamic(() => import('@/components/TypewriterText'), { ssr: false });
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AnimatedLogo = dynamic(() => import('@/components/AnimatedLogo'), { ssr: false });
const AdBanner = dynamic(() => import('@/components/AdBanner'), { ssr: false });
import CinematicLoader from '@/components/CinematicLoader';

interface Trip {
    _id: string;
    destination: string;
    createdAt: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    itinerary?: any;
}

export default function TripsContent() {
    const router = useRouter();
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<{ name: string, email: string } | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token) {
            router.push('/');
            return;
        }

        if (userData) {
            setUser(JSON.parse(userData));
        }

        fetchTrips(token);
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/');
        toast.success('Logged out successfully');
    };

    const fetchTrips = async (token: string) => {
        const { API_URL } = await import('@/lib/config');
        try {
            const res = await fetch(`${API_URL}/api/trips`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setTrips(data);
            } else {
                toast.error('Failed to load trips');
            }
        } catch {
            toast.error('Error connecting to server');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const { API_URL } = await import('@/lib/config');
            const res = await fetch(`${API_URL}/api/trips/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                setTrips(prev => prev.filter(t => t._id !== id));
                toast.success('Trip deleted');
            } else {
                toast.error('Failed to delete trip');
            }
        } catch {
            toast.error('Error deleting trip');
        }
    };

    const handleShare = (destination: string) => {
        const url = `${window.location.origin}/search?destination=${encodeURIComponent(destination)}`;
        navigator.clipboard.writeText(url);
        toast.success('Trip link copied!');
    };

    if (loading) {
        return (
            <CinematicLoader
                messages={[
                    "Retrieving your travel memories...",
                    "Loading your saved itineraries...",
                    "Preparing your trips dashboard..."
                ]}
            />
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            {/* Header */}
            <header className="p-6 flex items-center justify-between border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-2 md:gap-4">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 w-10 h-10 md:w-10 md:h-10">
                            <ArrowLeft className="w-5 h-5 md:w-5 md:h-5" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2 md:gap-3">
                        <Link href="/" className="contents">
                            <div className="hidden">
                                <AnimatedLogo />
                            </div>
                            <h1 className="text-lg md:text-3xl text-white tracking-tight hover:opacity-90 transition-opacity">
                                <TypewriterText text="weekendtravellers.com" className="font-cursive text-xl md:text-4xl" delay={500} />
                            </h1>
                        </Link>
                        <div className="flex flex-col md:flex-row md:items-center md:gap-3">
                            <span className="hidden md:inline text-slate-500">|</span>
                            <h2 className="text-sm md:text-lg font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                My Trips
                            </h2>
                        </div>
                    </div>
                </div>

                {user && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700 ml-2">
                                <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-xs">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 bg-slate-900 border-slate-800 text-slate-100" align="end">
                            <DropdownMenuLabel>
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user.name}</p>
                                    <p className="text-xs leading-none text-slate-400">User Setup</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-slate-800" />
                            <DropdownMenuItem asChild className="focus:bg-slate-800 focus:text-white cursor-pointer hover:bg-slate-800">
                                <Link href="/profile">My Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-800" />
                            <DropdownMenuItem asChild className="focus:bg-slate-800 focus:text-white cursor-pointer hover:bg-slate-800">
                                <Link href="/trips">My Trips</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-800" />
                            <DropdownMenuItem onClick={handleLogout} className="text-red-400 focus:text-red-300 focus:bg-slate-800 cursor-pointer hover:bg-slate-800">
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </header>

            {/* Content */}
            <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
                {trips.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
                        <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center shadow-inner border border-slate-800">
                            <MapPin className="w-10 h-10 text-slate-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-200 mb-2">No Saved Trips Yet</h2>
                            <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                                Start exploring destinations and save your favorite itineraries here.
                            </p>
                            <Link href="/">
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-blue-900/20">
                                    Explore Destinations
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {trips.map((trip) => (
                                <motion.div
                                    key={trip._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group shadow-lg"
                                >
                                    {/* Placeholder Image Area */}
                                    <div className="h-40 bg-gradient-to-br from-slate-800 to-slate-900 relative p-6 flex flex-col justify-end">
                                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                            <Button
                                                variant="secondary"
                                                size="icon"
                                                className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white border border-white/10 backdrop-blur-sm"
                                                onClick={() => handleShare(trip.destination)}
                                                title="Share Trip"
                                            >
                                                <Share2 className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-red-600/90 border border-white/10 backdrop-blur-sm"
                                                onClick={() => handleDelete(trip._id)}
                                                title="Delete Trip"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white drop-shadow-md">{trip.destination}</h3>
                                    </div>

                                    <div className="p-4">
                                        <div className="flex items-center text-xs text-slate-500 mb-4">
                                            <Calendar className="w-3 h-3 mr-2" />
                                            Saved on {new Date(trip.createdAt).toLocaleDateString()}
                                        </div>

                                        <Link href={`/search?destination=${encodeURIComponent(trip.destination)}`}>
                                            <Button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600">
                                                View Itinerary
                                            </Button>
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Ad Banner after trips list */}
                        <div className="max-w-4xl mx-auto w-full">
                            <AdBanner dataAdSlot="7891234567" />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
