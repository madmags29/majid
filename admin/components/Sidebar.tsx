"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard, Users, Activity, Brain, BarChart3,
    PieChart, Map, ShieldCheck, Search, DollarSign,
    Settings, LogOut, TrendingUp, Monitor
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const menuItems = [
    { name: 'Overview', href: '/', icon: LayoutDashboard },
    { name: 'User Management', href: '/user-management', icon: Users },
    { name: 'User Tracking', href: '/tracking', icon: Activity },
    { name: 'AI Monitoring', href: '/ai', icon: Brain },
    { name: 'Traffic Analytics', href: '/traffic', icon: BarChart3 },
    { name: 'Conversion Funnel', href: '/funnel', icon: TrendingUp },
    { name: 'Geo Analytics', href: '/geo', icon: Map },
    { name: 'System Monitoring', href: '/monitoring', icon: Monitor },
    { name: 'SEO & Content', href: '/seo', icon: Search },
    { name: 'Revenue', href: '/revenue', icon: DollarSign },
    { name: 'Security', href: '/security', icon: ShieldCheck },
    { name: 'Growth', href: '/growth', icon: PieChart },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col h-screen fixed left-0 top-0">
            <div className="p-6">
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white italic">
                        WT
                    </div>
                    <span className="text-white font-bold text-lg tracking-tight">WT Admin</span>
                </div>

                <nav className="space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all",
                                pathname === item.href
                                    ? "bg-blue-600/10 text-blue-400 font-medium"
                                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                            )}
                        >
                            <item.icon size={18} />
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="mt-auto p-6 border-t border-zinc-900">
                <button
                    onClick={() => {
                        localStorage.removeItem('adminToken');
                        window.location.href = '/login';
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-red-400 hover:bg-red-400/5 transition-all w-full"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </aside>
    );
}
