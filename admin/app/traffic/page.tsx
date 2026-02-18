"use client";

import { useState, useEffect } from 'react';
import { BarChart3, Globe, Hash, Share2, Compass } from 'lucide-react';
import api from '@/lib/api';
import StatsCard from '@/components/StatsCard';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

export default function TrafficPage() {
    const [sources, setSources] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/traffic/stats');
                setSources(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6'];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Traffic Analytics</h1>
                <p className="text-zinc-400">Deep dive into where your visitors come from and how they convert.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatsCard title="Direct Traffic" value="64%" icon={Globe} trend={{ value: 5, isPositive: true }} />
                <StatsCard title="Search (SEO)" value="22%" icon={Hash} trend={{ value: 12, isPositive: true }} />
                <StatsCard title="Social" value="8%" icon={Share2} trend={{ value: 2, isPositive: false }} />
                <StatsCard title="Referrals" value="6%" icon={Compass} trend={{ value: 1, isPositive: true }} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
                    <h3 className="font-bold mb-6">Conversions by Source</h3>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sources}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <XAxis dataKey="_id" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#ffffff05' }}
                                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px' }}
                                />
                                <Bar dataKey="conversions" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl flex flex-col items-center justify-center">
                    <h3 className="font-bold mb-6 w-full text-left">Source Distribution</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={sources.length > 0 ? sources : [{ _id: 'None', count: 1 }]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="count"
                                >
                                    {sources.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-6 space-y-2 w-full">
                        {sources.map((source, i) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2 text-zinc-400">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                    <span>{source._id}</span>
                                </div>
                                <span className="font-bold text-white">{source.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
