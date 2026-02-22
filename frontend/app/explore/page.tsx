'use client';

import { useState, useEffect } from 'react';
import { EXLPORE_DESTINATIONS, calculateDistance, DestinationOption } from '@/lib/destinations';
import { MapPin, Navigation, Compass, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { API_URL } from '@/lib/config';
import InnerHeader from '@/components/InnerHeader';

interface UserTrip {
    _id: string;
    destination: string;
    createdAt: string;
    itinerary?: {
        summary?: string;
        heroImage?: { url: string };
        days?: Array<{ activities?: Array<{ imageUrl?: string }> }>;
    };
}

export default function ExplorePage() {
    const [sortedDestinations, setSortedDestinations] = useState<DestinationOption[]>(EXLPORE_DESTINATIONS);
    const [userTrips, setUserTrips] = useState<UserTrip[]>([]);
    const [isLocating, setIsLocating] = useState(true);
    const [locationError, setLocationError] = useState(false);

    useEffect(() => {
        // Fetch User Trips
        const fetchPublicTrips = async () => {
            try {
                const res = await fetch(`${API_URL}/api/trips/public?limit=12`);
                if (res.ok) {
                    const data = await res.json();
                    setUserTrips(data);
                }
            } catch (error) {
                console.error('Failed to fetch public trips:', error);
            }
        };
        fetchPublicTrips();

        // Get Geolocation
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;

                    const sorted = [...EXLPORE_DESTINATIONS].sort((a, b) => {
                        const distA = calculateDistance(userLat, userLng, a.lat, a.lng);
                        const distB = calculateDistance(userLat, userLng, b.lat, b.lng);
                        return distA - distB;
                    });

                    setSortedDestinations(sorted);
                    setIsLocating(false);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setLocationError(true);
                    setIsLocating(false);
                },
                { timeout: 5000 }
            );
        } else {
            setLocationError(true);
            setIsLocating(false);
        }
    }, []);

    const getTripImage = (trip: UserTrip) => {
        return trip.itinerary?.heroImage?.url || trip.itinerary?.days?.[0]?.activities?.[0]?.imageUrl || 'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=800';
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
            <InnerHeader title="Explore" subtitle="World Directory" />

            <main className="max-w-7xl mx-auto px-4 lg:px-8 py-12 space-y-20">
                {/* Hero Section */}
                <section className="text-center space-y-6 max-w-3xl mx-auto">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-full border border-blue-500/20 mb-4 animate-pulse">
                        <Compass className="w-6 h-6 text-blue-400" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
                        Explore The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">World</span>
                    </h1>
                    <p className="text-lg text-slate-400 leading-relaxed">
                        Discover top curated destinations and explore brilliant itineraries created by our community. Your next adventure starts here.
                    </p>
                </section>

                {/* Popular Destinations / Nearby */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Navigation className={cn("w-5 h-5", !locationError && !isLocating ? "text-blue-400" : "text-slate-500")} />
                                {!isLocating && !locationError ? "Destinations Near You" : "Popular Destinations"}
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                {isLocating ? "Locating you..." : (!locationError ? "Sorted by distance from your current location" : "Showing our top picks globally")}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {sortedDestinations.map((dest) => (
                            <Link
                                href={`/explore/${dest.id}`}
                                key={dest.id}
                                className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-900 cursor-pointer block"
                            >
                                <div className="absolute inset-0">
                                    <Image
                                        src={dest.image}
                                        alt={dest.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent opacity-80" />
                                </div>

                                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">
                                            <MapPin className="w-3 h-3" />
                                            {dest.country}
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">{dest.name}</h3>

                                        <div className="flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                            {dest.tags.slice(0, 2).map(tag => (
                                                <span key={tag} className="text-[10px] font-semibold bg-white/10 backdrop-blur-md px-2 py-1 rounded-md text-slate-200">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Community Itineraries */}
                {userTrips.length > 0 && (
                    <section className="pt-10 border-t border-slate-800/50">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-purple-400" />
                                    Community Trips
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">Recent itineraries built by Weekend Travellers users</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {userTrips.map((trip) => (
                                <Link
                                    href={`/trip/${trip._id}`}
                                    key={trip._id}
                                    className="group bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden hover:bg-slate-800/80 transition-all hover:border-slate-700 flex flex-col"
                                >
                                    <div className="relative h-48 w-full overflow-hidden">
                                        <Image
                                            src={getTripImage(trip)}
                                            alt={trip.destination}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-3 left-3 flex gap-2">
                                            <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm border border-white/10">
                                                Itinerary
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col">
                                        <h3 className="text-lg font-bold text-slate-100 mb-2 line-clamp-1">{trip.destination}</h3>
                                        <p className="text-sm text-slate-400 line-clamp-2 mb-4 flex-1">
                                            {trip.itinerary?.summary || 'A curated adventure waiting to be explored.'}
                                        </p>
                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800/50">
                                            <span className="text-xs text-slate-500">
                                                {new Date(trip.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                            <span className="text-sm font-medium text-blue-400 flex items-center group-hover:text-blue-300 transition-colors">
                                                View <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
