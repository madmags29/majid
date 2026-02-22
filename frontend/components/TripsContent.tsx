'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Share2, MapPin, Calendar, Loader2, Cloud, HardDrive, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import CinematicLoader from '@/components/CinematicLoader';
import InnerHeader from '@/components/InnerHeader';

const AuthModal = dynamic(() => import('@/components/AuthModal'), { ssr: false });
const AdBanner = dynamic(() => import('@/components/AdBanner'), { ssr: false });

interface Trip {
    _id: string;
    destination: string;
    createdAt: string;
    isLocal?: boolean;
    imageUrl?: string;
    itinerary?: unknown;
}

export default function TripsContent() {
    const router = useRouter();
    const [user, setUser] = useState<{ name: string, email: string } | null>(null);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);

    const loadAllTrips = async () => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            setLoading(false);
            return;
        }
        setUser(JSON.parse(storedUser));

        const token = localStorage.getItem('token');
        let combinedTrips: Trip[] = [];

        // 1. Get Local Recent Searches
        try {
            const localSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
            combinedTrips = [...localSearches];
        } catch (e) {
            console.error('Error loading local searches', e);
        }

        // 2. Get Backend Saved Trips (if logged in)
        if (token) {
            try {
                const { API_URL } = await import('@/lib/config');
                const res = await fetch(`${API_URL}/api/trips`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    // Filter out backend trips from local searches to avoid duplicates
                    const savedDestinations = data.map((t: { destination: string }) => t.destination.toLowerCase());
                    combinedTrips = combinedTrips.filter(t => !savedDestinations.includes(t.destination.toLowerCase()));
                    combinedTrips = [...data, ...combinedTrips];
                }
            } catch (e) {
                console.error('Error connecting to server for trips', e);
            }
        }

        // Sort by date descending
        combinedTrips.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setTrips(combinedTrips);
        setLoading(false);
    };

    useEffect(() => {
        loadAllTrips();
        const handleStorageChange = () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
                loadAllTrips();
            } else {
                setUser(null);
                setTrips([]);
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleDelete = async (id: string, isLocal?: boolean) => {
        if (isLocal) {
            try {
                const localSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
                const updated = localSearches.filter((t: Trip) => t._id !== id);
                localStorage.setItem('recentSearches', JSON.stringify(updated));
                setTrips(prev => prev.filter(t => t._id !== id));
                toast.success('Search removed');
            } catch (e) {
                toast.error('Failed to remove search');
            }
            return;
        }

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
                toast.success('Saved trip deleted');
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
            <InnerHeader title="My Trips" subtitle="Planned Adventures" showBack backHref="/" />
            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

            {/* Content */}
            <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
                {!user ? (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-8 animate-in fade-in zoom-in duration-700">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
                            <div className="relative w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center shadow-2xl border border-white/10 group">
                                <LogIn className="w-12 h-12 text-blue-400 group-hover:scale-110 transition-transform" />
                            </div>
                        </div>
                        <div className="max-w-md mx-auto">
                            <h2 className="text-3xl font-black text-white mb-4 tracking-tighter italic uppercase">Login Required</h2>
                            <p className="text-slate-400 mb-8 text-lg font-medium leading-relaxed">
                                Join our community of travelers to save itineraries, track your weekend plans, and sync trips across all your devices.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    onClick={() => setIsAuthOpen(true)}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-6 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-900/40 hover:scale-105 active:scale-95"
                                >
                                    Sign In / Register
                                </Button>
                                <Link href="/">
                                    <Button variant="ghost" className="text-slate-400 hover:text-white px-8 py-6 text-lg rounded-2xl border border-white/5 hover:bg-white/5">
                                        Back to Home
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : trips.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
                        <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center shadow-inner border border-slate-800">
                            <MapPin className="w-10 h-10 text-slate-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-200 mb-2">No Saved Trips Yet</h2>
                            <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                                Start exploring destinations and your recent searches and saved itineraries will appear here.
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
                                    <div className="h-40 bg-gradient-to-br from-slate-800 to-slate-900 relative p-6 flex flex-col justify-end overflow-hidden">
                                        {trip.imageUrl && (
                                            <>
                                                <Image
                                                    src={trip.imageUrl}
                                                    alt={trip.destination}
                                                    fill
                                                    className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500"
                                                    sizes="(max-width: 768px) 100vw, 400px"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
                                            </>
                                        )}
                                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 z-10">
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
                                                onClick={() => handleDelete(trip._id, trip.isLocal)}
                                                title={trip.isLocal ? "Remove Recent Search" : "Delete Saved Trip"}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <div className="relative z-10 flex items-center justify-between">
                                            <h3 className="text-2xl font-bold text-white drop-shadow-md">{trip.destination}</h3>
                                            <div className="flex items-center">
                                                {trip.isLocal ? (
                                                    <span className="flex items-center text-[10px] font-bold tracking-wider uppercase bg-slate-800/80 text-slate-300 px-2 py-1 rounded shadow backdrop-blur-md border border-slate-700">
                                                        <HardDrive className="w-3 h-3 mr-1" />
                                                        Recent
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center text-[10px] font-bold tracking-wider uppercase bg-blue-600/80 text-white px-2 py-1 rounded shadow backdrop-blur-md border border-blue-500/50">
                                                        <Cloud className="w-3 h-3 mr-1" />
                                                        Saved
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <div className="flex items-center text-xs text-slate-500 mb-4">
                                            <Calendar className="w-3 h-3 mr-2" />
                                            {trip.isLocal ? 'Searched on' : 'Saved on'} {new Date(trip.createdAt).toLocaleDateString()}
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
