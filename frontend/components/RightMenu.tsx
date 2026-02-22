'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MessageSquare, Map, Compass, Sparkles, LogIn, UserPlus, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { createPortal } from 'react-dom';
import AnimatedLogo from '@/components/AnimatedLogo';

const AuthModal = dynamic(() => import('@/components/AuthModal'));

const menuItems = [
    { name: 'Chat', href: '/chat', icon: MessageSquare },
    { name: 'Your Trips', href: '/trips', icon: Map },
    { name: 'Inspirational Trip', href: '/inspiration-trip', icon: Sparkles },
    { name: 'Explore', href: '/explore', icon: Compass },
];

export default function RightMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
    const [user, setUser] = useState<{ name: string, email: string } | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Close menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    useEffect(() => {
        const checkUser = () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            } else {
                setUser(null);
            }
        };

        checkUser();
        window.addEventListener('storage', checkUser);
        return () => window.removeEventListener('storage', checkUser);
    }, []);

    const openAuth = (mode: 'login' | 'signup') => {
        setAuthMode(mode);
        setIsAuthOpen(true);
        setIsOpen(false); // Close sidebar when opening auth modal
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.dispatchEvent(new Event('storage')); // Notify other components
    };

    // Prevent background scrolling when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} initialMode={authMode} />

            {/* Header Toggle Button */}
            <motion.button
                onClick={toggleMenu}
                className="bg-transparent border border-white/10 hover:border-slate-700/50 p-2 rounded-xl hover:bg-white/5 transition-colors group flex items-center justify-center mr-2 md:mr-3"
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                aria-label="Open Navigation Menu"
            >
                <Menu className="w-6 h-6 text-slate-200 group-hover:text-white transition-colors" />
            </motion.button>

            {mounted && createPortal(
                <>
                    {/* Overlay */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9990]"
                                onClick={toggleMenu}
                            />
                        )}
                    </AnimatePresence>

                    {/* Sidebar Menu */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ x: '-100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '-100%' }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                className="fixed top-0 left-0 h-full w-80 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 shadow-2xl z-[9999] flex flex-col"
                            >
                                <div className="p-6 flex justify-between items-center border-b border-slate-800/50">
                                    <div className="flex items-center gap-2">
                                        <AnimatedLogo className="w-6 h-6 text-blue-400" />
                                        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 italic tracking-tight">
                                            Weekend Menu
                                        </h2>
                                    </div>
                                    <button
                                        onClick={toggleMenu}
                                        className="p-2 rounded-full hover:bg-slate-800/80 text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                        aria-label="Close Menu"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                                    {menuItems.map((item) => {
                                        const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                                        const isTrips = item.name === 'Your Trips';

                                        const content = (
                                            <>
                                                <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800/50 text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-500/10'
                                                    } transition-colors`}>
                                                    <item.icon className="w-5 h-5" />
                                                </div>
                                                <span className="font-medium text-lg tracking-wide">{item.name}</span>
                                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-purple-500/0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none" />
                                            </>
                                        );

                                        if (isTrips && !user) {
                                            return (
                                                <button
                                                    key={item.name}
                                                    onClick={() => openAuth('login')}
                                                    className="w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 group text-slate-300 hover:bg-slate-800/50 hover:text-white border border-transparent hover:border-slate-700/50"
                                                >
                                                    {content}
                                                </button>
                                            );
                                        }

                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 group ${isActive
                                                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white border border-transparent hover:border-slate-700/50'
                                                    }`}
                                            >
                                                {content}
                                            </Link>
                                        );
                                    })}

                                    {!user && (
                                        <div className="mt-4 pt-4 border-t border-slate-800/50 space-y-2 md:hidden">
                                            <button
                                                onClick={() => openAuth('login')}
                                                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800/50 hover:text-white transition-all duration-300 group"
                                            >
                                                <div className="p-2 rounded-lg bg-slate-800/50 text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors">
                                                    <LogIn className="w-5 h-5" />
                                                </div>
                                                <span className="font-medium text-lg tracking-wide">Login</span>
                                            </button>
                                            <button
                                                onClick={() => openAuth('signup')}
                                                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all duration-300"
                                            >
                                                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 transition-colors">
                                                    <UserPlus className="w-5 h-5" />
                                                </div>
                                                <span className="font-medium text-lg tracking-wide">Sign Up</span>
                                            </button>
                                        </div>
                                    )}

                                    {user && (
                                        <div className="mt-4 pt-4 border-t border-slate-800/50 space-y-2 md:hidden">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 group"
                                            >
                                                <div className="p-2 rounded-lg bg-red-500/10 text-red-400/80 group-hover:text-red-400 transition-colors">
                                                    <LogOut className="w-5 h-5" />
                                                </div>
                                                <span className="font-medium text-lg tracking-wide">Log out</span>
                                            </button>
                                        </div>
                                    )}

                                </nav>

                                <div className="p-6 border-t border-slate-800/50">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/20 cursor-pointer hover:shadow-purple-500/40 transition-shadow">
                                            <span className="text-white font-bold text-sm select-none">WT</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-200">Weekend Travellers</p>
                                            <p className="text-xs text-slate-400">Your Personal Guide</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>,
                document.body
            )}
        </>
    );
}
