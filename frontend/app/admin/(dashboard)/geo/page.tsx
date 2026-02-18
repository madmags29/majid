'use client';

import {
    Globe,
    Map as MapIcon,
    Navigation,
    TrendingUp,
    CheckCircle2
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

const cityData = [
    { city: 'Delhi', users: 12500, growth: '+12%' },
    { city: 'Mumbai', users: 9800, growth: '+8%' },
    { city: 'Bangalore', users: 8400, growth: '+15%' },
    { city: 'Hyderabad', users: 6200, growth: '+5%' },
    { city: 'Chennai', users: 5100, growth: '+2%' },
];

const stateData = [
    { state: 'Maharashtra', percent: 24 },
    { state: 'Delhi NCR', percent: 20 },
    { state: 'Karnataka', percent: 15 },
    { state: 'Tamil Nadu', percent: 12 },
    { state: 'Rajasthan', percent: 10 },
];

export default function GeoAnalyticsPage() {
    return (
        <div className="space-y-8">
            <div className="border-b border-slate-200 dark:border-zinc-800 pb-6">
                <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Geo Analytics</h1>
                <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium">Visualize where your traffic is originating from across India and globally</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* City Distribution Bar Chart */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Navigation className="w-5 h-5 text-blue-500" />
                        Top Cities (India)
                    </h3>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={cityData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="city" type="category" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="users" radius={[0, 8, 8, 0]}>
                                    {cityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#94a3b8'} fillOpacity={0.8} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* State Heatmap Simulation */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <MapIcon className="w-5 h-5 text-purple-500" />
                            State-wise Traffic Distribution
                        </h3>
                        <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 dark:bg-blue-500/10 px-2 py-1 rounded">Live Data</span>
                    </div>

                    <div className="flex-1 space-y-6">
                        {stateData.map((item) => (
                            <div key={item.state} className="space-y-2">
                                <div className="flex items-center justify-between text-sm font-bold">
                                    <span className="text-slate-700 dark:text-slate-200">{item.state}</span>
                                    <span>{item.percent}%</span>
                                </div>
                                <div className="w-full h-3 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000"
                                        style={{ width: `${item.percent}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-4 bg-slate-50 dark:bg-zinc-800/50 rounded-xl border border-dashed border-slate-300 dark:border-zinc-700 flex items-center gap-3">
                        <Globe className="w-5 h-5 text-slate-400" />
                        <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium leading-relaxed">
                            Global traffic is currently minimal (2.4%), primarily originating from the <span className="text-blue-600 font-bold">United States</span> and <span className="text-blue-600 font-bold">United Kingdom</span>.
                        </p>
                    </div>
                </div>
            </div>

            {/* Geo Optimization Tips */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GeoTip
                    region="Rajasthan"
                    insight="High search volume from Mumbai users for weekend getaways."
                    action="Run targeted ads"
                />
                <GeoTip
                    region="Uttarakhand"
                    insight="Spiritual tourism interest peaking in Delhi NCR."
                    action="Update Rishikesh guide"
                />
                <GeoTip
                    region="Kerala"
                    insight="Rising interest from Bangalore for monsoon escapes."
                    action="Create Munnar newsletter"
                />
            </div>
        </div>
    );
}

function GeoTip({ region, insight, action }: { region: string, insight: string, action: string }) {
    return (
        <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl group cursor-pointer hover:border-blue-500/50 transition-all">
            <div className="flex items-center gap-2 text-blue-400 font-black uppercase tracking-widest text-[10px] mb-3">
                <TrendingUp className="w-3 h-3" />
                Regional Insight
            </div>
            <h4 className="text-white font-black text-lg italic mb-2 tracking-tight uppercase underline decoration-blue-500/50 decoration-2 underline-offset-4">{region}</h4>
            <p className="text-slate-400 text-xs mb-4 leading-relaxed font-medium">{insight}</p>
            <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase">
                <CheckCircle2 className="w-3 h-3" />
                Action: {action}
            </div>
        </div>
    );
}
