'use client';

import React, { useEffect, useState } from 'react';
import {
    Users, Activity, Globe, MousePointer,
    FileText, ArrowUpRight, Monitor, Clock
} from 'lucide-react';

interface DashboardData {
    realtimeUsers: number;
    activity30Min: number;
    avgEngagementTime: number;
    trafficSources: { _id: string, count: number }[];
    formsSubmitted: number;
    totalUsers: number;
    recentActivity: any[];
    countryStats: { _id: string, count: number }[];
}

export default function AdminTrackingPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/analytics/dashboard`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const json = await res.json();
            setData(json);
        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-zinc-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 lg:p-10 font-[family-name:var(--font-geist-sans)] dark:bg-zinc-950 dark:text-gray-100">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Admin Dashboard</h1>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Realtime Users"
                    value={data?.realtimeUsers || 0}
                    icon={<Users className="w-5 h-5 text-green-500" />}
                    subtext="Active in last 5 mins"
                />
                <StatCard
                    title="30 Min Activity"
                    value={data?.activity30Min || 0}
                    icon={<Activity className="w-5 h-5 text-blue-500" />}
                    subtext="Pageviews"
                />
                <StatCard
                    title="Avg Engagement"
                    value={`${data?.avgEngagementTime || 0}s`}
                    icon={<Clock className="w-5 h-5 text-orange-500" />}
                    subtext="Per session (24h)"
                />
                <StatCard
                    title="Forms Submitted"
                    value={data?.formsSubmitted || 0}
                    icon={<FileText className="w-5 h-5 text-purple-500" />}
                    subtext="Last 24 hours"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Traffic Sources */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <ArrowUpRight className="w-5 h-5 text-gray-400" />
                        Traffic Sources (24h)
                    </h2>
                    <div className="space-y-4">
                        {data?.trafficSources.length === 0 ? (
                            <p className="text-gray-500 text-sm">No data yet</p>
                        ) : (
                            data?.trafficSources.map((source, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${source._id === 'Direct' ? 'bg-blue-500' :
                                            source._id === 'Organic Search' ? 'bg-green-500' :
                                                source._id === 'Referral' ? 'bg-yellow-500' : 'bg-gray-400'
                                            }`} />
                                        <span className="font-medium text-sm text-gray-700 dark:text-gray-300">{source._id}</span>
                                    </div>
                                    <span className="font-semibold text-gray-900 dark:text-gray-200">{source.count}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Country Stats */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-gray-400" />
                        Top Countries (24h)
                    </h2>
                    <div className="space-y-4">
                        {data?.countryStats.length === 0 ? (
                            <p className="text-gray-500 text-sm">No data yet</p>
                        ) : (
                            data?.countryStats.map((country, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded transition-colors">
                                    <span className="font-medium text-sm text-gray-700 dark:text-gray-300">{country._id}</span>
                                    <span className="font-semibold text-gray-900 dark:text-gray-200">{country.count}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Registered Users Summary */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6 flex flex-col justify-center items-center text-center">
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-full mb-4">
                        <Users className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{data?.totalUsers}</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Registered Users</p>
                </div>
            </div>

            {/* Recent Activity Table */}
            <div className="mt-8 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-zinc-800">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Monitor className="w-5 h-5 text-gray-400" />
                        Live Feed (Last 10 Events)
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <th className="p-4">Time</th>
                                <th className="p-4">Action</th>
                                <th className="p-4">Path</th>
                                <th className="p-4">Source</th>
                                <th className="p-4">Location</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                            {data?.recentActivity.map((event, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                                    <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                                        {new Date(event.timestamp).toLocaleTimeString()}
                                    </td>
                                    <td className="p-4 text-sm font-medium text-gray-900 dark:text-gray-200">
                                        <span className={`px-2 py-1 rounded-full text-xs ${event.action === 'pageview' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' :
                                            event.action === 'form_submit' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300' :
                                                'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                                            }`}>
                                            {event.action}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600 dark:text-gray-400 font-mono truncate max-w-[200px]" title={event.path}>
                                        {event.path}
                                    </td>
                                    <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                                        {event.source}
                                    </td>
                                    <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                                        {event.country !== 'Unknown' ? event.country : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, subtext }: { title: string, value: string | number, icon: React.ReactNode, subtext: string }) {
    return (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</div>
                </div>
                <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                    {icon}
                </div>
            </div>
            <p className="text-xs text-gray-400">{subtext}</p>
        </div>
    );
}
