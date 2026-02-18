"use client";

import { useState, useEffect } from 'react';
import {
    Search, Filter, ChevronLeft, ChevronRight,
    MoreVertical, UserCheck, UserX, ExternalLink, Download
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface User {
    _id: string;
    name: string;
    email: string;
    status: 'active' | 'blocked';
    picture?: string;
    device?: string;
    tripsGenerated?: number;
    createdAt: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/users?page=${page}&search=${search}`);
            setUsers(res.data.data);
            setTotalPages(res.data.pagination.pages);
        } catch (err) {
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, search]);

    const handleStatusUpdate = async (userId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
        try {
            await api.patch(`/users/${userId}/status`, { status: newStatus });
            toast.success(`User ${newStatus === 'active' ? 'unblocked' : 'blocked'} successfully`);
            fetchUsers();
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">User Management</h1>
                    <p className="text-zinc-400">Total registered users and their activity status.</p>
                </div>
                <button
                    onClick={() => toast.info("Exporting to CSV...")}
                    className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl text-sm hover:bg-zinc-800 transition-all font-medium"
                >
                    <Download size={16} />
                    Export CSV
                </button>
            </div>

            {/* Filters */}
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-3 text-zinc-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-all"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>
                <button className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-4 py-2 rounded-xl text-sm hover:bg-zinc-900 transition-all text-zinc-400">
                    <Filter size={16} />
                    Filters
                </button>
            </div>

            {/* Users Table */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-500 uppercase text-[11px] font-bold">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Device</th>
                                <th className="px-6 py-4">Trips</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-6 py-8 h-12 bg-zinc-800/20" />
                                    </tr>
                                ))
                            ) : users.map((user) => (
                                <tr key={user._id} className="hover:bg-zinc-800/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-zinc-400 overflow-hidden">
                                                {user.picture ? <img src={user.picture} alt="" className="w-full h-full object-cover" /> : user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-white group-hover:text-blue-400 transition-colors">{user.name}</div>
                                                <div className="text-zinc-500 text-xs">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${user.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-400">{user.device || '-'}</td>
                                    <td className="px-6 py-4 text-white font-medium">{user.tripsGenerated || 0}</td>
                                    <td className="px-6 py-4 text-zinc-500">{format(new Date(user.createdAt), 'MMM d, yyyy')}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleStatusUpdate(user._id, user.status)}
                                                className={`p-2 rounded-lg transition-colors ${user.status === 'active' ? 'text-zinc-500 hover:text-rose-400 hover:bg-rose-400/5' : 'text-zinc-500 hover:text-emerald-400 hover:bg-emerald-400/5'
                                                    }`}
                                                title={user.status === 'active' ? 'Block User' : 'Unblock User'}
                                            >
                                                {user.status === 'active' ? <UserX size={18} /> : <UserCheck size={18} />}
                                            </button>
                                            <button className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                                                <ExternalLink size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between">
                    <span className="text-xs text-zinc-500">Page {page} of {totalPages}</span>
                    <div className="flex gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg disabled:opacity-30 hover:bg-zinc-800 transition-all"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                            className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg disabled:opacity-30 hover:bg-zinc-800 transition-all"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
