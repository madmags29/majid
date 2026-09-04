'use client';

import { useState } from 'react';
import { Zap, Lock, Mail, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

            const res = await axios.post(`${apiUrl}/auth/login`, formData);

            const { token, user } = res.data;

            // Reject non-admin users
            if (!user?.isAdmin) {
                toast.error('Access denied. You do not have admin privileges.');
                setIsLoading(false);
                return;
            }

            localStorage.setItem('adminToken', token);
            document.cookie = `adminToken=${token}; path=/; max-age=604800; samesite=lax`;
            toast.success('Login successful! Welcome to the Admin Panel.');

            // Use hard navigation so the browser sends the cookie to middleware
            window.location.href = '/';
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8 bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-2xl">
                <div className="text-center">
                    <div className="mx-auto w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-4">
                        <Zap className="text-white w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Admin Portal</h2>
                    <p className="mt-2 text-slate-400 text-sm font-medium">Please sign in to your administrative account</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                                placeholder="Admin Email"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-900/40 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log In to Dashboard'}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <p className="text-xs text-slate-500 font-medium">
                        Secure administrative access only. <br />
                        Unauthorized attempts are logged and monitored.
                    </p>
                </div>
            </div>
        </div>
    );
}
