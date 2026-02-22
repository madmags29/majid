'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Mail, Lock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { siGoogle } from 'simple-icons/icons';
import { useGoogleLogin } from '@react-oauth/google';

import { GOOGLE_CLIENT_ID } from '@/lib/config';
import { GoogleOAuthProvider } from '@react-oauth/google';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'login' | 'signup';
}

function AuthModalContent({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
    const [mode, setMode] = useState<'login' | 'signup' | 'forgot-password'>(initialMode);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const login = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: async (tokenResponse) => {
            setIsLoading(true);
            try {
                const { API_URL } = await import('@/lib/config');
                const res = await fetch(`${API_URL}/api/auth/google`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        code: tokenResponse.code,
                        redirect_uri: 'postmessage'
                    })
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.message);

                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // Dispatch event for header update
                window.dispatchEvent(new Event('storage'));
                onClose();

            } catch (error) {
                console.error('Google Auth Failed:', error);
                alert('Google Sign-In failed. Please try again.');
            } finally {
                setIsLoading(false);
            }
        },
        onError: () => {
            console.error('Google Login Failed');
            setIsLoading(false);
        }
    });

    if (!isOpen) return null;

    const handleSocialLogin = async (provider: string) => {
        if (provider === 'Google') {
            login();
            return;
        }

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

            const { API_URL } = await import('@/lib/config');
            const res = await fetch(`${API_URL}/api/auth/social-login`, {
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

        try {
            const { API_URL } = await import('@/lib/config');

            if (mode === 'forgot-password') {
                const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.message);

                alert('If an account exists, a password reset link has been sent to your email.');
                setMode('login'); // Return to login
                return;
            }

            const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
            const body = mode === 'login'
                ? { email, password }
                : { email, password, name };

            const res = await fetch(`${API_URL}${endpoint}`, {
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

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!isOpen || !mounted) return null;

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

    return createPortal(
        <div className="fixed inset-0 z-[99999999] overflow-y-auto overflow-x-hidden">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            <div className="flex min-h-screen items-center justify-center p-4 sm:p-6">
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
                                {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
                            </h2>
                            <p className="text-slate-400 text-sm">
                                {mode === 'login'
                                    ? 'Enter your details to access your trips'
                                    : mode === 'signup'
                                        ? 'Start your journey with us today'
                                        : 'Enter your email to receive a reset link'}
                            </p>
                        </div>

                        {mode !== 'forgot-password' && (
                            <>
                                {/* Social Buttons */}
                                <div className="flex flex-col gap-3 mb-6">
                                    <button
                                        onClick={() => handleSocialLogin('Google')}
                                        className="flex items-center justify-center gap-3 w-full bg-white text-slate-900 hover:bg-slate-100 font-medium py-2.5 px-4 rounded-xl transition-all active:scale-[0.98]"
                                    >
                                        <IconWrapper path={siGoogle.path} />
                                        Continue with Google
                                    </button>


                                </div>

                                {/* Divider */}
                                <div className="relative flex items-center gap-4 mb-6">
                                    <div className="h-px bg-slate-800 flex-1" />
                                    <span className="text-xs text-slate-500 font-medium uppercase">Or continue with</span>
                                    <div className="h-px bg-slate-800 flex-1" />
                                </div>
                            </>
                        )}

                        {/* Email Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {mode === 'signup' && (
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-400 ml-1">Full Name</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                                            <span className="text-slate-500 text-xs font-bold">Aa</span>
                                        </div>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="John Doe"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-base text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-400 ml-1">Email address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-base text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {mode !== 'forgot-password' && (
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center ml-1">
                                        <label className="text-xs font-medium text-slate-400">Password</label>
                                        <button
                                            type="button"
                                            onClick={() => setMode('forgot-password')}
                                            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-base text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

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
                                        {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
                                        <ArrowRight className="w-4 h-4" />
                                    </span>
                                )}
                            </Button>
                        </form>

                        {/* Toggle Mode */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-slate-400">
                                {mode === 'forgot-password' ? (
                                    <>
                                        <button
                                            onClick={() => setMode('login')}
                                            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                                        >
                                            Back to Login
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                                        <button
                                            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                                            className="ml-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
                                        >
                                            {mode === 'login' ? 'Sign up' : 'Log in'}
                                        </button>
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default function AuthModal(props: AuthModalProps) {
    if (!props.isOpen) return null;

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <AuthModalContent {...props} />
        </GoogleOAuthProvider>
    );
}
