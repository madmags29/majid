'use client';

import { useState, useEffect } from 'react';
import {
    DollarSign,
    CreditCard,
    TrendingUp,
    Award,
    ArrowUpRight,
    ArrowDownRight,
    Download,
    PieChart as PieChartIcon,
    Loader2
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    Cell,
    PieChart,
    Pie
} from 'recharts';
import api from '../../../lib/api';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function RevenueDashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRevenue = async () => {
            try {
                const res = await api.get('/stats/revenue');
                setStats(res.data);
            } catch (error) {
                console.error('Failed to fetch revenue stats', error);
                toast.error('Failed to load revenue data');
            } finally {
                setIsLoading(false);
            }
        };
        fetchRevenue();
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    const chartData = stats?.dailyRevenue.map((item: any) => ({
        month: format(new Date(item._id), 'MMM dd'),
        revenue: item.total
    })) || [];

    const pieData = stats?.bySource.map((item: any, index: number) => ({
        name: item._id,
        value: item.value,
        color: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][index % 4]
    })) || [];

    const totalRevenue = stats?.total || 0;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Revenue Dashboard</h1>
                    <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium">Global financial overview: Affiliates, Ads, and Subscriptions</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl transition-all font-bold shadow-lg shadow-blue-500/30">
                    <Download className="w-4 h-4" /> Export Report
                </button>
            </div>

            {/* Financial KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FinanceCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} trend="+24.5%" trendUp={true} sub="This month" />
                <FinanceCard title="Affiliate Earnings" value={`$${(stats?.bySource?.find((s: any) => s._id === 'affiliate')?.value || 0).toLocaleString()}`} trend="+15.2%" trendUp={true} sub="Top: Travelpayouts" />
                <FinanceCard title="Ad Revenue" value={`$${(stats?.bySource?.find((s: any) => s._id === 'ad')?.value || 0).toLocaleString()}`} trend="-2.4%" trendUp={false} sub="Google AdSense" />
                <FinanceCard title="Rev per User" value="$0.00" trend="+0.0%" trendUp={true} sub="ARPU (30 days)" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Monthly Growth Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <LineChart className="w-5 h-5 text-blue-500" />
                        Revenue Growth (30 Days)
                    </h3>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip />
                                <Line type="step" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} dot={{ r: 6, fill: '#3b82f6' }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Revenue Breakdown */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800">
                    <h3 className="text-lg font-bold mb-6">Channel Distribution</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-4">
                        {pieData.map((channel: any) => (
                            <div key={channel.name} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: channel.color }} />
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 capitalize">{channel.name}</span>
                                </div>
                                <span className="text-sm font-black italic">
                                    {totalRevenue > 0 ? ((channel.value / totalRevenue) * 100).toFixed(1) : 0}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top Earning Destinations Table */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800">
                <h3 className="text-lg font-bold mb-6 italic tracking-tight uppercase">Top Earning Destinations</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-zinc-800 pb-2">
                                <th className="pb-4">Destination</th>
                                <th className="pb-4">Bookings</th>
                                <th className="pb-4">Revenue</th>
                                <th className="pb-4 text-right">Conversion</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-zinc-800">
                            {[
                                { name: 'Paris, France', bookings: 124, revenue: '$1,240', conv: '4.2%' },
                                { name: 'Goa, India', bookings: 98, revenue: '$980', conv: '3.8%' },
                                { name: 'Tokyo, Japan', bookings: 86, revenue: '$860', conv: '3.1%' },
                                { name: 'Bali, Indonesia', bookings: 75, revenue: '$750', conv: '2.9%' },
                            ].map((row) => (
                                <tr key={row.name} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                                    <td className="py-4 font-bold text-slate-800 dark:text-white uppercase text-xs italic">{row.name}</td>
                                    <td className="py-4 text-sm">{row.bookings}</td>
                                    <td className="py-4 font-black text-blue-600 dark:text-blue-400">{row.revenue}</td>
                                    <td className="py-4 text-right text-xs font-bold text-emerald-500">{row.conv}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function FinanceCard({ title, value, trend, trendUp, sub }: { title: string, value: string, trend: string, trendUp: boolean, sub: string }) {
    return (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <DollarSign className="w-12 h-12 text-blue-600" />
            </div>
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-slate-500 dark:text-zinc-400 text-xs font-black uppercase tracking-widest">{title}</h4>
                <div className={`flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded ${trendUp ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10' : 'bg-rose-100 text-rose-600 dark:bg-rose-500/10'
                    }`}>
                    {trendUp ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                    {trend}
                </div>
            </div>
            <div className="text-3xl font-black text-slate-800 dark:text-white mb-2">{value}</div>
            <p className="text-[10px] font-bold text-slate-400 uppercase italic opacity-60 tracking-wider">
                {sub}
            </p>
        </div>
    );
}
