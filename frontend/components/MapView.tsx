'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Next.js
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

import { cn, formatCurrency } from '@/lib/utils';
import AdBanner from '@/components/AdBanner';

interface Activity {
    time: string;
    description: string;
    location: string;
    imageUrl?: string;
    ticket_price?: string;
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
        destination_coordinates: {
            lat: number;
            lng: number;
        };
    };
    days: Day[];
}

interface MapViewProps {
    itinerary: Itinerary;
    selectedActivity: string | null;
    isExpanded?: boolean;
}

function InvalidateSizeController({ isExpanded }: { isExpanded: boolean }) {
    const map = useMap();
    useEffect(() => {
        setTimeout(() => {
            map.invalidateSize();
        }, 100); // Small delay to ensure container transition finished
    }, [isExpanded, map]);
    return null;
}

// Component to handle map interactions based on selection
function MapController({ selectedActivity, markerRefs }: { selectedActivity: string | null, markerRefs: React.MutableRefObject<{ [key: string]: L.Marker | null }> }) {
    const map = useMap();

    useEffect(() => {
        if (selectedActivity && markerRefs.current[selectedActivity]) {
            const marker = markerRefs.current[selectedActivity];
            if (marker) {
                marker.openPopup();
                map.setView(marker.getLatLng(), 14, { animate: true });
            }
        }
    }, [selectedActivity, map, markerRefs]);

    return null;
}

// Component to update map view
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

// Dynamically import RoutingMachine to avoid SSR issues
import dynamic from 'next/dynamic';
const RoutingMachine = dynamic(() => import('./RoutingMachine'), { ssr: false });

