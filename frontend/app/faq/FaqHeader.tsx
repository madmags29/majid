'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';

const AnimatedLogo = dynamic(() => import('@/components/AnimatedLogo'), { ssr: false });

export default function FaqHeader() {
    return (
        <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-6 sticky top-0 w-full z-50">
            <div className="flex items-center gap-3">
                <Link href="/">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                        <ArrowLeft className="w-5 h-5 text-slate-300" />
                    </Button>
                </Link>
                <Link href="/" className="flex items-center gap-2 group">
                    <AnimatedLogo className="w-8 h-8 text-blue-500 group-hover:text-blue-400 transition-colors" />
                    <span className="font-cursive text-2xl text-white hidden sm:block">weekendtravellers.com</span>
                </Link>
            </div>
        </header>
    );
}
