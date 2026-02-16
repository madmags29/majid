'use client';

import React, { useEffect, useState } from 'react';
import { Map as MapIcon, Calendar, User, Search, MapPin } from 'lucide-react';

interface Trip {
    _id: string;
    destination: string;
    startDate: string;
    endDate: string;
    createdAt: string;
    userId: {
        _id: string;
        name: string;
        email: string;
    };
}

export default function AdminTripsPage() {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/trips/all`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (Array.isArray(data)) {
                    setTrips(data);
                }
            } catch (error) {
                console.error('Failed to fetch trips:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">All User Trips</h1>
                <p className="text-slate-400 mt-2">Browse and manage all travel itineraries created by users.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-900/50">
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Destination</th>
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">User</th>
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Dates</th>
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Created</th>
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {trips.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500 text-sm">
                                        No trips found in the system.
                                    </td>
                                </tr>
                            ) : (
                                trips.map((trip) => (
                                    <tr key={trip._id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                    <MapPin className="w-5 h-5" />
                                                </div>
                                                <div className="text-sm font-medium text-white">{trip.destination}</div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                                                    <User className="w-3 h-3" />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-medium text-slate-300">{trip.userId?.name || 'Unknown'}</div>
                                                    <div className="text-[10px] text-slate-500">{trip.userId?.email || ''}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1 text-xs text-slate-400">
                                                <Calendar className="w-3 h-3" />
                                                {trip.startDate ? new Date(trip.startDate).toLocaleDateString() : 'N/A'} - {trip.endDate ? new Date(trip.endDate).toLocaleDateString() : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="p-4 text-xs text-slate-400">
                                            {new Date(trip.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                                                View Trip
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