export default function MapView({ itinerary, selectedActivity, isExpanded }: MapViewProps) {
    const [center, setCenter] = useState<[number, number]>([48.8566, 2.3522]); // Default (Paris), will update
    const [zoom] = useState(13);
    const markerRefs = useRef<{ [key: string]: L.Marker | null }>({});

    // Fetch coordinates for the destination
    useEffect(() => {
        if (!itinerary.destination) return;

        const fetchCoordinates = async () => {
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(itinerary.destination)}&format=json&limit=1`);
                const data = await response.json();
                if (data && data.length > 0) {
                    const lat = parseFloat(data[0].lat);
                    const lon = parseFloat(data[0].lon);
                    setCenter([lat, lon]);
                }
            } catch (error) {
                console.error("Failed to geocode destination:", error);
            }
        };

        fetchCoordinates();
    }, [itinerary.destination]);

    // Mock geocoding - deterministic based on string hash to keep positions stable
    const getCoordinates = (location: string, dayIndex: number, activityIndex: number, currentCenter: [number, number]): [number, number] => {
        // specific hash 
        let hash = 0;
        for (let i = 0; i < location.length; i++) {
            hash = ((hash << 5) - hash) + location.charCodeAt(i);
            hash |= 0;
        }
        const pseudoRandom = Math.abs(hash) / 2147483647; // 0 to 1

        const baseOffset = 0.015; // increased spread
        // Use pseudoRandom to determine direction, but ensure they are somewhat clustered
        const latOffset = (pseudoRandom - 0.5) * baseOffset * (dayIndex + 1.5);
        const lngOffset = ((1 - pseudoRandom) - 0.5) * baseOffset * (activityIndex + 1.5);

        return [currentCenter[0] + latOffset, currentCenter[1] + lngOffset];
    };

    // Extract all locations with stable coordinates
    const locations = useMemo(() => {
        const activityLocations = (itinerary?.days || []).flatMap((day, dayIdx: number) =>
            (day.activities || []).map((activity, actIdx: number) => ({
                id: `${day.day}-${actIdx}`,
                position: getCoordinates(activity.location, dayIdx, actIdx, center),
                location: activity.location,
                time: activity.time,
                description: activity.description,
                imageUrl: activity.imageUrl || null,
                ticket_price: activity.ticket_price || null,
                day: day.day,
                type: 'activity' as const
            }))
        );

        const hotelLocations = (itinerary?.trip_details?.hotel_suggestions || []).map((hotel, idx: number) => ({
            id: `hotel-${idx}`,
            position: getCoordinates(hotel.name, 99, idx, center),
            location: hotel.name,
            time: 'Hotel',
            description: `Tier: ${hotel.tier}`,
            ticket_price: hotel.price_range,
            imageUrl: null,
            day: null,
            type: 'hotel' as const,
            url: `https://www.agoda.com/partners/partnersearch.aspx?cid=1959241&apikey=83110ffd-89b7-4c2e-a4e9-d4a8f52de4ec&searchText=${encodeURIComponent(hotel.name + ' ' + (itinerary?.destination || ''))}`
        }));

        return [...activityLocations, ...hotelLocations];
    }, [itinerary, center]);

    // Create waypoints for routing (only activities)
    const waypoints = useMemo(() => locations.filter(l => l.type === 'activity').map(loc => L.latLng(loc.position[0], loc.position[1])), [locations]);


    // Icons
    const activityIcon = L.divIcon({
        className: 'bg-transparent',
        html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1e3a8a" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 drop-shadow-lg"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });

    const hotelIcon = L.divIcon({
        className: 'bg-transparent',
        html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ef4444" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 drop-shadow-lg"><path d="M3 21h18M5 21V7l8-4 8 4v14M9 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4"></path></svg>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });

    return (
        <div className="relative h-full w-full group">
            <MapContainer
                center={center}
                zoom={zoom}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
                zoomControl={false} // We can add custom zoom control if needed, or keep default. Let's keep default but ensure UI is above.
            >
                <InvalidateSizeController isExpanded={!!isExpanded} />
                <MapController selectedActivity={selectedActivity} markerRefs={markerRefs} />
                <ChangeView center={center} zoom={zoom} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Render Route */}
                {waypoints.length > 1 && (
                    <RoutingMachine waypoints={waypoints} />
                )}

                {locations.map((loc) => (
                    <Marker
                        key={loc.id}
                        position={loc.position}
                        opacity={selectedActivity === loc.id ? 1 : 0.8}
                        icon={loc.type === 'hotel' ? hotelIcon : activityIcon}
                        ref={(el) => {
                            if (el) markerRefs.current[loc.id] = el;
                        }}
                        eventHandlers={{
                            click: (e) => {
                                e.target.openPopup();
                            },
                        }}
                    >
                        <Tooltip
                            direction="bottom"
                            offset={[0, 10]}
                            opacity={1}
                            permanent={loc.type === 'hotel' ? false : true} // Hide hotel names by default to avoid clutter? Or keep them.
                            className={cn(
                                "font-bold text-xs px-2 py-1 rounded shadow-lg",
                                loc.type === 'hotel' ? "bg-white/90 border-red-900/20 text-red-900" : "bg-white/90 border-blue-900/20 text-blue-900"
                            )}
                        >
                            {loc.location}
                        </Tooltip>
                        <Popup maxWidth={250} minWidth={200}>
                            <div className="p-0 overflow-hidden rounded-lg">
                                {loc.imageUrl && (
                                    <div className="h-32 w-full overflow-hidden">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={loc.imageUrl}
                                            alt={loc.location}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="p-3">
                                    <div className="flex justify-between items-center mb-2">
                                        {loc.day && <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-wide">Day {loc.day}</span>}
                                        {loc.type === 'hotel' && <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100 uppercase tracking-wide">Hotel</span>}

                                        {loc.ticket_price && (
                                            <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200 max-w-[50%] truncate" title={loc.ticket_price}>
                                                {formatCurrency(loc.ticket_price, itinerary.trip_details?.currency || 'INR')}
                                            </span>
                                        )}
                                    </div>
                                    <div className="mb-2">
                                        <h3 className="font-bold text-gray-900 text-sm leading-tight mb-0.5">{loc.location}</h3>
                                        <p className="text-xs font-medium text-gray-500">{loc.time}</p>
                                    </div>
                                    <p className="text-xs text-gray-600 leading-relaxed mb-3">{loc.description}</p>

                                    {loc.type === 'hotel' && loc.url && (
                                        <a
                                            href={loc.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block w-full text-center bg-blue-600 hover:bg-blue-700 !text-white text-xs font-bold py-2 rounded transition-colors mb-3"
                                        >
                                            Book Now
                                        </a>
                                    )}

                                    {/* Ad Banner Inside Map Pin Popup */}
                                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-center">
                                        <AdBanner dataAdSlot="6666777788" className="!my-0 scale-90 sm:scale-100 origin-center" />
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Hotel Thumbnails Carousel */}
            <div className="absolute bottom-8 left-0 right-0 z-[1000] px-4 pointer-events-none flex justify-center">
                <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory px-4 pointer-events-auto max-w-full no-scrollbar items-center">
                    {locations.filter(l => l.type === 'hotel').map((hotel) => {
                        const isSelected = selectedActivity === hotel.id;
                        return (
                            <div
                                key={hotel.id}
                                className={cn(
                                    "snap-center shrink-0 w-72 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-2xl border transition-all duration-300 cursor-pointer group relative overflow-hidden",
                                    isSelected ? "border-blue-500/50 ring-2 ring-blue-500/20 scale-105" : "border-white/40 hover:border-white/60 hover:scale-105"
                                )}
                                onClick={() => {
                                    const marker = markerRefs.current[hotel.id];
                                    if (marker) {
                                        marker.openPopup();
                                        const map = marker.getElement()?.parentElement?.parentElement;
                                        // Use direct leaflet map access from ref if possible, but marker.openPopup usually enough
                                        marker.openPopup();
                                    }
                                }}
                            >
                                {/* Decorative gradient background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 pointer-events-none" />

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-2 gap-2">
                                        <h3 className="font-bold text-slate-800 text-sm leading-tight truncate flex-1" title={hotel.location}>{hotel.location}</h3>
                                        <div className="text-[10px] font-bold text-white bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm shrink-0 uppercase tracking-wide">
                                            {formatCurrency(hotel.ticket_price || '0', itinerary.trip_details?.currency || 'INR')}
                                        </div>
                                    </div>

                                    <p className="text-xs text-slate-600 mb-4 line-clamp-2 h-8 leading-relaxed font-medium">
                                        {hotel.description}
                                    </p>

                                    <div className="flex gap-2.5">
                                        {hotel.url && (
                                            <a
                                                href={hotel.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold py-2 rounded-lg text-center transition-all shadow-md hover:shadow-blue-500/25 flex items-center justify-center gap-1.5"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <span>Book Now</span>
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </a>
                                        )}
                                        <button
                                            className="px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold py-2 rounded-lg transition-colors shadow-sm hover:shadow-md flex items-center justify-center"
                                            title="Locate on map"
                                        >
                                            <svg className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
