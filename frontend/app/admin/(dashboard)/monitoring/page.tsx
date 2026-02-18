'use client';

import { useState, useEffect } from 'react';
import {
    Activity,
    Server,
    Cpu,
    Layers,
    Terminal,
    AlertTriangle,
    CheckCircle,
    Info,
    Filter
} from 'lucide-react';
import api from '../../../../lib/admin/api';
import { format } from 'date-fns';

export default function SystemMonitoringPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState({ level: '', context: '' });

    useEffect(() => {
        const fetchLogs = async () => {
            setIsLoading(true);
            try {
                const res = await api.get(`/logs?level=${filter.level}&context=${filter.context}`);
                setLogs(res.data);
            } catch (error) {
                console.error('Failed to fetch logs');
            } finally {
                setIsLoading(false);
            }
        };
        fetchLogs();
    }, [filter]);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">System Monitoring</h1>
                    <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium">Real-time server status and application error logs</p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-xs font-black text-emerald-600 uppercase">Server Online</span>
                </div>
            </div>

            {/* Performance Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PerformanceCard title="API Latency" value="124ms" status="Optimal" icon={<Zap className="w-4 h-4 text-blue-500" />} />
                <PerformanceCard title="CPU Usage" value="12%" status="Low" icon={<Cpu className="w-4 h-4 text-purple-500" />} />
                <PerformanceCard title="Uptime" value="99.98%" status="Exceeds SLA" icon={<Activity className="w-4 h-4 text-emerald-500" />} />
            </div>

            {/* Logs Viewer */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                <div className="p-4 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/30 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-800 dark:text-white font-bold">
                        <Terminal className="w-4 h-4" />
                        System Logs
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            value={filter.level}
                            onChange={(e) => setFilter({ ...filter, level: e.target.value })}
                            className="bg-transparent border border-slate-200 dark:border-zinc-700 rounded-lg text-xs font-bold px-2 py-1 outline-none"
                        >
                            <option value="">All Levels</option>
                            <option value="info">Info</option>
                            <option value="warn">Warn</option>
                            <option value="error">Error</option>
                        </select>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto font-mono text-xs p-4 space-y-2 max-h-[600px]">
                    {isLoading ? (
                        <div className="text-center py-12 text-slate-400 animate-pulse font-bold uppercase tracking-widest italic">Interrogating log database...</div>
                    ) : logs.length === 0 ? (
                        <div className="text-center py-12 text-slate-500 italic">No logs matched your filters in the last 24 hours.</div>
                    ) : logs.map((log) => (
                        <div key={log._id} className="flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-zinc-800/50 p-1.5 rounded transition-colors group">
                            <span className="text-slate-400 w-32 shrink-0">{format(new Date(log.timestamp), 'HH:mm:ss.SSS')}</span>
                            <span className={`uppercase font-black w-12 shrink-0 ${log.level === 'error' ? 'text-rose-500' : log.level === 'warn' ? 'text-amber-500' : 'text-blue-500'
                                }`}>{log.level}</span>
                            <span className="text-slate-400 w-24 shrink-0">[{log.context}]</span>
                            <span className="text-slate-700 dark:text-zinc-300 flex-1">{log.message}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function PerformanceCard({ title, value, status, icon }: { title: string, value: string, status: string, icon: React.ReactNode }) {
    return (
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-slate-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest">{title}</span>
                {icon}
            </div>
            <div className="text-2xl font-black text-slate-800 dark:text-white">{value}</div>
            <div className="mt-2 text-[10px] font-black uppercase text-emerald-500 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                {status}
            </div>
        </div>
    );
}

function Zap(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
    );
}
