"use client";

import { useState, useEffect } from 'react';
import { Activity, Clock, MousePointer2, Globe, ArrowRight } from 'lucide-react';
import api from '@/lib/api';
import StatsCard from '@/components/StatsCard';
import { format } from 'date-fns';

export default function TrackingPage() {
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const res = await api.get('/tracking/activity');
                setActivities(res.data.data);
            } catch (err) {
                console.error("Failed to load activity", err);
            } finally {
                setLoading(false);
            }
        };
        fetchActivity();
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Live Activity Tracking</h1>
                <p className="text-zinc-400">Monitor real-time interactions and page movement.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard title="Real-time Events" value={activities.length} icon={Activity} subtext="Last 30 mins" />
                <StatsCard title="Avg. Time on Page" value="4m 2s" icon={Clock} subtext="Across all routes" />
                <StatsCard title="Click-thru Rate" value="12.4%" icon={MousePointer2} subtext="Search to View" />
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
                <div className="p-6 border-b border-zinc-800">
                    <h3 className="font-bold">Recent Activity Timeline</h3>
                </div>
                <div className="p-6">
                    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-zinc-800 before:via-zinc-800 before:to-transparent">
                        {loading ? (
                            Array(5).fill(0).map((_, i) => <div key={i} className="h-12 bg-zinc-800/20 animate-pulse rounded-xl" />)
                        ) : activities.map((activity, i) => (
                            <div key={i} className="relative flex items-center justify-between group">
                                <div className="flex items-center">
                                    <div className="absolute left-0 w-10 h-10 rounded-full bg-zinc-950 border-2 border-zinc-800 flex items-center justify-center z-10 group-hover:border-blue-500 transition-colors">
                                        <Globe size={16} className="text-zinc-500 group-hover:text-blue-400" />
                                    </div>
                                    <div className="pl-14">
                                        <div className="flex items-center gap-2">
                                            <span className="text-white font-medium text-sm">{activity.userId?.name || 'Anonymous'}</span>
                                            <span className="text-zinc-500 text-xs">•</span>
                                            <span className="text-zinc-500 text-xs">{format(new Date(activity.timestamp), 'HH:mm:ss')}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                                            <span>Visited</span>
                                            <span className="bg-zinc-800 px-2 py-0.5 rounded text-zinc-300">{activity.page}</span>
                                            {activity.referrer && (
                                                <>
                                                    <ArrowRight size={10} />
                                                    <span className="text-zinc-500 truncate max-w-[200px]">{activity.referrer}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right flex flex-col items-end">
                                    <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{activity.device}</span>
                                    <span className="text-xs text-zinc-500 mt-1">{activity.location || 'Unknown Location'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
