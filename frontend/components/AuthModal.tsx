'use client';

import { useState } from 'react';
import { X, Mail, Lock, User, Check, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { siGoogle, siFacebook, siApple } from 'simple-icons/icons';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
    const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    if (!isOpen) return null;

    const handleSocialLogin = async (provider: string) => {
        setIsLoading(true);
        try {
            // Simulating a provider response (e.g. from Google SDK)
            const mockProfile = {
                email: `user_${Date.now()}@example.com`,
                name: `Test User (${provider})`,
                provider: provider.toUpperCase(),
                providerId: `mock_${provider}_${Date.now()}`,
                picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`
            };

            const res = await fetch('http://localhost:5001/api/auth/social-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mockProfile)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Dispatch event for header update
            window.dispatchEvent(new Event('storage'));
            onClose();

        } catch (error) {
            console.error('Social Login Failed:', error);
            // Optionally show error toast
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
        const body = mode === 'login'
            ? { email, password }
            : { email, password, name: email.split('@')[0] }; // Default name from email for signup

        try {
            const res = await fetch(`http://localhost:5001${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            console.log('Auth Success:', data);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Dispatch event for header update or reload
            window.dispatchEvent(new Event('storage'));
            onClose();

        } catch (error) {
            console.error('Auth Error:', error);
            alert((error as Error).message); // Simple alert for now
        } finally {
            setIsLoading(false);
        }
    };

    // Simple Icons path data wrapper for SVG component
    const IconWrapper = ({ path, className }: { path: string, className?: string }) => (
        <svg
            role="img"
            viewBox="0 0 24 24"
            className={cn("w-5 h-5 fill-current", className)}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d={path} />
        </svg>
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white mb-2">
                            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                        </h2>
                        <p className="text-slate-400 text-sm">
                            {mode === 'login'
                                ? 'Enter your details to access your trips'
                                : 'Start your journey with us today'}
                        </p>
                    </div>

                    {/* Social Buttons */}
                    <div className="flex flex-col gap-3 mb-6">
                        <button
                            onClick={() => handleSocialLogin('Google')}
                            className="flex items-center justify-center gap-3 w-full bg-white text-slate-900 hover:bg-slate-100 font-medium py-2.5 px-4 rounded-xl transition-all active:scale-[0.98]"
                        >
                            <IconWrapper path={siGoogle.path} />
                            Continue with Google
                        </button>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => handleSocialLogin('Facebook')}
                                className="flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#1864cc] text-white font-medium py-2.5 px-4 rounded-xl transition-all active:scale-[0.98]"
                            >
                                <IconWrapper path={siFacebook.path} />
                                Facebook
                            </button>
                            <button
                                onClick={() => handleSocialLogin('Apple')}
                                className="flex items-center justify-center gap-2 bg-black hover:bg-slate-900 text-white border border-slate-800 font-medium py-2.5 px-4 rounded-xl transition-all active:scale-[0.98]"
                            >
                                <IconWrapper path={siApple.path} />
                                Apple
                            </button>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="relative flex items-center gap-4 mb-6">
                        <div className="h-px bg-slate-800 flex-1" />
                        <span className="text-xs text-slate-500 font-medium uppercase">Or continue with</span>
                        <div className="h-px bg-slate-800 flex-1" />
                    </div>

                    {/* Email Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-400 ml-1">Email address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-400 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-2.5 rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Processing...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                                    <ArrowRight className="w-4 h-4" />
                                </span>
                            )}
                        </Button>
                    </form>

                    {/* Toggle Mode */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-400">
                            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                            <button
                                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                                className="ml-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
                            >
                                {mode === 'login' ? 'Sign up' : 'Log in'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
