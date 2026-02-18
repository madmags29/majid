'use client';

import {
    Users,
    MousePointerClick,
    Zap,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight
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
    BarChart as ReBarChart,
    Bar
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

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316'];

export default function OverviewPage() {
    return (
        <div className="space-y-8 pb-12">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value="4,231"
                    icon={<Users className="w-5 h-5 text-blue-600" />}
                    trend="+12% from last week"
                    trendUp={true}
                />
                <StatCard
                    title="Active Now"
                    value="124"
                    icon={<ActivityIndicator />}
                    trend="Live users"
                    trendUp={true}
                />
                <StatCard
                    title="AI Trip Searches"
                    value="18.5k"
                    icon={<Zap className="w-5 h-5 text-purple-600" />}
                    trend="+5% from yesterday"
                    trendUp={true}
                />
                <StatCard
                    title="Conversion Rate"
                    value="3.2%"
                    icon={<TrendingUp className="w-5 h-5 text-pink-600" />}
                    trend="-0.4% this month"
                    trendUp={false}
                />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-lg font-bold mb-6">Daily Active Users (30 Days)</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-lg font-bold mb-6">Traffic Source Breakdown</h3>
                    <div className="h-[300px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={trafficSource}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {trafficSource.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, trend, trendUp }: { title: string, value: string, icon: React.ReactNode, trend: string, trendUp: boolean }) {
    return (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-slate-50 dark:bg-zinc-800 rounded-xl">
                    {icon}
                </div>
                {trendUp ? (
                    <div className="flex items-center text-emerald-600 text-xs font-bold leading-none">
                        <ArrowUpRight className="w-3 h-3 mr-0.5" />
                        {trend.split(' ')[0]}
                    </div>
                ) : (
                    <div className="flex items-center text-rose-600 text-xs font-bold leading-none">
                        <ArrowDownRight className="w-3 h-3 mr-0.5" />
                        {trend.split(' ')[0]}
                    </div>
                )}
            </div>
            <div>
                <h4 className="text-slate-500 dark:text-zinc-400 text-sm font-medium">{title}</h4>
                <div className="text-3xl font-black text-slate-800 dark:text-white mt-1">{value}</div>
            </div>
            <p className="mt-4 text-xs text-slate-400 dark:text-zinc-500 font-medium">
                {trend}
            </p>
        </div>
    );
}

function ActivityIndicator() {
    return (
        <div className="w-5 h-5 flex items-center justify-center relative">
            <div className="absolute w-full h-full bg-emerald-500/20 rounded-full animate-ping" />
            <div className="w-2 h-2 bg-emerald-500 rounded-full z-10" />
        </div>
    );
}
