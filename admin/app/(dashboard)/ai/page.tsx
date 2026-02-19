'use client';

import { useState, useEffect } from 'react';
import {
    Bot,
    AlertCircle,
    Clock,
    TrendingUp,
    CheckCircle2
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import api from '../../../lib/api';
import { toast } from 'sonner';

export default function AIMonitoringPage() {
    const [stats, setStats] = useState<AIStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    interface AIStats {
        summary: {
            totalRequests: number;
            avgResponseTime: number;
            failRate: string;
        };
        dailyStats: Array<{ _id: string; count: number }>;
    }

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/stats/ai');
                setStats(res.data);
            } catch {
                toast.error('Failed to fetch AI stats');
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (isLoading) return <div className="p-8 text-center font-bold italic text-slate-500 animate-pulse uppercase tracking-widest">Scanning AI Systems...</div>;

    return (
        <div className="space-y-8">
            <div className="border-b border-slate-200 dark:border-zinc-800 pb-6">
                <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">AI Usage Monitoring</h1>
                <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium">Track performance, usage trends, and failure rates of AI services</p>
            </div>

            {/* AI KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total AI Requests"
                    value={stats?.summary?.totalRequests || '0'}
                    icon={<Bot className="w-5 h-5 text-blue-500" />}
                />
                <StatCard
                    title="Avg Response Time"
                    value={`${stats?.summary?.avgResponseTime?.toFixed(0) || '0'}ms`}
                    icon={<Clock className="w-5 h-5 text-amber-500" />}
                />
                <StatCard
                    title="Failure Rate"
                    value={`${stats?.summary?.failRate || '0.0'}%`}
                    icon={<AlertCircle className="w-5 h-5 text-rose-500" />}
                    alert={Number(stats?.summary?.failRate) > 5}
                />
                <StatCard
                    title="Success Rate"
                    value={`${(100 - Number(stats?.summary?.failRate || 0)).toFixed(1)}%`}
                    icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Usage Trend Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                        AI Request Trends (30 Days)
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats?.dailyStats || []}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="_id" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip />
                                <Area type="monotone" dataKey="count" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCount)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Most Searched (Static for now) */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-lg font-bold mb-6">Top AI Destinations</h3>
                    <div className="space-y-4">
                        {['Paris', 'Goa', 'Tokyo', 'Bali', 'London'].map((dest, i) => (
                            <div key={dest} className="flex items-center justify-between group cursor-default">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-black text-slate-300 w-4">{i + 1}</span>
                                    <span className="font-bold text-slate-700 dark:text-slate-200">{dest}</span>
                                </div>
                                <span className="text-xs font-bold bg-slate-100 dark:bg-zinc-800 px-2 py-1 rounded-lg">
                                    {1200 - i * 150} reqs
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, alert }: { title: string, value: string | number, icon: React.ReactNode, alert?: boolean }) {
    return (
        <div className={`bg-white dark:bg-zinc-900 p-6 rounded-2xl border ${alert ? 'border-rose-500/50 bg-rose-50/50 dark:bg-rose-500/5' : 'border-slate-200 dark:border-zinc-800'} shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-slate-50 dark:bg-zinc-800 rounded-xl">
                    {icon}
                </div>
                {alert && <span className="text-[10px] font-black uppercase text-rose-500 animate-pulse">Critical Alert</span>}
            </div>
            <h4 className="text-slate-500 dark:text-zinc-400 text-sm font-medium">{title}</h4>
            <div className={`text-2xl font-black mt-1 ${alert ? 'text-rose-600' : 'text-slate-800 dark:text-white'}`}>{value}</div>
        </div>
    );
}
