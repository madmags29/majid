'use client';

import {
    Zap,
    TrendingUp,
    Target,
    Share2,
    Mail,
    Megaphone,
    Rocket,
    Gift
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

const growthData = [
    { label: 'Referrals', value: 450 },
    { label: 'Social Shares', value: 890 },
    { label: 'Email Invites', value: 230 },
    { label: 'Promos Used', value: 120 },
];

export default function GrowthAutomationPage() {
    return (
        <div className="space-y-8">
            <div className="border-b border-slate-200 dark:border-zinc-800 pb-6">
                <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Growth Automation</h1>
                <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium">Accelerate user acquisition with referral loops and automated campaigns</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Referrals & virality Chart */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Rocket className="w-5 h-5 text-blue-500" />
                        Acquisition Growth (30 Days)
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={growthData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                                    {growthData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#8b5cf6'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Automation Campaigns */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-lg font-bold mb-6 italic underline decoration-blue-500 decoration-2 underline-offset-4">Active Automation Workflows</h3>
                    <div className="space-y-4">
                        <WorkflowCard
                            title="Welcome Drift Sequence"
                            status="active"
                            trigger="New Registration"
                            result="18% Conversion"
                        />
                        <WorkflowCard
                            title="Abandoned Search Re-engagement"
                            status="active"
                            trigger="No Search Result for 24h"
                            result="4.2% CTR"
                        />
                        <WorkflowCard
                            title="Weekend Getaway Flash Promo"
                            status="paused"
                            trigger="Thursday Afternoon"
                            result="Prev: 12% Growth"
                        />
                    </div>
                    <button className="w-full mt-6 bg-slate-900 hover:bg-black text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                        <Zap className="w-4 h-4 text-emerald-400" /> Create New Workflow
                    </button>
                </div>
            </div>

            {/* Growth Strategies */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-8 text-white">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                        <Target className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-black italic tracking-tighter uppercase">High-Growth Strategic targets</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StrategyCard title="Refer-a-Friend" desc="Give $10, Get $10 referral loop for power users." cta="Setup Loop" />
                    <StrategyCard title="SEO Content Pillar" desc="Auto-generate landing pages for top searches." cta="Config AI" />
                    <StrategyCard title="Dynamic Pricing" desc="Flash sales based on current traffic dips." cta="Enable" />
                    <StrategyCard title="Influencer Portal" desc="Track affiliate clicks for travel bloggers." cta="Manage" />
                </div>
            </div>
        </div>
    );
}

function WorkflowCard({ title, status, trigger, result }: { title: string, status: 'active' | 'paused' | 'draft', trigger: string, result: string }) {
    return (
        <div className="p-4 bg-slate-50 dark:bg-zinc-800/50 rounded-xl border border-slate-100 dark:border-zinc-800 flex items-center justify-between group cursor-pointer hover:border-blue-500/30 transition-all">
            <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-zinc-200">{title}</h4>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tight">Trigger: {trigger}</p>
                </div>
            </div>
            <span className="text-xs font-black text-blue-600 dark:text-blue-400 font-mono">{result}</span>
        </div>
    );
}

function StrategyCard({ title, desc, cta }: { title: string, desc: string, cta: string }) {
    return (
        <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 group">
            <h4 className="font-black text-lg mb-2 italic tracking-tight">{title}</h4>
            <p className="text-sm opacity-80 mb-6 font-medium leading-relaxed">{desc}</p>
            <button className="w-full border border-white/20 group-hover:bg-white group-hover:text-blue-600 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all italic">
                {cta}
            </button>
        </div>
    );
}
