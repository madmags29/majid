'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    MousePointerClick,
    Bot,
    BarChart3,
    Filter,
    Globe,
    Activity,
    Search,
    DollarSign,
    Zap,
    ShieldCheck,
    LogOut
} from 'lucide-react';
import { cn } from '../lib/utils';

const menuItems = [
    { label: 'Overview', icon: LayoutDashboard, href: '/' },
    { label: 'User Management', icon: Users, href: '/user-management' },
    { label: 'Activity Tracking', icon: MousePointerClick, href: '/tracking' },
    { label: 'AI Monitoring', icon: Bot, href: '/ai' },
    { label: 'Traffic Analytics', icon: BarChart3, href: '/traffic' },
    { label: 'Conversion Funnel', icon: Filter, href: '/funnel' },
    { label: 'Geo Analytics', icon: Globe, href: '/geo' },
    { label: 'System Monitoring', icon: Activity, href: '/monitoring' },
    { label: 'SEO & Content', icon: Search, href: '/seo' },
    { label: 'Revenue', icon: DollarSign, href: '/revenue' },
    { label: 'Growth', icon: Zap, href: '/growth' },
    { label: 'Security', icon: ShieldCheck, href: '/security' },
];

export function AdminSidebar() {
    const pathname = usePathname();

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
    };

    return (
        <aside className="w-72 bg-[#09090b] text-slate-300 flex flex-col h-screen sticky top-0 border-r border-white/5 shadow-2xl z-50">
            {/* Logo Section */}
            <div className="p-8 pb-6">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/20 group-hover:scale-105 transition-transform duration-300">
                        <Zap className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-white font-bold text-xl tracking-tight leading-none">WT Admin</h1>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">Control Center</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800">
                <div className="px-4 mb-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Main Menu</p>
                </div>
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                isActive
                                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-900/20 font-semibold"
                                    : "hover:bg-zinc-900/50 hover:text-white"
                            )}
                        >
                            {/* Hover light effect for non-active items */}
                            {!isActive && (
                                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}

                            <item.icon className={cn(
                                "w-5 h-5 transition-transform group-hover:scale-110 duration-200",
                                isActive ? "text-white" : "text-slate-500 group-hover:text-indigo-400"
                            )} />
                            <span className="text-sm">{item.label}</span>

                            {/* Active indicator dot */}
                            {isActive && (
                                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile / Logout */}
            <div className="p-4 m-4 mt-2 bg-zinc-900/30 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                        AD
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">Admin User</p>
                        <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Online
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 w-full rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 text-sm font-semibold border border-red-500/20 hover:border-red-500 hover:shadow-lg hover:shadow-red-900/20"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
