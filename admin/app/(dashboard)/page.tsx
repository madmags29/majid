'use client';

import {
    Users,
    Zap,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

const data = [
    { name: 'Feb 12', users: 400 },
    { name: 'Feb 13', users: 600 },
    { name: 'Feb 14', users: 800 },
    { name: 'Feb 15', users: 700 },
    { name: 'Feb 16', users: 900 },
    { name: 'Feb 17', users: 1100 },
    { name: 'Feb 18', users: 1200 },
];

const trafficSource = [
    { name: 'Organic', value: 45 },
    { name: 'Paid', value: 25 },
    { name: 'Direct', value: 20 },
    { name: 'Social', value: 10 },
];

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'];

export default function OverviewPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value="4,231"
                    icon={<Users className="w-6 h-6 text-white" />}
                    iconBg="bg-blue-500"
                    trend="+12% from last week"
                    trendUp={true}
                />
                <StatCard
                    title="Active Now"
                    value="124"
                    icon={<ActivityIndicator />}
                    iconBg="bg-emerald-500/20"
                    trend="Live users"
                    trendUp={true}
                />
                <StatCard
                    title="AI Trip Searches"
                    value="18.5k"
                    icon={<Zap className="w-6 h-6 text-white" />}
                    iconBg="bg-violet-500"
                    trend="+5% from yesterday"
                    trendUp={true}
                />
                <StatCard
                    title="Conversion Rate"
                    value="3.2%"
                    icon={<TrendingUp className="w-6 h-6 text-white" />}
                    iconBg="bg-rose-500"
                    trend="-0.4% this month"
                    trendUp={false}
                />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Line Chart Card */}
                <div className="glass-panel p-8 rounded-3xl">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">User Growth</h3>
                            <p className="text-sm text-slate-500 dark:text-zinc-400">Daily active users over the last 30 days</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-xs font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20">
                                +12.5%
                            </div>
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#94a3b8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#94a3b8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    dx={-10}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#09090b',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)',
                                        color: '#fff'
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                    labelStyle={{ color: '#a1a1aa' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="users"
                                    stroke="#6366f1"
                                    strokeWidth={4}
                                    dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 8, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart Card */}
                <div className="glass-panel p-8 rounded-3xl">
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Traffic Sources</h3>
                        <p className="text-sm text-slate-500 dark:text-zinc-400">Where your users are coming from</p>
                    </div>
                    <div className="h-[350px] w-full flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={trafficSource}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                    cornerRadius={4}
                                >
                                    {trafficSource.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#09090b',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: '#fff'
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text Overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-black text-slate-800 dark:text-white">100%</span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Volume</span>
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                        {trafficSource.map((source, index) => (
                            <div key={source.name} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                <span className="text-sm font-medium text-slate-600 dark:text-zinc-400">{source.name}</span>
                                <span className="ml-auto text-sm font-bold text-slate-800 dark:text-white">{source.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, iconBg, trend, trendUp }: { title: string, value: string, icon: React.ReactNode, iconBg?: string, trend: string, trendUp: boolean }) {
    return (
        <div className="glass-card p-6 rounded-3xl group cursor-default">
            <div className="flex items-start justify-between mb-4">
                <div className={cn("p-3 rounded-2xl transition-transform duration-300 group-hover:scale-110", iconBg ? iconBg : "bg-slate-100 dark:bg-zinc-800")}>
                    {icon}
                </div>
                {trendUp ? (
                    <div className="flex items-center text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full text-xs font-bold">
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        {trend.split(' ')[0]}
                    </div>
                ) : (
                    <div className="flex items-center text-rose-500 bg-rose-500/10 px-2.5 py-1 rounded-full text-xs font-bold">
                        <ArrowDownRight className="w-3 h-3 mr-1" />
                        {trend.split(' ')[0]}
                    </div>
                )}
            </div>
            <div>
                <h4 className="text-slate-500 dark:text-zinc-400 text-sm font-bold uppercase tracking-wide">{title}</h4>
                <div className="text-3xl font-black text-slate-800 dark:text-white mt-2 tracking-tight group-hover:translate-x-1 transition-transform duration-300">{value}</div>
            </div>
            <p className="mt-4 text-xs font-medium text-slate-400 dark:text-zinc-500 border-t border-slate-100 dark:border-white/5 pt-4">
                {trend}
            </p>
        </div>
    );
}

function ActivityIndicator() {
    return (
        <div className="w-6 h-6 flex items-center justify-center relative">
            <div className="absolute w-full h-full bg-emerald-500 rounded-full animate-ping opacity-75" />
            <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full z-10 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
        </div>
    );
}

function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}
