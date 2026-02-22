'use client';

import { useState } from 'react';
import { MapPin, Calendar, Clock, Bus, Train, Plane, Car, Heart, ArrowLeft } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import dynamic from 'next/dynamic';

const WeatherWidget = dynamic(() => import('@/components/WeatherWidget'), { ssr: false });
const AdBanner = dynamic(() => import('@/components/AdBanner'), { ssr: false });

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
}

export default function ItineraryDisplay({ itinerary, className }: ItineraryDisplayProps) {
    const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

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
                                <h5 className="text-base font-bold text-slate-200 line-clamp-1 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{hotel.name}</h5>
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
                {itinerary.days.map((day, dIdx) => (
                    <div key={dIdx} className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                        <div className="bg-slate-800/80 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
                            <h4 className="text-lg font-black flex items-center gap-4">
                                <span className="flex items-center justify-center px-3 py-1 rounded-lg bg-blue-600/20 text-blue-400 text-sm whitespace-nowrap border border-blue-500/20">
                                    Day {day.day}
                                </span>
                                {day.title}
                            </h4>
                        </div>
                        <div className="p-6 space-y-6">
                            {(day.activities || []).map((activity, aIdx) => (
                                <div
                                    key={aIdx}
                                    className={cn(
                                        "p-5 rounded-xl border border-slate-800 transition-all duration-300 cursor-pointer group hover:scale-[1.01]",
                                        selectedActivity === `${day.day}-${aIdx}`
                                            ? "bg-blue-600/10 border-blue-500/50 ring-1 ring-blue-500/20"
                                            : "bg-slate-800/30 hover:bg-slate-800/50 hover:border-slate-700"
                                    )}
                                    onClick={() => setSelectedActivity(`${day.day}-${aIdx}`)}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="text-sm font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            {activity.time}
                                        </div>
                                        {activity.ticket_price && (
                                            <span className="text-xs font-bold text-green-400 bg-green-900/20 px-3 py-1 rounded-full border border-green-500/30 shadow-lg shadow-green-900/20">
                                                {formatCurrency(activity.ticket_price, itinerary.trip_details.currency)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-xl font-bold text-slate-100 flex items-center gap-3 mb-3">
                                        <MapPin className="w-5 h-5 text-blue-500 shrink-0" />
                                        <span>{activity.location}</span>
                                    </div>
                                    {activity.imageUrl && (
                                        <div className="mt-4 mb-4 rounded-xl overflow-hidden h-48 w-full relative border border-white/5">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={activity.imageUrl}
                                                alt={activity.location}
                                                className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    )}
                                    <div className="text-slate-400 text-base leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                                        {activity.description}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Ad Banner after itineraries */}
                <AdBanner dataAdSlot="5821234567" className="mt-8" />
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
