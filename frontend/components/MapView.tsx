'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Next.js
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

// Component to update map view
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

export default function MapView({ itinerary, selectedActivity }: MapViewProps) {
    const [center, setCenter] = useState<[number, number]>([48.8566, 2.3522]); // Default to Paris
    const [zoom, setZoom] = useState(12);

    // Mock geocoding - in production, use a real geocoding API
    const getCoordinates = (location: string, dayIndex: number, activityIndex: number): [number, number] => {
        // For demo purposes, generate coordinates around the center
        const baseOffset = 0.01;
        const lat = center[0] + (Math.random() - 0.5) * baseOffset * (dayIndex + 1);
        const lng = center[1] + (Math.random() - 0.5) * baseOffset * (activityIndex + 1);
        return [lat, lng];
    };

    // Extract all locations
    const locations = itinerary.days.flatMap((day, dayIdx) =>
        day.activities.map((activity, actIdx) => ({
            id: `${day.day}-${actIdx}`,
            position: getCoordinates(activity.location, dayIdx, actIdx),
            location: activity.location,
            time: activity.time,
            description: activity.description,
            day: day.day,
        }))
    );

    return (
        <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
        >
            <ChangeView center={center} zoom={zoom} />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {locations.map((loc) => (
                <Marker
                    key={loc.id}
                    position={loc.position}
                    opacity={selectedActivity === loc.id ? 1 : 0.7}
                >
                    <Popup>
                        <div className="p-2">
                            <p className="font-semibold text-blue-600 text-sm capitalize">Day {loc.day} - {loc.time}</p>
                            <p className="font-medium text-gray-800">{loc.location}</p>
                            <p className="text-sm text-gray-600 mt-1">{loc.description}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
