"use client";

import { useState, useEffect } from 'react';
import { Search, Globe, TrendingUp, BarChart3, FileText, MousePointer2 } from 'lucide-react';
import api from '@/lib/api';
import StatsCard from '@/components/StatsCard';

export default function SEOPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Placeholder for real GSC/GA4 data integration
        setTimeout(() => setLoading(false), 800);
    }, []);

    const topKeywords = [
        { term: 'weekend getaways near manali', clicks: '2.4k', ctr: '4.2%' },
        { term: 'best 2 day trip itinerary', clicks: '1.8k', ctr: '3.8%' },
        { term: 'weekend travellers india', clicks: '1.2k', ctr: '5.1%' },
        { term: 'hidden gems in santorini', clicks: '980', ctr: '2.4%' },
        { term: 'ai travel planner 2026', clicks: '850', ctr: '3.6%' },
    ];

    const popularPages = [
        { path: '/', views: '12.4k', time: '4m 12s' },
        { path: '/explore', views: '8.2k', time: '3m 45s' },
        { path: '/deep-explore/manali', views: '4.1k', time: '6m 20s' },
        { path: '/trips', views: '2.8k', time: '2m 10s' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">SEO & Content Analytics</h1>
                <p className="text-zinc-400">Search performance from Google Search Console and content engagement.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatsCard title="Total Impressions" value="1.2M" icon={Globe} trend={{ value: 8, isPositive: true }} />
                <StatsCard title="Search Clicks" value="48.5k" icon={MousePointer2} trend={{ value: 14, isPositive: true }} />
                <StatsCard title="Avg Pos" value="12.4" icon={TrendingUp} trend={{ value: 2.1, isPositive: true }} />
                <StatsCard title="CTR" value="4.1%" icon={BarChart3} trend={{ value: 0.5, isPositive: true }} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
                    <h3 className="font-bold mb-6 flex items-center gap-2">
                        <Search size={18} className="text-blue-400" />
                        Top Search Queries
                    </h3>
                    <div className="space-y-4">
                        {topKeywords.map((kw, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
                                <span className="text-sm text-zinc-300">{kw.term}</span>
                                <div className="flex gap-4">
                                    <div className="text-right">
                                        <div className="text-[10px] text-zinc-500 font-bold uppercase">Clicks</div>
                                        <div className="text-xs font-bold text-white">{kw.clicks}</div>
                                    </div>
                                    <div className="text-right min-w-[50px]">
                                        <div className="text-[10px] text-zinc-500 font-bold uppercase">CTR</div>
                                        <div className="text-xs font-bold text-emerald-400">{kw.ctr}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
                    <h3 className="font-bold mb-6 flex items-center gap-2">
                        <FileText size={18} className="text-blue-400" />
                        Content Performance
                    </h3>
                    <div className="space-y-4">
                        {popularPages.map((page, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
                                <span className="text-sm text-zinc-300">{page.path}</span>
                                <div className="flex gap-4">
                                    <div className="text-right">
                                        <div className="text-[10px] text-zinc-500 font-bold uppercase">Views</div>
                                        <div className="text-xs font-bold text-white">{page.views}</div>
                                    </div>
                                    <div className="text-right min-w-[80px]">
                                        <div className="text-[10px] text-zinc-500 font-bold uppercase">Avg Time</div>
                                        <div className="text-xs font-bold text-blue-400">{page.time}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
