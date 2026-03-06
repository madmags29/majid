'use client';

import { motion } from 'framer-motion';
import { MapPin, Search, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { EXLPORE_DESTINATIONS } from '@/lib/destinations';
import { Button } from '@/components/ui/button';

export default function AllDestinationsPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredDestinations = EXLPORE_DESTINATIONS.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.country.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            {/* Header / Navbar */}
            <header className="sticky top-0 z-50 glass-panel border-b border-white/5 py-4 px-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
                    <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="hidden md:inline font-medium">Back to Home</span>
                    </Link>

                    <div className="relative flex-1 max-w-xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search 50+ destinations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white placeholder:text-slate-500 outline-none focus:ring-1 focus:ring-blue-500/50 transition-all text-sm"
                        />
                    </div>

                    <div className="hidden md:block">
                        <Link href="/">
                            <div className="text-xl font-black text-white italic tracking-tighter uppercase">Weekend Travellers</div>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white uppercase mb-4">Explore All Destinations</h1>
                    <p className="text-xl text-slate-400 max-w-2xl">Discover hand-picked weekend getaways across the globe. From historical cities to tropical paradises.</p>
                </motion.div>

                {filteredDestinations.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredDestinations.map((dest, index) => (
                            <motion.div
                                key={dest.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link
                                    href={`/explore/${dest.id}`}
                                    className="group relative h-80 rounded-3xl overflow-hidden border border-white/10 hover:border-blue-500/50 transition-all shadow-2xl block"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10" />
                                    <Image
                                        src={dest.image}
                                        alt={dest.name}
                                        fill
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    />
                                    <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
                                        <div className="flex items-center gap-1.5 text-blue-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                                            <MapPin className="w-3 h-3" />
                                            {dest.country}
                                        </div>
                                        <h3 className="text-2xl font-black text-white italic tracking-tighter mb-4">{dest.name}</h3>
                                        <div className="bg-white text-slate-950 rounded-full font-bold px-6 py-2 text-xs group-hover:bg-blue-500 group-hover:text-white transition-colors inline-block text-center">
                                            Explore Guide
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 border border-dashed border-white/10 rounded-3xl bg-white/5">
                        <MapPin className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                        <p className="text-2xl font-bold text-slate-300">No destinations found matching &quot;{searchQuery}&quot;</p>
                        <p className="text-slate-500 mt-2">Try searching for a different city or country.</p>
                        <Button
                            variant="ghost"
                            onClick={() => setSearchQuery('')}
                            className="mt-6 text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            View all destinations
                        </Button>
                    </div>
                )}
            </main>
        </div>
    );
}
