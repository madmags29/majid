'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { MapPin, Calendar, Loader2 } from 'lucide-react';

// Dynamically import map to avoid SSR issues
const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

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

export default function SearchPage() {
    const searchParams = useSearchParams();
    const destination = searchParams.get('destination') || '';

    const [itinerary, setItinerary] = useState<Itinerary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

    useEffect(() => {
        if (destination) {
            fetchItinerary(destination);
        }
    }, [destination]);

    const fetchItinerary = async (dest: string) => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5001/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    destination: dest,
                    days: 2,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch itinerary');
            }

            const data = await response.json();
            setItinerary(data);
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex flex-col bg-slate-900">
            {/* Header */}
            <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">
                        {destination ? `Trip to ${destination}` : 'Search Results'}
                    </h1>
                    <a href="/" className="text-blue-400 hover:text-blue-300">
                        ← Back to Home
                    </a>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel - Chat */}
                <div className="w-1/2 border-r border-slate-700 flex flex-col bg-slate-800">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {loading && (
                            <div className="flex items-center justify-center h-full">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-red-300">
                                {error}
                            </div>
                        )}

                        {itinerary && !loading && (
                            <div className="space-y-6">
                                {/* AI Message */}
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                                        <span className="text-white text-sm font-bold">AI</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="bg-slate-700 rounded-2xl rounded-tl-none p-4">
                                            <p className="text-slate-200 mb-2">
                                                I've created a {itinerary.days.length}-day itinerary for your trip to <span className="font-semibold text-blue-300">{itinerary.destination}</span>!
                                            </p>
                                            <p className="text-slate-300 text-sm">{itinerary.summary}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Itinerary Days */}
                                {itinerary.days.map((day) => (
                                    <div key={day.day} className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                                            <span className="text-white text-sm font-bold">AI</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="bg-slate-700 rounded-2xl rounded-tl-none p-4">
                                                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                                    <Calendar className="w-5 h-5 text-blue-400" />
                                                    Day {day.day}: {day.title}
                                                </h3>
                                                <div className="space-y-3">
                                                    {day.activities.map((activity, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedActivity === `${day.day}-${idx}`
                                                                    ? 'bg-blue-600/20 border border-blue-500/50'
                                                                    : 'bg-slate-600/50 hover:bg-slate-600'
                                                                }`}
                                                            onClick={() => setSelectedActivity(`${day.day}-${idx}`)}
                                                        >
                                                            <div className="flex items-start gap-2">
                                                                <MapPin className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                                                                <div className="flex-1">
                                                                    <p className="text-sm font-medium text-blue-300 capitalize">{activity.time}</p>
                                                                    <p className="text-white font-medium">{activity.location}</p>
                                                                    <p className="text-slate-300 text-sm mt-1">{activity.description}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel - Map */}
                <div className="w-1/2 bg-slate-900">
                    {itinerary && !loading ? (
                        <MapView itinerary={itinerary} selectedActivity={selectedActivity} />
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-400">
                            {loading ? 'Loading map...' : 'Map will appear here'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
