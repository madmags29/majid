'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    MoreVertical,
    UserX,
    UserCheck,
    Download,
    ChevronLeft,
    ChevronRight,
    Loader2
} from 'lucide-react';
import api from '../../../../lib/admin/api';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function UserManagementPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const res = await api.get(`/users?page=${page}&search=${search}&status=${status}`);
            setUsers(res.data.users);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, status]);

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
            toast.error('Failed to update user status');
        }
    };

    const exportToCSV = () => {
        const headers = ['Name', 'Email', 'Status', 'Registered Date'];
        const csvContent = [
            headers.join(','),
            ...users.map(u => [u.name, u.email, u.status, format(new Date(u.createdAt), 'yyyy-MM-dd')].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `users_export_${format(new Date(), 'yyyy-MM-dd')}.csv`;
        a.click();
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">User Management</h1>
                    <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium">Monitor and manage all WeekendTravellers users</p>
                </div>
                <button
                    onClick={exportToCSV}
                    className="flex items-center gap-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-white px-4 py-2 rounded-xl transition-colors font-bold text-sm"
                >
                    <Download className="w-4 h-4" /> Export CSV
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <form onSubmit={handleSearch} className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                    />
                </form>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium min-w-[150px]"
                >
                    <option value="">All Statuses</option>
                    <option value="Active">Active Only</option>
                    <option value="Blocked">Blocked Only</option>
                </select>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-zinc-800/50 border-b border-slate-200 dark:border-zinc-800">
                                <th className="px-6 py-4 text-xs font-black text-slate-500 dark:text-zinc-400 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Registered</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-500 dark:text-zinc-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                                            <p className="text-sm font-bold text-slate-500 uppercase italic">Loading users...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">No users found match your criteria.</td>
                                </tr>
                            ) : users.map((user) => (
                                <tr key={user._id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800 dark:text-white">{user.name}</div>
                                                <div className="text-xs text-slate-500 dark:text-zinc-400">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${user.status === 'Active'
                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                                            : 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-zinc-400">
                                        {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => toggleUserStatus(user._id, user.status)}
                                            className={`p-2 rounded-lg transition-colors ${user.status === 'Active'
                                                ? 'text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10'
                                                : 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'
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
                <div className="px-6 py-4 bg-slate-50/50 dark:bg-zinc-800/10 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between">
                    <div className="text-xs font-medium text-slate-500">
                        Page {page} of {totalPages}
                    </div>
                    <div className="flex gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className="p-1.5 border border-slate-200 dark:border-zinc-800 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-zinc-800"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                            className="p-1.5 border border-slate-200 dark:border-zinc-800 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-zinc-800"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
