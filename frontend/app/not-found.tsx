'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <Suspense fallback={null}>
            <NotFoundContent />
        </Suspense>
    );
}

function NotFoundContent() {
    const router = useRouter();
    const [query, setQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?destination=${encodeURIComponent(query)}`);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden text-white selection:bg-blue-500/30">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transform scale-105"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop")',
                    filter: 'brightness(0.4) blur(2px)'
                }}
            />

            {/* Content */}
            <div className="relative z-10 w-full max-w-2xl px-4 text-center space-y-8 animate-in fade-in zoom-in duration-700">

                {/* 404 Graphic */}
                <div className="relative inline-block mb-4">
                    <h1 className="text-[150px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-transparent select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Compass className="w-24 h-24 text-blue-400/80 animate-pulse" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold font-cursive text-blue-200">
                        Looks like you&apos;re lost...
                    </h2>
                    <p className="text-xl text-slate-300">
                        The destination you&apos;re looking for is off the map. <br />
                        Why not discover somewhere new?
                    </p>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="w-full max-w-lg mx-auto glass-panel p-2 rounded-xl flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 shadow-2xl mt-8 transition-transform hover:scale-[1.02]">
                    <MapPin className="w-5 h-5 text-blue-300 ml-3" />
                    <input
                        type="text"
                        placeholder="Where to next?"
                        className="bg-transparent flex-1 outline-none text-white placeholder:text-slate-400 font-medium h-12"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                    />
                    <Button type="submit" size="icon" className="h-10 w-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
                        <Search className="w-5 h-5" />
                    </Button>
                </form>

                <div className="pt-8">
                    <Link href="/" className="inline-flex items-center text-slate-300 hover:text-white transition-colors group">
                        <span className="mr-2">←</span>
                        <span className="group-hover:underline">Return Home</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
