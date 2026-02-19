'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Search,
    UserX,
    UserCheck,
    Download,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Mail
} from 'lucide-react';
import api from '../../../lib/api';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    interface User {
        _id: string;
        name: string;
        email: string;
        googleId?: string;
        status: string;
        createdAt: string;
    }
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await api.get(`/users?page=${page}&search=${search}&status=${status}`);
            setUsers(res.data.users);
            setTotalPages(res.data.totalPages);
        } catch {
            toast.error('Failed to fetch users');
        } finally {
            setIsLoading(false);
        }
    }, [page, search, status]);

    useEffect(() => {
        fetchUsers();
    }, [page, status, search]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchUsers();
    };

    const toggleUserStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'Active' ? 'Blocked' : 'Active';
        try {
            await api.patch(`/users/${id}/status`, { status: newStatus });
            toast.success(`User successfully ${newStatus === 'Blocked' ? 'blocked' : 'unblocked'}`);
            fetchUsers();
        } catch (error) {
            console.error('Failed to update user status', error);
            toast.error('Failed to update user status');
        }
    };

    const exportToCSV = () => {
        const headers = ['Name', 'Email', 'Auth Method', 'Status', 'Registered Date'];
        const csvContent = [
            headers.join(','),
            ...users.map(u => [
                u.name,
                u.email,
                u.googleId ? 'Google' : 'Email',
                u.status,
                format(new Date(u.createdAt), 'yyyy-MM-dd')
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `users_export_${format(new Date(), 'yyyy-MM-dd')}.csv`;
        a.click();
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-white/5 pb-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">User Management</h1>
                    <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium">Monitor and manage all WeekendTravellers users</p>
                </div>
                <button
                    onClick={exportToCSV}
                    className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-white px-4 py-2 rounded-xl transition-all font-bold text-sm shadow-sm"
                >
                    <Download className="w-4 h-4" /> Export CSV
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <form onSubmit={handleSearch} className="flex-1 relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                    />
                </form>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium min-w-[150px]"
                >
                    <option value="">All Statuses</option>
                    <option value="Active">Active Only</option>
                    <option value="Blocked">Blocked Only</option>
                </select>
            </div>

            {/* Users Table */}
            <div className="glass-panel rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-200/60 dark:border-white/5">
                                <th className="px-6 py-4 text-xs font-black text-slate-500 dark:text-zinc-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-500 dark:text-zinc-500 uppercase tracking-wider">Auth Method</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-500 dark:text-zinc-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-500 dark:text-zinc-500 uppercase tracking-wider">Registered</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-500 dark:text-zinc-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                                            <p className="text-sm font-bold text-slate-500 uppercase italic">Loading users...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">No users found match your criteria.</td>
                                </tr>
                            ) : users.map((user) => (
                                <tr key={user._id} className="hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800 dark:text-white">{user.name}</div>
                                                <div className="text-xs text-slate-500 dark:text-zinc-400">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.googleId ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
                                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.335-2.887,3.821-5.445,3.821c-3.283,0-5.954-2.671-5.954-5.954s2.671-5.954,5.954-5.954c1.474,0,2.845,0.502,3.921,1.332l2.791-2.791C17.388,2.873,15.118,1.838,12.545,1.838C6.912,1.838,2.345,6.405,2.345,12.038s4.567,10.2,10.2,10.2c5.891,0,10.198-4.225,10.198-10.2c0-0.771-0.084-1.517-0.239-2.239H12.545z" />
                                                </svg>
                                                Google
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400 border border-slate-200 dark:border-white/10">
                                                <Mail className="w-3.5 h-3.5" />
                                                Email
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${user.status === 'Active'
                                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20'
                                            : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border-rose-100 dark:border-rose-500/20'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-500 dark:text-zinc-400">
                                        {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => toggleUserStatus(user._id, user.status)}
                                            className={`p-2 rounded-lg transition-all duration-200 ${user.status === 'Active'
                                                ? 'text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:shadow-sm'
                                                : 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:shadow-sm'
                                                }`}
                                            title={user.status === 'Active' ? 'Block User' : 'Unblock User'}
                                        >
                                            {user.status === 'Active' ? <UserX className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 bg-slate-50/30 dark:bg-white/5 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between">
                    <div className="text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-wide">
                        Page {page} of {totalPages}
                    </div>
                    <div className="flex gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className="p-2 border border-slate-200 dark:border-white/10 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-zinc-800 text-slate-600 dark:text-white transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                            className="p-2 border border-slate-200 dark:border-white/10 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-zinc-800 text-slate-600 dark:text-white transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
