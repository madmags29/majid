"use client";

import { useState, useEffect } from 'react';
import { Monitor, Server, Activity, Database, AlertCircle, Terminal } from 'lucide-react';
import api from '@/lib/api';
import StatsCard from '@/components/StatsCard';
import { format } from 'date-fns';

export default function MonitoringPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await api.get('/system/logs');
                setLogs(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">System Monitoring</h1>
                <p className="text-zinc-400">Track server health, terminal logs, and system latencies.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatsCard title="Server Status" value="Online" icon={Server} subtext="Vercel Deployment" />
                <StatsCard title="Avg Latency" value="142ms" icon={Activity} subtext="Success rate 99.9%" />
                <StatsCard title="DB Health" value="Healthy" icon={Database} subtext="MongoDB Atlas" />
                <StatsCard title="Error Rate" value="0.04%" icon={AlertCircle} subtext="Last 24 hours" />
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden font-mono shadow-2xl">
                <div className="bg-zinc-900 px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Terminal size={18} className="text-zinc-400" />
                        <h3 className="text-sm font-bold text-zinc-300">System Activity Logs</h3>
                    </div>
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                        <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                        <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                    </div>
                </div>
                <div className="p-6 h-[500px] overflow-y-auto space-y-2 text-xs scrollbar-hide">
                    {loading ? (
                        Array(10).fill(0).map((_, i) => <div key={i} className="h-4 bg-zinc-900 animate-pulse rounded w-3/4" />)
                    ) : logs.length === 0 ? (
                        <div className="text-zinc-600 text-center py-20 italic">No system logs recorded yet...</div>
                    ) : logs.map((log, i) => (
                        <div key={i} className="flex gap-4 group">
                            <span className="text-zinc-600 select-none">[{format(new Date(log.timestamp), 'HH:mm:ss')}]</span>
                            <span className={log.level === 'error' ? 'text-rose-400' : 'text-blue-400'}>[{log.level.toUpperCase()}]</span>
                            <span className="text-zinc-300 group-hover:text-white transition-colors">{log.message}</span>
                            {log.latency && <span className="text-zinc-600 ml-auto">{log.latency}ms</span>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
