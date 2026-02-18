"use client";

import { useState, useEffect } from 'react';
import { Filter, MousePointer2, Search, Heart, Mail, TrendingUp } from 'lucide-react';
import api from '@/lib/api';
import StatsCard from '@/components/StatsCard';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell, LabelList
} from 'recharts';

export default function FunnelPage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/funnel/stats');
                setData(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getIcon = (step: string) => {
        switch (step) {
            case 'Visitors': return MousePointer2;
            case 'Searches': return Search;
            case 'Saved Trips': return Heart;
            case 'Leads': return Mail;
            default: return TrendingUp;
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Conversion Funnel</h1>
                <p className="text-zinc-400">Track user progression from landing to high-value actions.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {data.map((item, i) => (
                    <StatsCard
                        key={i}
                        title={item.step}
                        value={item.count}
                        icon={getIcon(item.step)}
                        loading={loading}
                    />
                ))}
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl">
                <h3 className="font-bold mb-8 text-lg">Conversion Drop-off Visualization</h3>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="vertical" margin={{ left: 40, right: 40 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={true} vertical={false} />
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="step"
                                type="category"
                                stroke="#71717a"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                width={100}
                            />
                            <Tooltip
                                cursor={{ fill: '#ffffff05' }}
                                contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px' }}
                            />
                            <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={50}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={`rgba(59, 130, 246, ${1 - index * 0.2})`} />
                                ))}
                                <LabelList dataKey="count" position="right" fill="#f4f4f5" fontSize={12} offset={10} />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-8">
                    {data.slice(0, -1).map((item, i) => {
                        const next = data[i + 1];
                        const rate = item.count > 0 ? ((next.count / item.count) * 100).toFixed(1) : 0;
                        return (
                            <div key={i} className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex flex-col items-center">
                                <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">{item.step} to {next.step}</div>
                                <div className="text-xl font-bold text-emerald-400">{rate}%</div>
                                <div className="text-[10px] text-zinc-600">Success Rate</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
