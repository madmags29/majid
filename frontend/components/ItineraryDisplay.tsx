'use client';

import React, { useState } from 'react';
import { MapPin, Calendar, Clock, Bus, Train, Plane, Car, Heart, ArrowLeft } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import dynamic from 'next/dynamic';

const WeatherWidget = dynamic(() => import('@/components/WeatherWidget'), { ssr: false });

interface Activity {
    time: string;
    description: string;
    location: string;
    ticket_price?: string;
    imageUrl?: string;
}

const FALLBACK_IMAGES = [
    'https://images.pexels.com/photos/1308940/pexels-photo-1308940.jpeg?auto=compress&cs=tinysrgb&w=800', // Paris
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80', // Bali
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80', // Tokyo
    'https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg?auto=compress&cs=tinysrgb&w=800', // Santorini
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80', // Dubai
    'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80', // New York
    'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=800&q=80'  // Rome
];

interface Day {
    day: number;
    title: string;
    activities: Activity[];
}

interface Itinerary {
    destination: string;
    summary: string;
    trip_details: {
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
    };
    days: Day[];
}

interface ItineraryDisplayProps {
    itinerary: Itinerary;
    className?: string;
    selectedActivity?: string | null;
    onActivitySelect?: (activityId: string | null) => void;
}

export default function ItineraryDisplay({ itinerary, className, selectedActivity: propSelectedActivity, onActivitySelect }: ItineraryDisplayProps) {
    const [internalSelectedActivity, setInternalSelectedActivity] = useState<string | null>(null);

    const selectedActivity = propSelectedActivity !== undefined ? propSelectedActivity : internalSelectedActivity;
    const setSelectedActivity = (id: string | null) => {
        if (onActivitySelect) {
            onActivitySelect(id);
        } else {
            setInternalSelectedActivity(id);
        }
    };

    if (!itinerary) return null;

    return (
        <div className={cn("space-y-8", className)}>
            {/* Summary Section */}
            <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-4">
                    Trip Overview
                </h3>
                <p className="text-slate-300 leading-relaxed italic border-l-4 border-blue-500 pl-4 text-lg">
                    {itinerary.summary}
                </p>
            </div>


            {/* Trip Vital Signs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 hover:border-emerald-500/30 transition-colors group">
                    <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1 group-hover:text-emerald-400 transition-colors">Budget</div>
                    <div className="text-lg font-bold text-emerald-400">{formatCurrency(itinerary.trip_details.estimated_budget, itinerary.trip_details.currency)}</div>
                </div>
                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 hover:border-blue-500/30 transition-colors group">
                    <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1 group-hover:text-blue-400 transition-colors">Best Season</div>
                    <div className="text-lg font-bold text-slate-200">{itinerary.trip_details.best_time_to_visit}</div>
                </div>
                <div className="sm:col-span-2 bg-slate-800/60 p-2 rounded-xl border border-slate-700 min-h-[80px] flex items-center justify-center">
                    <WeatherWidget
                        lat={itinerary.trip_details.destination_coordinates.lat}
                        lng={itinerary.trip_details.destination_coordinates.lng}
                    />
                </div>
            </div>

            {/* Logistics */}
            {itinerary.trip_details.travel_logistics && (
                <div className="bg-slate-900/40 rounded-xl p-6 border border-slate-800">
                    <h4 className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-6 flex items-center gap-2">
                        <Bus className="w-4 h-4" />
                        Travel Logistics
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <LogisticsItem icon={<Bus className="w-5 h-5 text-orange-400" />} label="Bus" value={itinerary.trip_details.travel_logistics.bus} color="orange" />
                        <LogisticsItem icon={<Train className="w-5 h-5 text-blue-400" />} label="Train" value={itinerary.trip_details.travel_logistics.train} color="blue" />
                        <LogisticsItem icon={<Plane className="w-5 h-5 text-purple-400" />} label="Flight" value={itinerary.trip_details.travel_logistics.flight} color="purple" />
                        <LogisticsItem icon={<Car className="w-5 h-5 text-green-400" />} label="Car" value={itinerary.trip_details.travel_logistics.car} color="green" />
                    </div>
                </div>
            )}

            {/* Accommodations */}
            <div className="space-y-4">
                <h4 className="text-xs text-slate-500 uppercase tracking-widest font-bold flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Recommended Stays
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {itinerary.trip_details.hotel_suggestions.map((hotel, hIdx) => (
                        <div key={hIdx} className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 flex flex-col justify-between hover:border-blue-500/30 transition-all group">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className={cn(
                                        "text-[10px] px-2 py-0.5 rounded uppercase font-black",
                                        hotel.tier === 'Luxury' ? "bg-amber-500/20 text-amber-500" :
                                            hotel.tier === 'Mid' ? "bg-blue-500/20 text-blue-500" :
                                                "bg-slate-700 text-slate-400"
                                    )}>
                                        {hotel.tier}
                                    </span>
                                    <span className="text-xs font-bold text-emerald-400">{formatCurrency(hotel.price_range, itinerary.trip_details.currency)}</span>
                                </div>
                                <h5 className="text-base font-bold text-slate-200 sm:line-clamp-1 group-hover:line-clamp-none transition-colors uppercase tracking-tight">{hotel.name}</h5>
                            </div>
                            <a
                                href={`https://www.agoda.com/partners/partnersearch.aspx?cid=1959241&apikey=83110ffd-89b7-4c2e-a4e9-d4a8f52de4ec&searchText=${encodeURIComponent(hotel.name + ' ' + itinerary.destination)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 text-xs text-blue-400 font-bold flex items-center gap-1 hover:underline group-hover:translate-x-1 transition-transform"
                            >
                                Book Now
                                <ArrowLeft className="w-4 h-4 rotate-180" />
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            {/* Daily Timeline */}
            <div className="space-y-8">
                {/* Day Navigation Tabs */}
                {itinerary.days.length > 1 && (
                    <div className="sticky top-20 z-30 flex items-center gap-2 overflow-x-auto py-2.5 px-3 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg no-scrollbar">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2 shrink-0">Jump To:</span>
                        {itinerary.days.map((day) => (
                            <button
                                key={day.day}
                                type="button"
                                onClick={() => {
                                    const el = document.getElementById(`day-${day.day}`);
                                    if (el) {
                                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }
                                }}
                                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800/80 hover:bg-blue-600/20 hover:text-blue-300 text-slate-200 border border-slate-700/60 hover:border-blue-500/40 transition-all shrink-0 cursor-pointer"
                            >
                                Day {day.day}
                            </button>
                        ))}
                    </div>
                )}

                {itinerary.days.map((day, dIdx) => (
                    <div 
                        key={dIdx} 
                        id={`day-${day.day}`} 
                        className="bg-slate-900/60 rounded-3xl border border-slate-800/80 overflow-hidden shadow-2xl transition-all scroll-mt-32"
                    >
                        <div className="bg-slate-800/80 px-6 py-4 border-b border-slate-700/70 flex items-center justify-between">
                            <h4 className="text-lg font-black flex items-center gap-3 text-white">
                                <span className="flex items-center justify-center px-3 py-1 rounded-xl bg-blue-600 text-white font-bold text-xs whitespace-nowrap shadow-md shadow-blue-600/30">
                                    Day {day.day}
                                </span>
                                <span className="truncate">{day.title}</span>
                            </h4>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
                                {(day.activities || []).length} Activities
                            </span>
                        </div>
                        <div className="p-6 space-y-6">
                            {(day.activities || []).map((activity, aIdx) => (
                                <div
                                    key={aIdx}
                                    className={cn(
                                        "p-5 rounded-2xl border transition-all duration-300 cursor-pointer group hover:scale-[1.01]",
                                        selectedActivity === `${day.day}-${aIdx}`
                                            ? "bg-blue-600/15 border-blue-500/60 ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/10"
                                            : "bg-slate-800/40 hover:bg-slate-800/70 border-slate-800 hover:border-slate-700"
                                    )}
                                    onClick={() => setSelectedActivity(`${day.day}-${aIdx}`)}
                                >
                                    <div className="flex items-start justify-between mb-3 gap-2">
                                        <div className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-1.5 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
                                            <Clock className="w-3.5 h-3.5" />
                                            {activity.time}
                                        </div>
                                        {activity.ticket_price && (
                                            <span className="text-xs font-bold text-emerald-300 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/30 shadow-sm">
                                                {formatCurrency(activity.ticket_price, itinerary.trip_details.currency)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2.5 mb-3 group-hover:text-blue-300 transition-colors">
                                        <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                                        <span>{activity.location}</span>
                                    </div>
                                    {activity.imageUrl && (
                                        <div className="mt-4 mb-4 rounded-2xl overflow-hidden h-52 w-full relative border border-white/10 shadow-lg">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={activity.imageUrl}
                                                alt={activity.location}
                                                className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    const randomFallback = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
                                                    if (target.src !== randomFallback) {
                                                        target.src = randomFallback;
                                                    }
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                                        </div>
                                    )}
                                    <div className="text-slate-300 text-sm sm:text-base leading-relaxed sm:line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                                        {activity.description}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function LogisticsItem({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) {
    return (
        <div className="flex items-center gap-4 group">
            <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                color === 'orange' ? "bg-orange-500/10 group-hover:bg-orange-500/20" :
                    color === 'blue' ? "bg-blue-500/10 group-hover:bg-blue-500/20" :
                        color === 'purple' ? "bg-purple-500/10 group-hover:bg-purple-500/20" :
                            "bg-green-500/10 group-hover:bg-green-500/20"
            )}>
                {icon}
            </div>
            <div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{label}</div>
                <div className="text-sm text-slate-200 font-bold">{value}</div>
            </div>
        </div>
    );
}
