'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import {
    Globe,
    ArrowUpRight,
    Users,
    MousePointer2,
    Search,
    Link as LinkIcon,
    Share2
} from 'lucide-react';

const sourceData = [
    { name: 'Direct', value: 400, color: '#3b82f6' },
    { name: 'Organic Search', value: 300, color: '#8b5cf6' },
    { name: 'Referral', value: 200, color: '#ec4899' },
    { name: 'Social', value: 100, color: '#f97316' },
    { name: 'Email', value: 50, color: '#10b981' },
];

const topPages = [
    { path: '/', views: '24,500', rate: '+12.5%', type: 'Landing' },
    { path: '/explore/india', views: '18,200', rate: '+8.2%', type: 'Content' },
    { path: '/search', views: '15,400', rate: '-2.1%', type: 'Service' },
    { path: '/explore/europe', views: '12,100', rate: '+15.4%', type: 'Content' },
    { path: '/trips', views: '8,900', rate: '+5.5%', type: 'User' },
];

export default function TrafficAnalyticsPage() {
    return (
        <div className="space-y-8">
            <div className="border-b border-slate-200 dark:border-zinc-800 pb-6">
                <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Traffic Analytics</h1>
                <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium">Analyze where your visitors are coming from and what they're looking at</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Source Distribution */}
                <div className="lg:col-span-1 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-lg font-bold mb-6">Acquisition Channels</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={sourceData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {sourceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-6 space-y-3">
                        {sourceData.map((source) => (
                            <div key={source.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: source.color }} />
                                    <span className="text-sm font-medium text-slate-600 dark:text-zinc-400">{source.name}</span>
                                </div>
                                <span className="text-sm font-bold">{((source.value / 1050) * 100).toFixed(1)}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Landing Pages Table */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-lg font-bold mb-6">Top Landing & Exit Pages</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-zinc-800">
                                    <th className="pb-4">Page Path</th>
                                    <th className="pb-4">Visitors</th>
                                    <th className="pb-4">Growth</th>
                                    <th className="pb-4 text-right">Type</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-zinc-800">
                                {topPages.map((page) => (
                                    <tr key={page.path} className="group">
                                        <td className="py-4 font-mono text-sm text-blue-600 dark:text-blue-400 group-hover:underline cursor-pointer">{page.path}</td>
                                        <td className="py-4 font-bold">{page.views}</td>
                                        <td className={`py-4 font-bold text-xs ${page.rate.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                                            {page.rate}
                                        </td>
                                        <td className="py-4 text-right">
                                            <span className="text-[10px] font-black uppercase px-2 py-1 bg-slate-100 dark:bg-zinc-800 rounded-lg text-slate-500">
                                                {page.type}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Keyword Performance Section */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-2xl font-black italic tracking-tight uppercase">Search Console Insights</h3>
                        <p className="opacity-80 text-sm font-medium">Top performing keywords driving organic traffic</p>
                    </div>
                    <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-bold transition-all border border-white/10">
                        View GSC Full Report
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KeywordCard label="weekend trips near me" clicks="1,240" ctr="4.2%" pos="2.1" />
                    <KeywordCard label="3 day itinerary india" clicks="890" ctr="3.8%" pos="4.5" />
                    <KeywordCard label="best travel planner ai" clicks="750" ctr="6.1%" pos="1.2" />
                    <KeywordCard label="hidden gems rajasthan" clicks="520" ctr="2.9%" pos="8.4" />
                </div>
            </div>
        </div>
    );
}

function KeywordCard({ label, clicks, ctr, pos }: { label: string, clicks: string, ctr: string, pos: string }) {
    return (
        <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10">
            <h4 className="font-bold text-sm mb-4 truncate italic">"{label}"</h4>
            <div className="grid grid-cols-3 gap-2 text-center border-t border-white/5 pt-4">
                <div>
                    <div className="text-[10px] font-bold uppercase opacity-60 mb-1">Clicks</div>
                    <div className="font-black">{clicks}</div>
                </div>
                <div>
                    <div className="text-[10px] font-bold uppercase opacity-60 mb-1">CTR</div>
                    <div className="font-black">{ctr}</div>
                </div>
                <div>
                    <div className="text-[10px] font-bold uppercase opacity-60 mb-1">Avg Pos</div>
                    <div className="font-black text-blue-300">{pos}</div>
                </div>
            </div>
        </div>
    );
}
