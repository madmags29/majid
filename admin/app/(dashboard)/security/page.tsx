'use client';

import {
    ShieldCheck,
    Lock,
    UserCheck,
    Eye,
    AlertTriangle,
    History,
    ShieldAlert,
    FileCheck
} from 'lucide-react';

const auditLogs = [
    { action: 'Admin Login', user: 'Majid Khan', ip: '192.168.1.1', time: '5 mins ago', status: 'Success' },
    { action: 'User Blocked', user: 'System (Auto)', target: 'spammer@mail.com', time: '12 mins ago', status: 'Success' },
    { action: 'Database Config Update', user: 'Admin Main', ip: '10.0.0.45', time: '1h 12m ago', status: 'Pending Review' },
    { action: 'Failed Login Attempt', user: 'Unknown', ip: '45.12.3.99', time: '2h 45m ago', status: 'Alert' },
    { action: 'Exported User Data', user: 'Majid Khan', ip: '192.168.1.1', time: '3h 10m ago', status: 'Logged' },
];

export default function SecurityCompliancePage() {
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
                    value="94/100"
                    icon={<ShieldCheck className="w-5 h-5 text-emerald-500" />}
                    status="Good"
                />
                <SecurityCard
                    title="Active Admins"
                    value="2"
                    icon={<UserCheck className="w-5 h-5 text-blue-500" />}
                    status="Verified"
                />
                <SecurityCard
                    title="Login Attempts (24h)"
                    value="142"
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
                                {auditLogs.map((log, i) => (
                                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors group">
                                        <td className="py-4 font-bold text-slate-700 dark:text-zinc-300">{log.action}</td>
                                        <td className="py-4 flex flex-col">
                                            <span>{log.user}</span>
                                            <span className="text-[10px] text-slate-400 font-mono">{log.ip || log.target}</span>
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
                        <ThreatCard title="Rate Limiting" desc="IP: 45.x.x.99 blocked for 24h (Brute Force attempt)" type="warning" />
                        <ThreatCard title="SQL Injection Blocked" desc="Payload detected in /api/search. Automatically sanitized." type="info" />
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

function SecurityCard({ title, value, icon, status }: { title: string, value: string, icon: React.ReactNode, status: string }) {
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
            <p className="text-slate-400 text-[11px] leading-relaxed italic">"{desc}"</p>
        </div>
    );
}
