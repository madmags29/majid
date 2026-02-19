'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    Eye,
    Zap,
    History,
    UserCircle,
    Smartphone,
    Globe,
    Monitor,
    Loader2
} from 'lucide-react';
import api from '../../../lib/api';
import { format } from 'date-fns';

interface Activity {
    type: string;
    timestamp: string;
    userId?: {
        name: string;
    };
    details?: Record<string, unknown>;
    page?: string;
}

interface Session {
    _id: string;
    userId?: {
        name: string;
    };
    startTime: string;
    duration?: number;
    device?: string;
    location?: string;
}

export default function UserActivityTrackingPage() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [activitiesRes, sessionsRes] = await Promise.all([
                    api.get('/tracking/activities'),
                    api.get('/tracking/sessions')
                ]);
                setActivities(activitiesRes.data);
                setSessions(sessionsRes.data);
            } catch (error) {
                console.error('Failed to fetch tracking data', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
        // Poll every 30 seconds for live updates
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'trip_search': return Search;
            case 'page_view': return Eye;
            case 'trip_save': return Zap;
            case 'contact_submit': return Globe;
            default: return userCircle;
        }
    };

    const getActivityColor = (type: string) => {
        switch (type) {
            case 'trip_search': return 'text-blue-500';
            case 'page_view': return 'text-purple-500';
            case 'trip_save': return 'text-amber-500';
            case 'contact_submit': return 'text-emerald-500';
            default: return 'text-slate-500';
        }
    };

    // Helper to format duration (ms or sec)
    const formatDuration = (seconds?: number) => {
        if (!seconds) return 'Active';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}m ${s}s`;
    };

    const userCircle = UserCircle;

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="border-b border-slate-200 dark:border-zinc-800 pb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">User Activity Tracking</h1>
                    <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium">Real-time timeline of user actions and full session logs</p>
                </div>
                <div className="flex items-center gap-2 text-blue-600 bg-blue-50 dark:bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-500/20 animate-pulse">
                    <History className="w-4 h-4" />
                    <span className="text-xs font-black uppercase">Live Updates On</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Live Activity Timeline */}
                <div className="lg:col-span-1 space-y-6">
                    <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500" /> Recent Actions
                    </h3>
                    <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-zinc-800 before:to-transparent">
                        {activities.length === 0 ? (
                            <p className="text-sm text-slate-400 italic pl-10">No recent activity recorded.</p>
                        ) : activities.map((item, index) => {
                            const Icon = getActivityIcon(item.type);
                            const colorClass = getActivityColor(item.type);
                            return (
                                <div key={index} className="relative flex items-center group">
                                    {/* Icon */}
                                    <div className="absolute left-0 w-10 h-10 rounded-full border border-white dark:border-zinc-950 bg-slate-50 dark:bg-zinc-900 shadow flex items-center justify-center z-10">
                                        <Icon className={`w-5 h-5 ${colorClass}`} />
                                    </div>
                                    {/* Content */}
                                    <div className="ml-14 w-full bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="font-bold text-slate-800 dark:text-white text-xs uppercase tracking-wider">{item.type.replace('_', ' ')}</div>
                                            <time className="text-[10px] text-slate-400">{format(new Date(item.timestamp), 'HH:mm')}</time>
                                        </div>
                                        <div className="text-xs text-slate-500 dark:text-zinc-400 mb-2 truncate">
                                            {item.userId?.name || 'Guest User'}
                                        </div>
                                        {item.details && (
                                            <div className="text-xs bg-slate-50 dark:bg-zinc-800/50 p-2 rounded border border-slate-100 dark:border-zinc-800 truncate">
                                                {JSON.stringify(item.details).slice(0, 50)}
                                            </div>
                                        )}
                                        {item.page && (
                                            <div className="text-xs text-blue-500 mt-1 truncate">{item.page}</div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Column: Full Session Logs */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-blue-500" /> User Sessions Log
                    </h3>

                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 dark:bg-zinc-800/50 text-xs uppercase font-bold text-slate-500 dark:text-zinc-400">
                                    <tr>
                                        <th className="px-4 py-3">User</th>
                                        <th className="px-4 py-3">Started</th>
                                        <th className="px-4 py-3">Duration</th>
                                        <th className="px-4 py-3">Device</th>
                                        <th className="px-4 py-3">Location</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                                    {sessions.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-8 text-center text-slate-400 italic">No sessions recorded yet.</td>
                                        </tr>
                                    ) : sessions.map((session) => (
                                        <tr key={session._id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold">
                                                        {(session.userId?.name?.[0] || 'G').toUpperCase()}
                                                    </div>
                                                    <span className="font-medium text-slate-700 dark:text-slate-200">
                                                        {session.userId?.name || 'Guest'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-slate-500 dark:text-zinc-400 whitespace-nowrap">
                                                {format(new Date(session.startTime), 'MMM d, HH:mm')}
                                            </td>
                                            <td className="px-4 py-3 font-mono text-xs text-slate-600 dark:text-zinc-300">
                                                {formatDuration(session.duration)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                                                    {session.device?.includes('Mobile') ? <Smartphone className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}
                                                    {session.device || 'Unknown'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-slate-500 text-xs truncate max-w-[150px]">
                                                {session.location || 'Unknown'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
