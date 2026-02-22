'use client';

import { useEffect, useState, useMemo } from 'react';
import { MapPin } from 'lucide-react';

interface Coords {
    lat: number;
    lng: number;
}

export default function DistanceDisplay({ destinationCoords }: { destinationCoords?: Coords }) {
    const [userLocation, setUserLocation] = useState<Coords | null>(null);
    // Use useMemo for distance to avoid setState in useEffect
    const distance = useMemo(() => {
        if (userLocation && destinationCoords) {
            return Math.round(calculateDistance(
                userLocation.lat,
                userLocation.lng,
                destinationCoords.lat,
                destinationCoords.lng
            ));
        }
        return null;
    }, [userLocation, destinationCoords]);

    // Haversine formula
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d;
    };

    const deg2rad = (deg: number) => {
        return deg * (Math.PI / 180);
    };

    if (!distance) return null;

    return (
        <div className="bg-slate-800/30 border border-blue-500/20 rounded-xl p-4 flex justify-between items-center">
            <span className="text-sm text-slate-400 font-medium">Distance from you</span>
            <span className="text-blue-400 font-bold text-lg">~{distance} km</span>
        </div>
    );
}
