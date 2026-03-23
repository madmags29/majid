'use client';

import { useState, useEffect } from 'react';
import ItineraryDisplay from './ItineraryDisplay';
import CinematicLoader from './CinematicLoader';
import { API_URL } from '@/lib/config';

export default function DirectItineraryDisplay({ destinationName }: { destinationName: string }) {
    const [itinerary, setItinerary] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchItinerary = async () => {
            const cacheKey = `itinerary_${destinationName}_explore`;
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                try {
                    setItinerary(JSON.parse(cached));
                    setLoading(false);
                    return;
                } catch (e) {
                    console.error("Cache parsing error", e);
                }
            }

            try {
                const response = await fetch(`${API_URL}/api/search`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        destination: destinationName,
                        days: 2,
                    }),
                });

                if (!response.ok) throw new Error('Failed to fetch');
                const data = await response.json();
                
                if (isMounted) {
                    setItinerary(data);
                    localStorage.setItem(cacheKey, JSON.stringify(data));
                    setLoading(false);
                }
            } catch (err) {
                console.error(err);
                if (isMounted) {
                    setError(true);
                    setLoading(false);
                }
            }
        };

        fetchItinerary();

        return () => {
            isMounted = false;
        };
    }, [destinationName]);

    if (loading) {
        return (
            <div className="relative h-96 w-full flex items-center justify-center rounded-3xl overflow-hidden bg-slate-900/50 border border-slate-800 mt-12">
                <CinematicLoader messages={["Generating your custom itinerary...", "Scouting top locations...", "Finalizing your trip..."]} />
            </div>
        );
    }

    if (error || !itinerary) {
        return (
            <div className="text-center p-8 bg-red-500/10 border border-red-500/20 rounded-2xl mt-12">
                <p className="text-red-400">Failed to load the itinerary. Please refresh the page to try again.</p>
            </div>
        );
    }

    return (
        <div className="mt-12 bg-slate-900/40 rounded-3xl p-6 md:p-10 border border-slate-800 shadow-2xl text-left">
            <h2 className="text-3xl font-black text-white mb-10 text-center tracking-tight">Your 2-Day AI Itinerary</h2>
            <ItineraryDisplay itinerary={itinerary} />
        </div>
    );
}
