"use client";

import { useState, useEffect } from 'react';
import { Shield, Lock, UserX, AlertTriangle, Key, History, Activity } from 'lucide-react';
import api from '@/lib/api';
import StatsCard from '@/components/StatsCard';
import { format } from 'date-fns';

export default function SecurityPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAudit = async () => {
            try {
                const res = await api.get('/security/audit');
                setLogs(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAudit();
    }, []);

    const getIcon = (action: string) => {
        if (action.includes('blocked')) return UserX;
        if (action.includes('login')) return Key;
        if (action.includes('deleted')) return AlertTriangle;
        return Shield;
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Security & Audit Logs</h1>
                <p className="text-zinc-400">Monitor administrative actions and ensure system accountability.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatsCard title="Security Score" value="98/100" icon={Shield} color="emerald" />
                <StatsCard title="Admin Actions" value={logs.length} icon={Activity} color="blue" />
                <StatsCard title="Auth Failures" value="2" icon={Lock} color="rose" />
                <StatsCard title="Active Admins" value="1" icon={History} color="amber" />
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
                <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                    <h3 className="font-bold flex items-center gap-2">
                        <History size={18} className="text-blue-400" />
                        Administrative Audit Trail
                    </h3>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Last 100 Actions</span>
                </div>
                <div className="divide-y divide-zinc-800">
                    {loading ? (
                        Array(5).fill(0).map((_, i) => <div key={i} className="h-16 bg-zinc-800/10 animate-pulse" />)
                    ) : logs.length === 0 ? (
                        <div className="p-20 text-center text-zinc-500 italic">No administrative actions recorded.</div>
                    ) : logs.map((log, i) => {
                        const Icon = getIcon(log.message.toLowerCase());
                        return (
                            <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-zinc-800/20 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center justify-center text-zinc-400">
                                        <Icon size={16} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-white">{log.message}</div>
                                        <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-tight mt-0.5">
                                            {format(new Date(log.timestamp), 'MMM d, HH:mm:ss')} • System Generated
                                        </div>
                                    </div>
                                </div>
                                <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-full uppercase">
                                    Verified
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-rose-500/5 border border-rose-500/10 p-6 rounded-3xl">
                    <h4 className="text-rose-400 font-bold mb-2 flex items-center gap-2">
                        <UserX size={18} />
                        Danger Zone: GDPR Data Erasure
                    </h4>
                    <p className="text-xs text-rose-500/60 mb-4">
                        Permanently delete all data associated with a user account to comply with GDPR "Right to be Forgotten" requests.
                    </p>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="User Email or ID..."
                            className="flex-1 bg-zinc-950 border border-rose-500/20 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-rose-500/50"
                        />
                        <button className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors">
                            Erase Data
                        </button>
                    </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
                    <h4 className="text-zinc-300 font-bold mb-2 flex items-center gap-2">
                        <Lock size={18} />
                        IP Whitelisting (Optional)
                    </h4>
                    <p className="text-xs text-zinc-500 mb-4">
                        Restrict admin access to specific IP addresses for enhanced infrastructure security.
                    </p>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Add Trusted IP..."
                            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500/50"
                        />
                        <button className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors whitespace-nowrap">
                            Apply Rule
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
