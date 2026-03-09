'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Check, ShieldCheck } from 'lucide-react';

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setIsVisible(false);
        // Optional: Trigger GTM/AdSense consent here if needed
        window.dispatchEvent(new Event('cookie-consent-accepted'));
    };

    const handleDecline = () => {
        localStorage.setItem('cookie-consent', 'declined');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-[10000]"
                >
                    <div className="relative overflow-hidden rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-2xl p-6">
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full" />
                        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full" />

                        <div className="relative flex flex-col gap-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/20 rounded-lg">
                                        <Cookie className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">Cookie Settings</h3>
                                </div>
                                <button
                                    onClick={() => setIsVisible(false)}
                                    className="p-1 hover:bg-white/10 rounded-full transition-colors text-slate-400"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <p className="text-slate-300 text-sm leading-relaxed">
                                We use cookies to enhance your experience, analyze site traffic, and serve personalized ads via Google AdSense.
                                By clicking &ldquo;Accept&rdquo;, you consent to our use of cookies.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 mt-2">
                                <button
                                    onClick={handleAccept}
                                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
                                >
                                    <Check className="w-4 h-4" />
                                    Accept All
                                </button>
                                <button
                                    onClick={handleDecline}
                                    className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl font-medium border border-white/10 transition-all flex items-center justify-center gap-2"
                                >
                                    Reject
                                </button>
                            </div>

                            <div className="flex items-center justify-center gap-4 text-xs text-slate-500 mt-1">
                                <Link href="/privacy" className="hover:text-blue-400 transition-colors flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3" />
                                    Privacy Policy
                                </Link>
                                <span>•</span>
                                <Link href="/cookie-policy" className="hover:text-blue-400 transition-colors">
                                    Cookie Policy
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
