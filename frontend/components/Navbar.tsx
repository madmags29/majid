'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Calendar, LogIn, LogOut, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import dynamic from 'next/dynamic';
import { toast } from 'sonner';

const AnimatedLogo = dynamic(() => import('@/components/AnimatedLogo'), { ssr: false });
const AuthModal = dynamic(() => import('@/components/AuthModal'), { ssr: false });
const TypewriterText = dynamic(() => import('@/components/TypewriterText'), { ssr: false });

interface NavbarProps {
    className?: string;
    showBackButton?: boolean;
    backUrl?: string;
    title?: string;
    subtitle?: string;
    showLogo?: boolean;
    actions?: React.ReactNode;
    transparent?: boolean;
}

export default function Navbar({
    className,
    showBackButton = false,
    backUrl,
    title,
    subtitle,
    showLogo = true,
    actions,
    transparent = false
}: NavbarProps) {
    const router = useRouter();
    const [user, setUser] = useState<{ name: string; email: string; isAdmin?: boolean } | null>(null);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

    useEffect(() => {
        const checkUser = () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error('Error parsing stored user:', e);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };

        checkUser();
        window.addEventListener('storage', checkUser);
        return () => window.removeEventListener('storage', checkUser);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.dispatchEvent(new Event('storage'));
        toast.success('Logged out successfully');
        if (window.location.pathname.startsWith('/admin')) {
            router.push('/');
        }
    };

    const openAuth = (mode: 'login' | 'signup') => {
        setAuthMode(mode);
        setIsAuthOpen(true);
    };

    return (
        <>
            <AuthModal
                isOpen={isAuthOpen}
                onClose={() => setIsAuthOpen(false)}
                initialMode={authMode}
            />
            <header className={cn(
                "w-full py-4 px-6 flex justify-between items-center z-50 transition-all",
                transparent ? "bg-transparent" : "bg-slate-900/50 backdrop-blur-md border-b border-slate-800",
                className
            )}>
                <div className="flex items-center gap-4">
                    {showBackButton && (
                        <button
                            onClick={() => backUrl ? router.push(backUrl) : router.back()}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-300" />
                        </button>
                    )}

                    {showLogo ? (
                        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                            <AnimatedLogo className="w-8 h-8 md:w-10 md:h-10 text-blue-400" />
                            <div className="text-2xl md:text-3xl text-white drop-shadow-md">
                                <TypewriterText
                                    text="weekendtravellers.com"
                                    className="font-cursive text-2xl md:text-4xl"
                                    delay={500}
                                />
                            </div>
                        </Link>
                    ) : (
                        <div className="flex flex-col">
                            {title && (
                                <h1 className="text-sm font-bold text-slate-200 truncate max-w-[150px] md:max-w-none">
                                    {title}
                                </h1>
                            )}
                            {subtitle && (
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {actions && (
                        <div className="flex items-center gap-2 pr-2 border-r border-slate-800">
                            {actions}
                        </div>
                    )}

                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 p-0 overflow-hidden ring-2 ring-blue-500/20">
                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-xs shadow-lg">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 bg-slate-900 border-slate-800 text-slate-100" align="end">
                                <DropdownMenuLabel>
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user.name}</p>
                                        <p className="text-xs leading-none text-slate-400">{user.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-slate-800" />

                                <DropdownMenuItem asChild className="focus:bg-slate-800 focus:text-white cursor-pointer hover:bg-slate-800">
                                    <Link href="/profile" className="flex items-center w-full">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>My Profile</span>
                                    </Link>
                                </DropdownMenuItem>

                                {Boolean(user.isAdmin) && (
                                    <DropdownMenuItem asChild className="focus:bg-slate-800 focus:text-blue-400 cursor-pointer hover:bg-slate-800">
                                        <Link href="/admin" className="flex items-center w-full">
                                            <Shield className="mr-2 h-4 w-4 text-blue-400" />
                                            <span className="font-bold text-blue-400">Admin Dashboard</span>
                                        </Link>
                                    </DropdownMenuItem>
                                )}

                                <DropdownMenuItem asChild className="focus:bg-slate-800 focus:text-white cursor-pointer hover:bg-slate-800">
                                    <Link href="/trips" className="flex items-center w-full">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        <span>My Trips</span>
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator className="bg-slate-800" />

                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="text-red-400 focus:text-red-300 focus:bg-slate-800 cursor-pointer hover:bg-slate-800"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center gap-4">
                            {/* Mobile Auth Icons */}
                            <div className="flex md:hidden items-center gap-4">
                                <button onClick={() => openAuth('login')} className="text-slate-200 hover:text-white transition-colors">
                                    <LogIn className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Desktop Auth Buttons */}
                            <div className="hidden md:flex items-center gap-3">
                                <Button
                                    onClick={() => openAuth('login')}
                                    variant="ghost"
                                    className="text-slate-200 hover:text-white hover:bg-white/10 transition-all font-medium"
                                >
                                    Login
                                </Button>
                                <Button
                                    onClick={() => openAuth('signup')}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 border-0 rounded-xl px-6 transition-all transform hover:scale-105 active:scale-95"
                                >
                                    Sign Up
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </header>
        </>
    );
}
