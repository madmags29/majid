"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Mail, Lock, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

export default function LoginPage() {
    const [identifier, setIdentifier] = useState(''); // Email or username
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Re-using the existing backend auth login for initial access
            // but we'll check if the user is an admin
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL?.replace('/admin', '')}/auth/login`, {
                email: identifier,
                password
            });

            const { token, user } = res.data;

            // In a real production app, the backend should only issue tokens for admins on an /admin/login route
            // For now, we verify isAdmin from the response (or we should have an admin-specific backend check)

            // Re-verify with an admin-only endpoint to be sure
            const adminCheck = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/stats/overview`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (adminCheck.data.success) {
                localStorage.setItem('adminToken', token);
                localStorage.setItem('adminUser', JSON.stringify(user));
                toast.success('Welcome back, Admin!');
                router.push('/');
            } else {
                toast.error('Unauthorized access. Admin privileges required.');
            }

        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Login failed. Please check credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-2xl shadow-blue-600/20">
                        <ShieldCheck size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">WT Admin Console</h1>
                    <p className="text-zinc-500">Secure entry for weekendtravellers.com</p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-3.5 text-zinc-500" size={18} />
                                <input
                                    type="email"
                                    placeholder="admin@weekendtravellers.com"
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 transition-all"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-3.5 text-zinc-500" size={18} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 transition-all"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Enter Dashboard'}
                        </button>
                    </form>
                </div>

                <p className="mt-8 text-center text-zinc-600 text-sm">
                    Protected by Weekend Travellers Security Systems.
                </p>
            </div>
        </div>
    );
}
