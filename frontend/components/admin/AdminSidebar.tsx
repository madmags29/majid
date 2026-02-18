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
import { cn } from '../../lib/admin/utils';

const menuItems = [
    { label: 'Overview', icon: LayoutDashboard, href: '/admin' },
    { label: 'User Management', icon: Users, href: '/admin/user-management' },
    { label: 'Activity Tracking', icon: MousePointerClick, href: '/admin/tracking' },
    { label: 'AI Monitoring', icon: Bot, href: '/admin/ai' },
    { label: 'Traffic Analytics', icon: BarChart3, href: '/admin/traffic' },
    { label: 'Conversion Funnel', icon: Filter, href: '/admin/funnel' },
    { label: 'Geo Analytics', icon: Globe, href: '/admin/geo' },
    { label: 'System Monitoring', icon: Activity, href: '/admin/monitoring' },
    { label: 'SEO & Content', icon: Search, href: '/admin/seo' },
    { label: 'Revenue', icon: DollarSign, href: '/admin/revenue' },
    { label: 'Growth Automation', icon: Zap, href: '/admin/growth' },
    { label: 'Security', icon: ShieldCheck, href: '/admin/security' },
];

export function AdminSidebar() {
    const pathname = usePathname();

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
    };

    return (
        <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800">
            <div className="p-6">
                <Link href="/admin" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Zap className="text-white w-5 h-5" />
                    </div>
                    <span className="text-white font-bold text-lg tracking-tight">WT Admin</span>
                </Link>
            </div>

            <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group",
                                isActive
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-slate-900 hover:text-white"
                            )}
                        >
                            <item.icon className={cn(
                                "w-5 h-5",
                                isActive ? "text-white" : "text-slate-500 group-hover:text-blue-400"
                            )} />
                            <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-slate-400 hover:bg-red-950 hover:text-red-400 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
}
