"use client";

import { useState } from 'react';
import { Rocket, Mail, FileText, Zap, Sparkles, ChevronRight, Download } from 'lucide-react';
import StatsCard from '@/components/StatsCard';

export default function GrowthPage() {
    const [isTriggering, setIsTriggering] = useState(false);

    const automationWorkflows = [
        { name: 'Weekly Performance Digest', status: 'active', frequency: 'Fridays @ 9AM', icon: FileText },
        { name: 'Abandoned Search Recovery', status: 'paused', frequency: 'Trigger based', icon: Zap },
        { name: 'New Trip Notification', status: 'active', frequency: 'Real-time', icon: Sparkles },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Growth Automation</h1>
                <p className="text-zinc-400">Automate user engagement, reporting, and marketing workflows.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatsCard title="Projected Growth" value="+24%" icon={Rocket} color="blue" trend={{ value: 4, isPositive: true }} />
                <StatsCard title="Emails Sent" value="1,240" icon={Mail} color="emerald" subtext="Last 7 days" />
                <StatsCard title="Auto-Reports" value="12" icon={FileText} color="amber" subtext="Monthly generated" />
                <StatsCard title="Engagements" value="842" icon={Zap} color="rose" subtext="AI Suggestions taken" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl">
                    <h3 className="font-bold mb-6 flex items-center gap-2">
                        <Zap size={18} className="text-amber-400" />
                        Automation Workflows
                    </h3>
                    <div className="space-y-4">
                        {automationWorkflows.map((flow, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-2xl group hover:border-zinc-700 transition-all cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-zinc-900 rounded-lg text-zinc-400 group-hover:text-blue-400 transition-colors">
                                        <flow.icon size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white">{flow.name}</div>
                                        <div className="text-[10px] text-zinc-500 font-bold uppercase mt-0.5">{flow.frequency}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${flow.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-500'
                                        }`}>
                                        {flow.status}
                                    </span>
                                    <ChevronRight size={16} className="text-zinc-600 group-hover:text-white transition-colors" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-3 border border-dashed border-zinc-800 rounded-2xl text-xs font-bold text-zinc-500 hover:border-zinc-600 hover:text-zinc-400 transition-all flex items-center justify-center gap-2">
                        + Create New Workflow
                    </button>
                </div>

                <div className="bg-blue-600/5 border border-blue-500/10 p-8 rounded-3xl flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold mb-2 flex items-center gap-2 text-blue-400">
                            <FileText size={18} />
                            Generate Analytics Report
                        </h3>
                        <p className="text-sm text-zinc-400 mb-8">
                            Export a comprehensive PDF report including all KPIs, traffic sources, and AI performance metrics for the current month.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
                                <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Period</div>
                                <div className="text-xs text-white">February 2026</div>
                            </div>
                            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
                                <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Format</div>
                                <div className="text-xs text-white">PDF / CSV</div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsTriggering(true)}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20"
                        >
                            {isTriggering ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Download size={20} />
                            )}
                            {isTriggering ? 'Compiling Report...' : 'Download Full Report'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
