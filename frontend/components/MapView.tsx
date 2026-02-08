'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Next.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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
    days: Day[];
}

interface MapViewProps {
    itinerary: Itinerary;
    selectedActivity: string | null;
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

export default function MapView({ itinerary, selectedActivity }: MapViewProps) {
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
    // We depend on 'center' so markers move when center updates (to the correct city)
    const locations = useMemo(() => {
        return itinerary.days.flatMap((day, dayIdx) =>
            day.activities.map((activity, actIdx) => ({
                id: `${day.day}-${actIdx}`,
                position: getCoordinates(activity.location, dayIdx, actIdx, center),
                location: activity.location,
                time: activity.time,
                description: activity.description,
                imageUrl: activity.imageUrl,
                ticket_price: activity.ticket_price,
                day: day.day,
            }))
        );
    }, [itinerary, center]); // Recalculate when center updates (Fetched from API)

    // Create waypoints for routing
    const waypoints = useMemo(() => locations.map(loc => L.latLng(loc.position[0], loc.position[1])), [locations]);




    // Actually user said "Dark Blue". "Black" is close but not blue.
    // Let's use a divIcon with an SVG for precise color control.
    const darkBlueIcon = L.divIcon({
        className: 'bg-transparent',
        html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1e3a8a" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 drop-shadow-lg"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });

    return (
        <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
        >
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
                    icon={darkBlueIcon}
                    ref={(el) => {
                        if (el) markerRefs.current[loc.id] = el;
                    }}
                >
                    <Tooltip
                        direction="bottom"
                        offset={[0, 10]}
                        opacity={1}
                        permanent
                        className="font-bold text-xs bg-white/90 border-blue-900/20 text-blue-900 px-2 py-1 rounded shadow-lg"
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
                                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-wide">Day {loc.day}</span>
                                    {loc.ticket_price && (
                                        <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200 max-w-[50%] truncate" title={loc.ticket_price}>
                                            {loc.ticket_price}
                                        </span>
                                    )}
                                </div>
                                <div className="mb-2">
                                    <h3 className="font-bold text-gray-900 text-sm leading-tight mb-0.5">{loc.location}</h3>
                                    <p className="text-xs font-medium text-gray-500">{loc.time}</p>
                                </div>
                                <p className="text-xs text-gray-600 leading-relaxed">{loc.description}</p>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
