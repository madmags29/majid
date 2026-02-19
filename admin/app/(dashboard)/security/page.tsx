'use client';

import { useState, useEffect } from 'react';
import {
    ShieldCheck,
    Lock,
    UserCheck,
    History,
    ShieldAlert,
    FileCheck,
    Loader2
} from 'lucide-react';
import api from '../../../lib/api';
import { format } from 'date-fns';

export default function SecurityCompliancePage() {
    const [stats, setStats] = useState<SecurityStats | null>(null);
    const [logs, setLogs] = useState<SecurityLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    interface SecurityStats {
        securityScore: number;
        failedLogins: number;
        threats: Array<{ _id: string; message: string }>;
    }

    interface SecurityLog {
        message: string;
        metadata?: {
            email?: string;
            ip?: string;
        };
        timestamp: string;
        level: string;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, logsRes] = await Promise.all([
                    api.get('/stats/security'),
                    api.get('/logs?limit=5')
                ]);
                setStats(statsRes.data);
                setLogs(logsRes.data);
            } catch (error) {
                console.error('Failed to fetch security data', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    const auditLogs = logs.map((log: SecurityLog) => ({
        action: log.message,
        user: log.metadata?.email || 'System',
        ip: log.metadata?.ip || 'Internal',
        time: format(new Date(log.timestamp), 'HH:mm:ss'),
        status: log.level === 'error' ? 'Alert' : 'Success'
    }));

    return (
        <div className="space-y-8">
            <div className="border-b border-slate-200 dark:border-zinc-800 pb-6">
                <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Security & Compliance</h1>
                <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium">Manage access controls, audit logs, and GDPR data requests</p>
            </div>

            {/* Security Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SecurityCard
                    title="Security Score"
                    value={`${stats?.securityScore || 100}/100`}
                    icon={<ShieldCheck className="w-5 h-5 text-emerald-500" />}
                    status="Good"
                />
                <SecurityCard
                    title="Active Admins"
                    value="1"
                    icon={<UserCheck className="w-5 h-5 text-blue-500" />}
                    status="Verified"
                />
                <SecurityCard
                    title="Failed Logins"
                    value={stats?.failedLogins || '0'}
                    icon={<Lock className="w-5 h-5 text-amber-500" />}
                    status="Normal"
                />
                <SecurityCard
                    title="GDPR Requests"
                    value="0"
                    icon={<FileCheck className="w-5 h-5 text-purple-500" />}
                    status="Clean"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Audit Logs Table */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <History className="w-5 h-5 text-slate-500" />
                        Admin Audit Logs
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-zinc-800">
                                    <th className="pb-4">Action</th>
                                    <th className="pb-4">User / IP</th>
                                    <th className="pb-4">Time</th>
                                    <th className="pb-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-zinc-800 text-sm font-medium">
                                {auditLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-8 text-center text-slate-400 italic">No recent audit logs.</td>
                                    </tr>
                                ) : auditLogs.map((log: { action: string; user: string; ip: string; time: string; status: string }, i: number) => (
                                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors group">
                                        <td className="py-4 font-bold text-slate-700 dark:text-zinc-300">{log.action}</td>
                                        <td className="py-4 flex flex-col">
                                            <span>{log.user}</span>
                                            <span className="text-[10px] text-slate-400 font-mono">{log.ip}</span>
                                        </td>
                                        <td className="py-4 text-slate-500 text-xs font-mono">{log.time}</td>
                                        <td className="py-4 text-right">
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${log.status === 'Alert' ? 'bg-rose-500 text-white' :
                                                log.status === 'Success' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                {log.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Threat Prevention Panel */}
                <div className="bg-slate-950 border border-white/5 p-6 rounded-2xl space-y-6">
                    <h3 className="text-white font-black uppercase italic tracking-tighter text-lg flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-rose-500" />
                        Threat Prevention
                    </h3>
                    <div className="space-y-4">
                        {stats?.threats && stats.threats.length > 0 ? stats.threats.map((threat: { _id: string; message: string }) => (
                            <ThreatCard key={threat._id} title="Blocked Blocked" desc={threat.message} type="warning" />
                        )) : (
                            <div className="text-slate-500 text-xs italic text-center py-4">No active threats detected. System secure.</div>
                        )}
                    </div>
                    <div className="pt-6 border-t border-white/5">
                        <h4 className="text-xs font-black uppercase text-slate-500 tracking-widest mb-4">RBAC Roles</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-300 font-bold italic">Super Admin</span>
                                <span className="text-emerald-400 font-black">All Access</span>
                            </div>
                            <div className="flex justify-between items-center text-xs opacity-50">
                                <span className="text-slate-300 font-bold italic">Editor</span>
                                <span className="text-slate-400 font-black">Content Only</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SecurityCard({ title, value, icon, status }: { title: string, value: string | number, icon: React.ReactNode, status: string }) {
    return (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-slate-500 dark:text-zinc-400 uppercase tracking-widest">{title}</span>
                {icon}
            </div>
            <div className="text-2xl font-black text-slate-800 dark:text-white">{value}</div>
            <div className="mt-2 text-[10px] font-black uppercase text-emerald-500 flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                {status}
            </div>
        </div>
    );
}

function ThreatCard({ title, desc, type }: { title: string, desc: string, type: string }) {
    return (
        <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-1 group hover:border-blue-500/30 transition-all">
            <h4 className={`text-xs font-black uppercase ${type === 'warning' ? 'text-rose-500' : 'text-blue-400'
                }`}>{title}</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed italic">&quot;{desc}&quot;</p>
        </div>
    );
}
