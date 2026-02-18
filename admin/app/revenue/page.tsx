"use client";

import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, CreditCard, ShoppingBag, ArrowUpRight } from 'lucide-react';
import api from '@/lib/api';
import StatsCard from '@/components/StatsCard';
import { format } from 'date-fns';

export default function RevenuePage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/revenue/stats');
                setData(res.data.data);
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
                <h1 className="text-3xl font-bold tracking-tight mb-2">Revenue Dashboard</h1>
                <p className="text-zinc-400">Track earnings from affiliate clicks, ads, and bookings.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Revenue"
                    value={`$${(data?.summary?.total || 0).toFixed(2)}`}
                    icon={DollarSign}
                    trend={{ value: 14.2, isPositive: true }}
                />
                <StatsCard
                    title="Ad Revenue"
                    value="$42.50"
                    icon={CreditCard}
                    subtext="Google AdSense"
                />
                <StatsCard
                    title="Affiliate Clicks"
                    value="1,240"
                    icon={ShoppingBag}
                    subtext="TravelPayouts Performance"
                />
                <StatsCard
                    title="Conversion Rate"
                    value="2.8%"
                    icon={TrendingUp}
                    subtext="Visitor to Booking"
                />
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
                <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                    <h3 className="font-bold">Recent Transactions</h3>
                    <button className="text-blue-400 text-sm font-medium hover:underline">View All</button>
                </div>
                <div className="divide-y divide-zinc-800">
                    {loading ? (
                        Array(5).fill(0).map((_, i) => <div key={i} className="h-20 bg-zinc-800/20 animate-pulse" />)
                    ) : data?.records.length === 0 ? (
                        <div className="p-20 text-center text-zinc-500 italic">No revenue records found yet.</div>
                    ) : data?.records.map((record: any, i: number) => (
                        <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-zinc-800/20 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center">
                                    <ArrowUpRight size={20} />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white capitalize">{record.source} Clicks</div>
                                    <div className="text-xs text-zinc-500 uppercase tracking-tighter">{format(new Date(record.timestamp), 'MMM d, HH:mm')}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold text-emerald-400">+${record.amount.toFixed(2)}</div>
                                <div className="text-[10px] text-zinc-600 font-bold uppercase">Settled</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
