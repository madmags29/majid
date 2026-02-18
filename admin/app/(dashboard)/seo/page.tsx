'use client';

import {
    Search,
    Link as LinkIcon,
    Clock,
    MousePointer2,
    BarChart3,
    ArrowUpRight,
    Sparkles,
    FileText
} from 'lucide-react';

const topPosts = [
    { title: 'Top 10 Spiritual Getaways in India', views: '12,500', time: '4:12', bounce: '42%' },
    { title: 'How to Plan a 3-Day Trip to Jaipur', views: '10,200', time: '5:45', bounce: '38%' },
    { title: 'Best Hill Stations Near Delhi in June', views: '9,800', time: '3:50', bounce: '45%' },
    { title: 'Rishikesh Adventure Guide for 2026', views: '8,400', time: '6:10', bounce: '31%' },
    { title: 'Budget Weekend Escapes from Mumbai', views: '7,200', time: '2:30', bounce: '52%' },
];

export default function SEOContentPage() {
    return (
        <div className="space-y-8">
            <div className="border-b border-slate-200 dark:border-zinc-800 pb-6">
                <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">SEO & Content Analytics</h1>
                <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium">Monitor content performance, search visibility, and indexing status</p>
            </div>

            {/* SEO KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SEOCard title="Indexed Pages" value="1,240" label="Sitemap Status" icon={<Search className="w-5 h-5 text-blue-500" />} />
                <SEOCard title="Avg Time on Page" value="4m 12s" label="+12% from last month" icon={<Clock className="w-5 h-5 text-purple-500" />} />
                <SEOCard title="Bounce Rate" value="44.2%" label="Optimization required" icon={<MousePointer2 className="w-5 h-5 text-rose-500" />} />
                <SEOCard title="Backlinks" value="284" label="Global authority" icon={<LinkIcon className="w-5 h-5 text-emerald-500" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Content Performance Table */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2 uppercase tracking-tight italic underline decoration-blue-500 decoration-2 underline-offset-4">
                        <FileText className="w-5 h-5 text-blue-500" />
                        Top Performing Guides
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-zinc-800">
                                    <th className="pb-4">Article Title</th>
                                    <th className="pb-4">Views</th>
                                    <th className="pb-4">Avg Time</th>
                                    <th className="pb-4 text-right">Bounce</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-zinc-800">
                                {topPosts.map((post) => (
                                    <tr key={post.title} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                                        <td className="py-4 font-bold text-slate-700 dark:text-zinc-300 text-sm truncate max-w-[300px]">{post.title}</td>
                                        <td className="py-4 font-black text-xs">{post.views}</td>
                                        <td className="py-4 text-sm font-medium text-blue-600 dark:text-blue-400 font-mono">{post.time}</td>
                                        <td className="py-4 text-right">
                                            <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${parseInt(post.bounce) > 50 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
                                                }`}>
                                                {post.bounce}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* SEO Insights Panel */}
                <div className="bg-slate-900 rounded-2xl p-6 border border-white/5 space-y-6">
                    <h3 className="text-white font-black uppercase italic tracking-tighter text-lg flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                        SEO Opportunities
                    </h3>
                    <div className="space-y-4">
                        <OpportunityItem title="Low Performance Page" target="/explore/delhi" msg="Bounce rate is 62%. Consider adding more interactive elements or images." />
                        <OpportunityItem title="Missing Alt Text" target="Category Banners" msg="14 images missing alt text. Fix required for better Image Search rankings." />
                        <OpportunityItem title="Internal Link Gap" target="Rishikesh Guide" msg="Guide has 0 links back to the India directory. Integration needed." />
                    </div>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase italic tracking-widest text-xs py-3 rounded-xl transition-all shadow-lg shadow-blue-900/40 mt-4">
                        Push SEO Updates
                    </button>
                </div>
            </div>
        </div>
    );
}

function SEOCard({ title, value, label, icon }: { title: string, value: string, label: string, icon: React.ReactNode }) {
    return (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm group hover:border-blue-500/30 transition-all">
            <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-slate-50 dark:bg-zinc-800 rounded-xl group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h4 className="text-slate-500 dark:text-zinc-400 text-xs font-black uppercase tracking-widest">{title}</h4>
            <div className="text-2xl font-black text-slate-800 dark:text-white mt-1">{value}</div>
            <p className="mt-2 text-[10px] font-bold text-slate-400">{label}</p>
        </div>
    );
}

function OpportunityItem({ title, target, msg }: { title: string, target: string, msg: string }) {
    return (
        <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest">{title}</span>
                <span className="text-slate-500 text-[9px] font-mono">{target}</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">{msg}</p>
        </div>
    );
}
