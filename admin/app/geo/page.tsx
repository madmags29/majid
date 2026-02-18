"use client";

import { useState, useEffect } from 'react';
import { Map, Globe, Navigation, Users, Search } from 'lucide-react';
import api from '@/lib/api';
import StatsCard from '@/components/StatsCard';

export default function GeoPage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/geo/stats');
                setData(res.data.data.filter((item: any) => item._id)); // Remove empty locations
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Geo Analytics</h1>
                <p className="text-zinc-400">Discover where your users are searching from globally.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatsCard title="Top Region" value={data[0]?._id || 'N/A'} icon={Map} color="blue" />
                <StatsCard title="Total Cities" value={data.length} icon={Navigation} color="emerald" />
                <StatsCard title="Global Reach" value="24 Countries" icon={Globe} color="amber" />
                <StatsCard title="Active Hotspots" value="12" icon={Users} color="rose" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 p-8 rounded-3xl relative overflow-hidden min-h-[400px]">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-bold">User Distribution Heatmap</h3>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-zinc-800 rounded-full text-[10px] text-zinc-400">Real-time</span>
                            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-[10px]">High Density</span>
                        </div>
                    </div>

                    {/* Simulated Map Background */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <svg className="w-full h-full" viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M150 100 Q 200 50 250 100 T 350 150 T 450 100 T 550 50 T 650 100" stroke="white" strokeWidth="1" />
                            <circle cx="200" cy="150" r="40" fill="white" />
                            <circle cx="500" cy="250" r="30" fill="white" />
                            <circle cx="600" cy="100" r="20" fill="white" />
                        </svg>
                    </div>

                    <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                        {data.slice(0, 8).map((region, i) => (
                            <div key={i} className="bg-zinc-950/50 backdrop-blur-md p-4 rounded-2xl border border-zinc-800/50">
                                <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{region._id}</div>
                                <div className="text-2xl font-bold text-white mt-1">{region.count}</div>
                                <div className="h-1 bg-zinc-800 rounded-full mt-3 overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full"
                                        style={{ width: `${(region.count / (data[0]?.count || 1)) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl">
                    <h3 className="font-bold mb-6">Top Performing Cities</h3>
                    <div className="space-y-4">
                        {loading ? (
                            Array(5).fill(0).map((_, i) => <div key={i} className="h-12 bg-zinc-800/20 animate-pulse rounded-xl" />)
                        ) : data.slice(0, 10).map((region, i) => (
                            <div key={i} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <span className="text-zinc-600 text-xs font-bold w-4">{i + 1}</span>
                                    <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors capitalize">{region._id}</span>
                                </div>
                                <span className="text-sm font-bold text-zinc-500 group-hover:text-blue-400 transition-colors">{region.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
