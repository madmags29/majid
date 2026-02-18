'use client';

import {
    Clock,
    Search,
    Eye,
    MapPin,
    Zap,
    History,
    ArrowRight,
    UserCircle,
    Smartphone,
    Globe
} from 'lucide-react';

const activities = [
    { type: 'trip_search', user: 'Majid Khan', detail: 'Paris, France (3 days)', time: '2 mins ago', icon: Search, color: 'text-blue-500' },
    { type: 'page_view', user: 'Ananya Sharma', detail: '/explore/goa', time: '12 mins ago', icon: Eye, color: 'text-purple-500' },
    { type: 'trip_save', user: 'Kevin Peterson', detail: 'Jaipur Heritage Tour', time: '25 mins ago', icon: Zap, color: 'text-amber-500' },
    { type: 'trip_search', user: 'Sarah Jenkins', detail: 'Munnar Tea Gardens', time: '42 mins ago', icon: Search, color: 'text-blue-500' },
    { type: 'contact_submit', user: 'Rahul Varma', detail: 'Custom Trip Inquiry', time: '1h 12m ago', icon: Globe, color: 'text-emerald-500' },
    { type: 'page_view', user: 'Majid Khan', detail: '/search', time: '1h 45m ago', icon: Eye, color: 'text-purple-500' },
];

export default function UserActivityTrackingPage() {
    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="border-b border-slate-200 dark:border-zinc-800 pb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">User Activity Tracking</h1>
                    <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium">Real-time timeline of user actions and interaction patterns</p>
                </div>
                <div className="flex items-center gap-2 text-blue-600 bg-blue-50 dark:bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-500/20">
                    <History className="w-4 h-4" />
                    <span className="text-xs font-black uppercase">Live Timeline</span>
                </div>
            </div>

            {/* Live Activity Timeline */}
            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-zinc-800 before:to-transparent">
                {activities.map((item, index) => (
                    <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        {/* Icon */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-zinc-950 bg-slate-50 dark:bg-zinc-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform group-hover:scale-125">
                            <item.icon className={`w-5 h-5 ${item.color}`} />
                        </div>
                        {/* Content */}
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all group-hover:border-blue-500/30">
                            <div className="flex items-center justify-between mb-2">
                                <div className="font-black text-slate-800 dark:text-white uppercase text-[10px] tracking-widest italic">{item.type.replace('_', ' ')}</div>
                                <time className="font-mono text-[10px] text-slate-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {item.time}
                                </time>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                                <UserCircle className="w-4 h-4 text-slate-400" />
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{item.user}</span>
                            </div>
                            <div className="text-xs text-slate-500 dark:text-zinc-400 bg-slate-50 dark:bg-zinc-800/50 p-2 rounded-lg border border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                                <span className="font-medium truncate mr-2">{item.detail}</span>
                                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Session Summary Bar */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-white/5 flex flex-col md:flex-row items-center gap-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                        <Smartphone className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Global Device Split</div>
                        <div className="text-lg font-black text-white italic">72% Mobile / 28% Desk</div>
                    </div>
                </div>
                <div className="flex items-center gap-4 border-l border-white/10 pl-8">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20">
                        <Clock className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Avg Session Duration</div>
                        <div className="text-lg font-black text-white italic">5m 45s (+12%)</div>
                    </div>
                </div>
                <button className="ml-auto bg-white/10 hover:bg-white text-white hover:text-slate-950 font-black uppercase italic tracking-widest text-xs px-6 py-3 rounded-xl transition-all">
                    Full Session Logs
                </button>
            </div>
        </div>
    );
}
