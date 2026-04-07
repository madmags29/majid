'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, LogIn, Calendar, LogOut, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AnimatedLogo = dynamic(() => import('@/components/AnimatedLogo'), { ssr: false });
const RightMenu = dynamic(() => import('@/components/RightMenu'), { ssr: false });
const AuthModal = dynamic(() => import('@/components/AuthModal'), { ssr: false });

interface InnerHeaderProps {
    title?: string;
    subtitle?: string;
    showBack?: boolean;
    backHref?: string;
    actions?: React.ReactNode;
}

export default function InnerHeader({
    title,
    subtitle,
    showBack = false,
    backHref,
    actions
}: InnerHeaderProps) {
    const router = useRouter();
    const [user, setUser] = useState<{ name: string, email: string } | null>(null);
    const [isAuthOpen, setIsAuthOpen] = useState(false);

    useEffect(() => {
        const checkUser = () => {
            const userData = localStorage.getItem('user');
            if (userData) {
                setUser(JSON.parse(userData));
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
        router.refresh();
    };

    return (
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-2 sm:px-4 bg-slate-900/80 backdrop-blur-xl z-50 shrink-0 sticky top-0">
            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

            <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
                <div className="flex items-center">
                    <RightMenu />
                </div>

                {showBack && (
                    <Link
                        href={backHref || '/'}
                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                )}

                <div className="flex items-center gap-2 overflow-hidden">
                    <Link href="/" className="hidden md:flex items-center gap-2 shrink-0">
                        <AnimatedLogo className="w-8 h-8 text-blue-500" />
                        <span className="font-black text-sm md:text-base tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 whitespace-nowrap">
                            Weekend Travellers
                        </span>
                    </Link>

                    {(title || subtitle) && (
                        <>
                            <div className="h-4 w-[1px] bg-slate-800 mx-1 hidden md:block" />
                            <div className="block overflow-hidden">
                                {title && (
                                    <h1 className="text-sm md:text-sm font-bold text-slate-200 truncate max-w-[100px] xs:max-w-[150px] md:max-w-[200px]">
                                        {title}
                                    </h1>
                                )}
                                {subtitle && (
                                    <p className="text-[10px] md:text-[10px] text-slate-500 uppercase tracking-widest font-black truncate">
                                        {subtitle}
                                    </p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                {actions}

                <Link
                    href="/blog"
                    className="hidden sm:block text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-all text-sm font-medium"
                >
                    Blog
                </Link>

                <div className="h-6 w-[1px] bg-slate-800 mx-1 hidden sm:block" />

                {user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-blue-500/20 hover:ring-blue-500/40 transition-all p-0 overflow-hidden shrink-0">
                                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                                    {user.name.charAt(0)}
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-800 text-slate-200">
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user.name}</p>
                                    <p className="text-xs leading-none text-slate-400">{user.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-slate-800" />
                            <DropdownMenuItem asChild className="focus:bg-slate-800 focus:text-white cursor-pointer">
                                <Link href="/trips" className="flex items-center w-full">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    <span>My Trips</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-800" />
                            <DropdownMenuItem onClick={handleLogout} className="focus:bg-red-500/10 focus:text-red-500 cursor-pointer text-red-500 font-medium">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Button
                        onClick={() => setIsAuthOpen(true)}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 border-0 rounded-xl px-3 sm:px-4 md:px-6 h-9 transition-all text-[10px] sm:text-xs font-bold"
                    >
                        <span className="sm:hidden">Login</span>
                        <span className="hidden sm:inline">Sign In</span>
                    </Button>
                )}
            </div>
        </header>
    );
}
