'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Lock, Save, Camera, Loader2, Mail, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';

const AnimatedLogo = dynamic(() => import('@/components/AnimatedLogo'), { ssr: false });

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<{ id: string, name: string, email: string, picture?: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'general' | 'security'>('general');

    // Form States
    const [name, setName] = useState('');
    const [picture, setPicture] = useState('');

    // Password States
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/');
            return;
        }

        const fetchUserData = async (token: string) => {
            try {
                const { API_URL } = await import('@/lib/config');
                const res = await fetch(`${API_URL}/api/auth/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                    setName(data.name);
                    setPicture(data.picture || '');
                } else {
                    toast.error('Failed to load profile');
                    localStorage.removeItem('token'); // Clear invalid token
                    router.push('/');
                }
            } catch (error) {
                console.error(error);
                toast.error('Connection error');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData(token);
    }, [router]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const token = localStorage.getItem('token');

        try {
            const { API_URL } = await import('@/lib/config');
            const res = await fetch(`${API_URL}/api/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, picture })
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Profile updated successfully');
                setUser(prev => ({ ...prev!, name, picture }));
                // Update local storage to reflect changes immediately in other components
                const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
                localStorage.setItem('user', JSON.stringify({ ...storedUser, name, picture }));
                window.dispatchEvent(new Event('storage'));
            } else {
                toast.error(data.message || 'Update failed');
            }
        } catch {
            toast.error('Error updating profile');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("New passwords don't match");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setSaving(true);
        const token = localStorage.getItem('token');

        try {
            const { API_URL } = await import('@/lib/config');
            const res = await fetch(`${API_URL}/api/auth/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Password changed successfully');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                toast.error(data.message || 'Change failed');
            }
        } catch {
            toast.error('Error changing password');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
            {/* Header */}
            <header className="p-6 flex items-center justify-between border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10 w-full">
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 text-slate-400 hover:text-white">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <Link href="/" className="hover:opacity-90 transition-opacity">
                        <AnimatedLogo className="w-8 h-8 text-blue-400" />
                    </Link>
                    <h1 className="text-xl font-bold text-white">Profile Settings</h1>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-6 md:p-10">
                <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
                    {/* Sidebar */}
                    <aside className="space-y-2">
                        <button
                            onClick={() => setActiveTab('general')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === 'general'
                                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                                }`}
                        >
                            <User className="w-4 h-4" /> General
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === 'security'
                                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                                }`}
                        >
                            <Shield className="w-4 h-4" /> Security
                        </button>
                    </aside>

                    {/* Content */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
                        {activeTab === 'general' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">General Information</h2>
                                    <p className="text-slate-400 text-sm">Update your profile details and public info.</p>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="relative group">
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white overflow-hidden border-4 border-slate-800 shadow-lg">
                                            {picture ? (
                                                /* eslint-disable-next-line @next/next/no-img-element */
                                                <img src={picture} alt={name} className="w-full h-full object-cover" />
                                            ) : (
                                                name.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        {/* Avatar upload placeholder - ideally implement file upload */}
                                        <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-not-allowed" title="Upload coming soon">
                                            <Camera className="w-8 h-8 text-white/80" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{name}</h3>
                                        <p className="text-slate-500 text-sm">{user.email}</p>
                                    </div>
                                </div>

                                <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-md">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Display Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full bg-slate-950 border border-slate-700/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input
                                                type="email"
                                                value={user.email}
                                                disabled
                                                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-500 cursor-not-allowed"
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500">Email cannot be changed.</p>
                                    </div>

                                    {/* Simple Avatar URL Input for now */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Avatar URL</label>
                                        <div className="relative">
                                            <Camera className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input
                                                type="url"
                                                value={picture}
                                                onChange={(e) => setPicture(e.target.value)}
                                                placeholder="https://..."
                                                className="w-full bg-slate-950 border border-slate-700/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500">Paste an image URL to update your profile picture.</p>
                                    </div>

                                    <div className="pt-4">
                                        <Button
                                            type="submit"
                                            disabled={saving}
                                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20"
                                        >
                                            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                            Save Changes
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">Security</h2>
                                    <p className="text-slate-400 text-sm">Manage your password and account security.</p>
                                </div>

                                <form onSubmit={handleChangePassword} className="space-y-6 max-w-md">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Current Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input
                                                type="password"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className="w-full bg-slate-950 border border-slate-700/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                                                required
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">New Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full bg-slate-950 border border-slate-700/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                                                required
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Confirm New Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full bg-slate-950 border border-slate-700/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                                                required
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <Button
                                            type="submit"
                                            disabled={saving}
                                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20"
                                        >
                                            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                            Update Password
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
