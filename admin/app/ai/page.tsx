"use client";

import { useState, useEffect } from 'react';
import { Brain, Zap, AlertTriangle, CheckCircle2, Search } from 'lucide-react';
import api from '@/lib/api';
import StatsCard from '@/components/StatsCard';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell
} from 'recharts';

export default function AIUsagePage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/ai/stats');
                setData(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const performanceData = [
        { name: 'Success', value: data?.summary?.totalRequests || 0, color: '#10b981' },
        { name: 'Failed', value: 0, color: '#f43f5e' }, // Placeholder for failed count if needed
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">AI Usage Monitoring</h1>
                <p className="text-zinc-400">Track OpenAI API performance, cost, and request patterns.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Requests"
                    value={data?.summary?.totalRequests || 0}
                    icon={Brain}
                    loading={loading}
                />
                <StatsCard
                    title="Avg Latency"
                    value={`${((data?.summary?.avgResponseTime || 0) / 1000).toFixed(2)}s`}
                    icon={Zap}
                    loading={loading}
                />
                <StatsCard
                    title="Success Rate"
                    value={`${((data?.summary?.successRate || 0) * 100).toFixed(1)}%`}
                    icon={CheckCircle2}
                    loading={loading}
                />
                <StatsCard
                    title="Est. Monthly Cost"
                    value={`$${((data?.summary?.totalRequests || 0) * 0.02).toFixed(2)}`}
                    icon={AlertTriangle}
                    subtext="Based on avg. tokens"
                    loading={loading}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
                    <h3 className="font-bold mb-6">Recent AI Requests</h3>
                    <div className="space-y-4">
                        {loading ? (
                            Array(5).fill(0).map((_, i) => <div key={i} className="h-12 bg-zinc-800/20 animate-pulse rounded-xl" />)
                        ) : data?.recent.map((req: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${req.status === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                        <Search size={18} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-white max-w-[200px] truncate">{req.prompt}</div>
                                        <div className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider">
                                            {new Date(req.timestamp).toLocaleTimeString()} • {(req.responseTime / 1000).toFixed(2)}s
                                        </div>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${req.status === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                                    }`}>
                                    {req.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
                    <h3 className="font-bold mb-6">Performance Distribution</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={performanceData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#ffffff05' }}
                                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px' }}
                                />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {performanceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
