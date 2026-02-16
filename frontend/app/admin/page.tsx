'use client';

import React, { useEffect, useState } from 'react';
import { Users, DollarSign, TrendingUp, Activity, Map as MapIcon } from 'lucide-react';

interface DashboardStats {
    realtimeUsers: number;
    totalUsers: number;
    activity30Min: number;
    avgEngagementTime: number;
    recentActivity: any[];
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/analytics/dashboard`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
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
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
                    <p className="text-slate-400 mt-2">Welcome back, Admin. Here's what's happening today.</p>
                </div>
                <div className="flex gap-4">
                    <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Download Report
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Refresh Data
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: 'Realtime Users', value: stats?.realtimeUsers || 0, subtext: 'Active in 5m', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { title: 'Total Registered', value: stats?.totalUsers || 0, subtext: 'Total members', icon: Users, color: 'text-green-400', bg: 'bg-green-500/10' },
                    { title: '30m Activity', value: stats?.activity30Min || 0, subtext: 'Pageviews', icon: Activity, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                    { title: 'Avg Engagement', value: `${stats?.avgEngagementTime || 0}s`, subtext: 'Per session', icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-500/10' },
                ].map((stat, index) => (
                    <div key={index} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-lg ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </div>
                        <h3 className="text-slate-400 text-sm font-medium">{stat.title}</h3>
                        <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                        <p className="text-xs text-slate-500 mt-2">{stat.subtext}</p>
                    </div>
                ))}
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 h-96">
                    <h3 className="text-lg font-bold text-white mb-6">Activity Trend (Mock)</h3>
                    <div className="w-full h-64 flex items-end justify-between gap-2 pb-10">
                        {[40, 65, 45, 80, 55, 70, 40, 65, 45, 80, 55, 70].map((h, i) => (
                            <div key={i} className="w-full bg-blue-500/20 rounded-t-sm relative group">
                                <div
                                    className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-sm transition-all duration-500 group-hover:bg-blue-400"
                                    style={{ height: `${h}%` }}
                                ></div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-96 overflow-hidden">
                    <h3 className="text-lg font-bold text-white mb-6">Recent Live Events</h3>
                    <div className="space-y-6 overflow-y-auto max-h-[280px] scrollbar-hide">
                        {stats?.recentActivity.length === 0 ? (
                            <p className="text-slate-500 text-sm">No activity recorded yet.</p>
                        ) : (
                            stats?.recentActivity.map((event, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                                        <Activity className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-white truncate">{event.action} on {event.path}</p>
                                        <p className="text-xs text-slate-500">{new Date(event.timestamp).toLocaleTimeString()}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
