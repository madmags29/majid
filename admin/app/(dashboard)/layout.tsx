'use client';

import { AdminSidebar } from "../../components/AdminSidebar";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen">
            <AdminSidebar />
            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-16 border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-40 px-8 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Dashboard</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                AD
                            </div>
                            <span className="text-sm font-medium text-slate-600 dark:text-zinc-400">Admin User</span>
                        </div>
                    </div>
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
