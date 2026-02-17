'use client';

import React, { useEffect, useState } from 'react';
import { Users, TrendingUp, Activity, BarChart3, BrainCircuit, Globe, ArrowRight, RefreshCw, Layers } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';

interface DashboardStats {
    realtimeUsers: number;
    totalUsers: number;
    newUsers24h: number;
    activity30Min: number;
    avgEngagementTime: number;
    recentActivity: any[];
    topDestinations: { _id: string; count: number }[];
    conversionRate: number;
    countryStats: { _id: string; count: number }[];
    funnel: {
        search: number;
        itinerary: number;
    };
}

interface AIInsight {
    summary: string;
    insights: { title: string; description: string; impact: string }[];
    recommendations: { action: string; rationale: string }[];
    sentiment: string;
    trend: string;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [aiInsights, setAIInsights] = useState<AIInsight | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingInsights, setLoadingInsights] = useState(false);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/analytics/dashboard`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAIInsights = async () => {
        setLoadingInsights(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/analytics/ai-insights`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setAIInsights(data);
        } catch (error) {
            console.error('Failed to fetch AI insights:', error);
        } finally {
            setLoadingInsights(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <p className="text-slate-400 animate-pulse">Loading analytics engine...</p>
            </div>
        );
    }

    const funnelData = [
        { name: 'Sessions', value: stats?.activity30Min || 0, fill: '#3b82f6' },
        { name: 'Searches', value: stats?.funnel.search || 0, fill: '#8b5cf6' },
        { name: 'Itineraries', value: stats?.funnel.itinerary || 0, fill: '#ec4899' },
    ];

    const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Activity className="w-8 h-8 text-blue-500" />
                        Intelligence Dashboard
                    </h1>
                    <p className="text-slate-400 mt-2">Real-time performance metrics and AI-driven business insights.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={fetchStats}
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                    <button
                        onClick={fetchAIInsights}
                        disabled={loadingInsights}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                    >
                        {loadingInsights ? <RefreshCw className="w-4 h-4 animate-spin" /> : <BrainCircuit className="w-4 h-4" />}
                        {aiInsights ? 'Re-generate Insights' : 'Generate AI Insights'}
                    </button>
                </div>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: 'Realtime Users', value: stats?.realtimeUsers || 0, subtext: 'Active in last 5m', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { title: 'Conversion Rate', value: `${stats?.conversionRate || 0}%`, subtext: 'Search to Itinerary', icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
                    { title: 'New Users', value: stats?.newUsers24h || 0, subtext: 'Registered last 24h', icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                    { title: 'Engagement', value: `${stats?.avgEngagementTime || 0}s`, subtext: 'Avg. session duration', icon: Activity, color: 'text-orange-400', bg: 'bg-orange-500/10' },
                ].map((stat, index) => (
                    <div key={index} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </div>
                        <h3 className="text-slate-400 text-sm font-medium">{stat.title}</h3>
                        <p className="text-3xl font-bold text-white mt-1 tracking-tight">{stat.value}</p>
                        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                            {stat.subtext}
                        </p>
                    </div>
                ))}
            </div>

            {/* AI Insights Section */}
            {aiInsights && (
                <div className="bg-slate-900 border border-blue-500/30 rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/5 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 p-6 border-b border-blue-500/20 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <BrainCircuit className="w-6 h-6 text-blue-400" />
                            <h2 className="text-xl font-bold text-white">AI-Powered Business Intelligence</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${aiInsights.sentiment === 'Positive' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                Sentiment: {aiInsights.sentiment}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${aiInsights.trend === 'Growth' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-500/20 text-slate-400'}`}>
                                Trend: {aiInsights.trend}
                            </span>
                        </div>
                    </div>
                    <div className="p-8 space-y-8">
                        <div>
                            <p className="text-slate-300 leading-relaxed text-lg italic">"{aiInsights.summary}"</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4" />
                                    Key Insights
                                </h3>
                                {aiInsights.insights.map((insight, idx) => (
                                    <div key={idx} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-white">{insight.title}</h4>
                                            <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${insight.impact === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                                {insight.impact} Impact
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-400">{insight.description}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Layers className="w-4 h-4" />
                                    Strategic Recommendations
                                </h3>
                                {aiInsights.recommendations.map((rec, idx) => (
                                    <div key={idx} className="flex gap-4 p-4 rounded-xl border border-blue-500/10 bg-blue-500/5">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                                            <span className="text-blue-400 font-bold">{idx + 1}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-sm">{rec.action}</h4>
                                            <p className="text-xs text-slate-400 mt-1">{rec.rationale}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Conversion Funnel */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-indigo-400" />
                        Conversion Funnel
                    </h3>
                    <div className="h-64 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={funnelData} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                                    {funnelData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Destinations */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-emerald-400" />
                        Trending Destinations
                    </h3>
                    <div className="h-64 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats?.topDestinations.map(d => ({ name: d._id || 'Unknown', count: d.count })) || []}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="count" stroke="#10b981" fillOpacity={1} fill="url(#colorCount)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Activity Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">Live Event Stream</h3>
                    <button className="text-blue-500 hover:text-blue-400 text-sm font-medium flex items-center gap-1">
                        View More Logs <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-950 text-slate-500 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-bold">Event Type</th>
                                <th className="px-6 py-4 font-bold">Path</th>
                                <th className="px-6 py-4 font-bold">Location</th>
                                <th className="px-6 py-4 font-bold">Timestamp</th>
                                <th className="px-6 py-4 font-bold">Source</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {stats?.recentActivity.map((event, i) => (
                                <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${event.action === 'pageview' ? 'bg-blue-500/20 text-blue-400' :
                                                event.action === 'search' ? 'bg-purple-500/20 text-purple-400' :
                                                    event.action === 'itinerary_generate' ? 'bg-green-500/20 text-green-400' :
                                                        'bg-slate-500/20 text-slate-400'
                                            }`}>
                                            {event.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-white font-mono">{event.path}</td>
                                    <td className="px-6 py-4 text-sm text-slate-400">{event.country}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{new Date(event.timestamp).toLocaleTimeString()}</td>
                                    <td className="px-6 py-4 text-sm text-slate-400">{event.source}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
