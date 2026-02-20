'use client';

import { useState, useEffect } from 'react';
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
    LogOut,
    ChevronLeft,
    Menu
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
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsMobile(true);
                setIsCollapsed(true);
            } else {
                setIsMobile(false);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
    };

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <aside
            className={cn(
                "bg-[#09090b] text-slate-300 flex flex-col h-screen sticky top-0 border-r border-white/5 shadow-2xl z-50 transition-all duration-300 ease-in-out",
                isCollapsed ? "w-20" : "w-72"
            )}
        >
            {/* Logo Section */}
            <div className={cn("p-6 flex items-center justify-between", isCollapsed ? "flex-col gap-4" : "gap-3")}>
                <Link href="/" className="flex items-center gap-3 group shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/20 group-hover:scale-105 transition-transform duration-300">
                        <Zap className="text-white w-6 h-6" />
                    </div>
                    <div className={cn("transition-all duration-300 overflow-hidden", isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>
                        <h1 className="text-white font-bold text-xl tracking-tight leading-none whitespace-nowrap">WT Admin</h1>
                        <p className="text-xs text-slate-500 font-medium mt-0.5 whitespace-nowrap">Control Center</p>
                    </div>
                </Link>
                <button
                    onClick={toggleSidebar}
                    className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-colors"
                >
                    {isCollapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-hide">
                {!isCollapsed && (
                    <div className="px-4 mb-2">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Main Menu</p>
                    </div>
                )}
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={isCollapsed ? item.label : ""}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                isActive
                                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-900/20 font-semibold"
                                    : "hover:bg-zinc-900/50 hover:text-white",
                                isCollapsed && "justify-center"
                            )}
                        >
                            {/* Hover light effect for non-active items */}
                            {!isActive && (
                                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}

                            <item.icon className={cn(
                                "w-5 h-5 transition-transform group-hover:scale-110 duration-200 shrink-0",
                                isActive ? "text-white" : "text-slate-500 group-hover:text-indigo-400"
                            )} />
                            <span className={cn(
                                "text-sm transition-all duration-300 overflow-hidden whitespace-nowrap",
                                isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                            )}>
                                {item.label}
                            </span>

                            {/* Active indicator dot */}
                            {isActive && !isCollapsed && (
                                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile / Logout */}
            <div className={cn(
                "p-4 m-4 mt-2 bg-zinc-900/30 rounded-2xl border border-white/5 overflow-hidden transition-all duration-300",
                isCollapsed ? "p-2 m-2" : "p-4 m-4"
            )}>
                <div className={cn("flex items-center gap-3 mb-4", isCollapsed ? "justify-center" : "px-2")}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0">
                        AD
                    </div>
                    <div className={cn("flex-1 min-w-0 transition-all duration-300", isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>
                        <p className="text-sm font-bold text-white truncate">Admin User</p>
                        <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Online
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    title={isCollapsed ? "Sign Out" : ""}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2.5 w-full rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 text-sm font-semibold border border-red-500/20 hover:border-red-500 hover:shadow-lg hover:shadow-red-900/20",
                        isCollapsed ? "justify-center px-0" : "justify-center"
                    )}
                >
                    <LogOut className="w-4 h-4 shrink-0" />
                    <span className={cn(
                        "transition-all duration-300 overflow-hidden whitespace-nowrap",
                        isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                    )}>
                        Sign Out
                    </span>
                </button>
            </div>
        </aside>
    );
}
