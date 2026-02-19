'use client';

import { AdminSidebar } from "../../components/AdminSidebar";
import { Bell } from 'lucide-react';

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-[#09090b]">
            <AdminSidebar />
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800">
                <header className="h-16 border-b border-slate-200/60 dark:border-white/5 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-xl sticky top-0 z-40 px-8 flex items-center justify-between transition-all duration-300">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Dashboard Overview</h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-slate-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-white/5">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-[#09090b]" />
                        </button>
                    </div>
                </header>
                <div className="p-8 pb-20 max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
