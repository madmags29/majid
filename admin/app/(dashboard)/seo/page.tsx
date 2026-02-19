'use client';

import {
    Search,
    Link as LinkIcon,
    Clock,
    MousePointer2,
    BarChart3,
    ArrowUpRight,
    Sparkles,
    FileText,
    CheckCircle2,
    AlertCircle,
    XCircle,
    Globe,
    TrendingUp
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const keywordData = [
    { range: 'Top 3', count: 145, color: '#10b981' },
    { range: 'Top 10', count: 320, color: '#3b82f6' },
    { range: 'Top 100', count: 850, color: '#6366f1' },
];

const ctrData = [
    { pos: '1', ctr: 32 },
    { pos: '2', ctr: 24 },
    { pos: '3', ctr: 18 },
    { pos: '4', ctr: 12 },
    { pos: '5', ctr: 9 },
    { pos: '6', ctr: 6 },
    { pos: '7', ctr: 4 },
    { pos: '8', ctr: 3 },
    { pos: '9', ctr: 2 },
    { pos: '10', ctr: 1 },
];

const topContent = [
    { title: 'Top 10 Spiritual Getaways in India', views: '12,500', clicks: '8,400', ctr: '4.2%', pos: '3.2' },
    { title: 'How to Plan a 3-Day Trip to Jaipur', views: '10,200', clicks: '6,100', ctr: '3.8%', pos: '4.1' },
    { title: 'Best Hill Stations Near Delhi in June', views: '9,800', clicks: '5,900', ctr: '5.1%', pos: '2.8' },
    { title: 'Rishikesh Adventure Guide for 2026', views: '8,400', clicks: '4,200', ctr: '2.5%', pos: '8.4' },
    { title: 'Budget Weekend Escapes from Mumbai', views: '7,200', clicks: '3,800', ctr: '6.4%', pos: '1.9' },
];

const seoHealth = [
    { name: 'Healthy', value: 85, color: '#10b981' },
    { name: 'Issues', value: 15, color: '#ef4444' },
];

export default function SEOContentPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-white/5 pb-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">SEO & Content Analytics</h1>
                    <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium">Monitor content performance, search visibility, and indexing status</p>
                </div>
                <div className="flex gap-2">
                    <a
                        href="https://search.google.com/search-console/performance/search-analytics?resource_id=https%3A%2F%2Fweekendtravellers.com%2F"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-white px-4 py-2 rounded-xl transition-all font-bold text-sm shadow-sm flex items-center gap-2"
                    >
                        <Globe className="w-4 h-4" />
                        GSC Report
                    </a>
                </div>
            </div>

            {/* Top Row: Health Score & KPIs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Health Score Card */}
                <div className="glass-panel p-6 rounded-3xl relative overflow-hidden">
                    <div className="flex items-center justify-between relative z-10">
                        <h3 className="text-slate-500 dark:text-zinc-400 text-xs font-black uppercase tracking-widest">Site Health Score</h3>
                        <Sparkles className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div className="flex items-center justify-center h-[180px] relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={seoHealth}
                                    cx="50%"
                                    cy="70%"
                                    startAngle={180}
                                    endAngle={0}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={0}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {seoHealth.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute top-[65%] left-1/2 -translate-x-1/2 text-center">
                            <span className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">92</span>
                            <span className="text-sm font-bold text-slate-400 block">%</span>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-300" />
                </div>

                {/* KPI Grid */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SEOCard title="Organic Clicks" value="24.5k" trend="+8.2%" trendUp={true} icon={<MousePointer2 className="w-5 h-5 text-white" />} iconBg="bg-blue-500" />
                    <SEOCard title="Avg. CTR" value="3.4%" trend="-0.1%" trendUp={false} icon={<BarChart3 className="w-5 h-5 text-white" />} iconBg="bg-violet-500" />
                    <SEOCard title="Total Backlinks" value="1,204" trend="+12 this week" trendUp={true} icon={<LinkIcon className="w-5 h-5 text-white" />} iconBg="bg-emerald-500" />
                    <SEOCard title="Indexed Pages" value="145" trend="100% indexed" trendUp={true} icon={<Search className="w-5 h-5 text-white" />} iconBg="bg-rose-500" />
                </div>
            </div>

            {/* Middle Row: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Keyword Rankings */}
                <div className="glass-panel p-8 rounded-3xl">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Keyword Positions</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={keywordData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" opacity={0.1} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="range" type="category" width={60} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#09090b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={32}>
                                    {keywordData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* CTR Curve */}
                <div className="glass-panel p-8 rounded-3xl">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">CTR by Position</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={ctrData}>
                                <defs>
                                    <linearGradient id="colorCtr" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                                <XAxis dataKey="pos" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#09090b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                                <Area type="monotone" dataKey="ctr" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorCtr)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Content Performance Table */}
                <div className="lg:col-span-2 glass-panel p-6 rounded-3xl">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-500" />
                            Top Performing Content
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-white/5">
                                    <th className="pb-4 pl-4">Page Title</th>
                                    <th className="pb-4">Clicks</th>
                                    <th className="pb-4">CTR</th>
                                    <th className="pb-4 text-right pr-4">Avg. Pos</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                                {topContent.map((post) => (
                                    <tr key={post.title} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group">
                                        <td className="py-4 pl-4 font-bold text-slate-700 dark:text-zinc-200 text-sm truncate max-w-[200px] group-hover:text-indigo-500 transition-colors">
                                            {post.title}
                                        </td>
                                        <td className="py-4 font-black text-xs text-slate-600 dark:text-zinc-400">{post.clicks}</td>
                                        <td className="py-4 text-sm font-bold text-emerald-500">{post.ctr}</td>
                                        <td className="py-4 pr-4 text-right font-mono text-xs text-slate-500">{post.pos}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* SEO Checklist */}
                <div className="glass-panel p-6 rounded-3xl space-y-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        On-Page SEO
                    </h3>
                    <div className="space-y-4">
                        <ChecklistItem label="Sitemap.xml" status="ok" />
                        <ChecklistItem label="Robots.txt" status="ok" />
                        <ChecklistItem label="Meta Descriptions" status="warning" count={12} />
                        <ChecklistItem label="Broken Links" status="error" count={3} />
                        <ChecklistItem label="SSL Certificate" status="ok" />
                        <ChecklistItem label="Mobile Usability" status="ok" />
                    </div>
                    <button className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-white font-bold text-xs py-3 rounded-xl transition-all mt-4 border border-slate-200 dark:border-white/10">
                        Run Audit
                    </button>
                </div>
            </div>
        </div>
    );
}

function SEOCard({ title, value, trend, trendUp, icon, iconBg }: { title: string, value: string, trend: string, trendUp: boolean, icon: React.ReactNode, iconBg: string }) {
    return (
        <div className="glass-card p-5 rounded-2xl">
            <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${iconBg} shadow-lg shadow-black/5`}>
                    {icon}
                </div>
                {trendUp ? (
                    <div className="flex items-center text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {trend}
                    </div>
                ) : (
                    <div className="flex items-center text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        <TrendingUp className="w-3 h-3 mr-1 rotate-180" />
                        {trend}
                    </div>
                )}
            </div>
            <h4 className="text-slate-500 dark:text-zinc-500 text-[10px] font-black uppercase tracking-widest">{title}</h4>
            <div className="text-2xl font-black text-slate-800 dark:text-white mt-1 tracking-tight">{value}</div>
        </div>
    );
}

function ChecklistItem({ label, status, count }: { label: string, status: 'ok' | 'warning' | 'error', count?: number }) {
    return (
        <div className="flex items-center justify-between p-3 bg-slate-50/50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
            <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">{label}</span>
            <div className="flex items-center gap-2">
                {count && <span className="text-[10px] font-bold bg-slate-200 dark:bg-white/10 px-1.5 py-0.5 rounded text-slate-600 dark:text-zinc-400">{count}</span>}
                {status === 'ok' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                {status === 'warning' && <AlertCircle className="w-4 h-4 text-amber-500" />}
                {status === 'error' && <XCircle className="w-4 h-4 text-rose-500" />}
            </div>
        </div>
    );
}
