'use client';

import {
    Users,
    Search,
    Eye,
    Bookmark,
    Mail,
    ArrowDown,
    TrendingDown,
    TrendingUp
} from 'lucide-react';

const funnelData = [
    { step: 'Visitors', count: '45,200', percent: '100%', icon: Users, color: 'bg-blue-500' },
    { step: 'Trip Search', count: '12,400', percent: '27.4%', icon: Search, color: 'bg-indigo-500' },
    { step: 'Itinerary View', count: '8,200', percent: '18.1%', icon: Eye, color: 'bg-purple-500' },
    { step: 'Saved Trips', count: '1,500', percent: '3.3%', icon: Bookmark, color: 'bg-pink-500' },
    { step: 'Booking / Contact', count: '420', percent: '0.9%', icon: Mail, color: 'bg-rose-500' },
];

export default function ConversionFunnelPage() {
    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="border-b border-slate-200 dark:border-zinc-800 pb-6">
                <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Conversion Funnel</h1>
                <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium">Visualize and optimize the user journey from landing to conversion</p>
            </div>

            {/* Funnel Visualization */}
            <div className="space-y-4">
                {funnelData.map((item, index) => (
                    <div key={item.step} className="flex flex-col items-center">
                        <div className="w-full flex items-center gap-6 group">
                            <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center text-white shadow-lg shrink-0 group-hover:scale-110 transition-transform`}>
                                <item.icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between shadow-sm group-hover:border-blue-500/30 transition-colors">
                                <div>
                                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-1">{item.step}</h3>
                                    <div className="text-2xl font-black text-slate-800 dark:text-white">{item.count}</div>
                                </div>
                                <div className="text-right flex flex-col items-end">
                                    <span className="text-xs font-bold text-slate-500 italic">Conversion from Total</span>
                                    <div className="text-xl font-black text-blue-600 dark:text-blue-400">{item.percent}</div>
                                </div>
                            </div>
                        </div>

                        {index < funnelData.length - 1 && (
                            <div className="py-4 flex flex-col items-center">
                                <ArrowDown className="w-6 h-6 text-slate-300 animate-bounce" />
                                <div className="mt-2 bg-rose-50 dark:bg-rose-500/10 text-rose-500 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1">
                                    <TrendingDown className="w-3 h-3" />
                                    {(Number(item.percent.replace('%', '')) - Number(funnelData[index + 1].percent.replace('%', ''))).toFixed(1)}% Drop-off
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Optimization Insights */}
            <div className="mt-12 bg-slate-900 rounded-3xl p-8 border border-white/5">
                <h3 className="text-xl font-black text-white italic tracking-tighter uppercase mb-6 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-emerald-500" />
                    Optimization Opportunities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InsightCard
                        title="High Search-to-View Drop-off"
                        description="34% of users who search don't click on any results. Consider improving the relevance of search suggestions."
                        impact="High"
                    />
                    <InsightCard
                        title="Strong Mobile Engagement"
                        description="Mobile users have a 12% higher 'Saved Trip' rate than desktop users. Double down on mobile-first features."
                        impact="Medium"
                    />
                </div>
            </div>
        </div>
    );
}

function InsightCard({ title, description, impact }: { title: string, description: string, impact: string }) {
    return (
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-white text-base">{title}</h4>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${impact === 'High' ? 'bg-rose-500 text-white' : 'bg-blue-500 text-white'
                    }`}>{impact} Impact</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
        </div>
    );
}
