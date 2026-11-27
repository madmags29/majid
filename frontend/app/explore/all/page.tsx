'use client';

import { motion } from 'framer-motion';
import { MapPin, Search, ArrowLeft, SlidersHorizontal, Calculator } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { EXLPORE_DESTINATIONS } from '@/lib/destinations';
import { getDestinationEditorialMeta, RegionKey, BudgetTier } from '@/lib/destinationMetadata';
import { Button } from '@/components/ui/button';

const REGIONS: ('All' | RegionKey)[] = ['All', 'India', 'Europe', 'Asia', 'Americas', 'Middle East', 'Africa'];
const BUDGETS: ('All' | BudgetTier)[] = ['All', 'Budget', 'Moderate', 'Premium'];
const STYLES = ['All', 'Mountains', 'Beaches', 'Heritage', 'City', 'Nature', 'Spiritual', 'Adventure', 'Romance'];

export default function AllDestinationsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRegion, setSelectedRegion] = useState<'All' | RegionKey>('All');
    const [selectedBudget, setSelectedBudget] = useState<'All' | BudgetTier>('All');
    const [selectedStyle, setSelectedStyle] = useState<string>('All');

    const enriched = useMemo(() => {
        return EXLPORE_DESTINATIONS.filter(d => !['india', 'europe'].includes(d.id)).map(dest => ({
            dest,
            meta: getDestinationEditorialMeta(dest),
        }));
    }, []);

    const filteredDestinations = useMemo(() => {
        return enriched.filter(({ dest, meta }) => {
            const matchesQuery = !searchQuery ||
                dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                dest.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                dest.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesRegion = selectedRegion === 'All' || meta.region === selectedRegion;
            const matchesBudget = selectedBudget === 'All' || meta.budgetTier === selectedBudget;
            const matchesStyle = selectedStyle === 'All' ||
                dest.tags.some(t => t.toLowerCase().includes(selectedStyle.toLowerCase()));
            return matchesQuery && matchesRegion && matchesBudget && matchesStyle;
        });
    }, [enriched, searchQuery, selectedRegion, selectedBudget, selectedStyle]);

    const resetFilters = () => {
        setSearchQuery('');
        setSelectedRegion('All');
        setSelectedBudget('All');
        setSelectedStyle('All');
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col text-white">
            <header className="sticky top-0 z-50 glass-panel border-b border-white/5 py-4 px-6 bg-slate-950/90 backdrop-blur-md">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors shrink-0">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="hidden md:inline font-medium">Home</span>
                    </Link>

                    <div className="relative flex-1 max-w-xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            aria-label="Search destinations"
                            placeholder="Search destinations, countries, or vibes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                        />
                    </div>

                    <Link href="/tools" className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-300 hover:bg-blue-600/30 text-xs font-bold shrink-0">
                        <Calculator className="w-3.5 h-3.5" /> Budget &amp; Distance Tools
                    </Link>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10 space-y-8">
                <div className="space-y-3">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
                        Explore Weekend Destinations
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl">
                        Filter {enriched.length} curated city, mountain, beach, and heritage guides by region, estimated budget tier, and travel style.
                    </p>
                </div>

                <section aria-label="Destination filters" className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" /> Filter Destinations ({filteredDestinations.length} matching)
                        </span>
                        {(searchQuery || selectedRegion !== 'All' || selectedBudget !== 'All' || selectedStyle !== 'All') && (
                            <button onClick={resetFilters} className="text-xs text-blue-400 hover:underline font-semibold cursor-pointer">
                                Reset all
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="filter-region" className="block text-[11px] font-bold uppercase text-slate-500 mb-1.5">Region</label>
                            <select
                                id="filter-region"
                                value={selectedRegion}
                                onChange={(e) => setSelectedRegion(e.target.value as any)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                            >
                                {REGIONS.map(r => <option key={r} value={r}>{r === 'All' ? 'All Regions' : r}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="filter-budget" className="block text-[11px] font-bold uppercase text-slate-500 mb-1.5">Estimated Budget Tier</label>
                            <select
                                id="filter-budget"
                                value={selectedBudget}
                                onChange={(e) => setSelectedBudget(e.target.value as any)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                            >
                                {BUDGETS.map(b => <option key={b} value={b}>{b === 'All' ? 'All Budgets' : b}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="filter-style" className="block text-[11px] font-bold uppercase text-slate-500 mb-1.5">Travel Style</label>
                            <select
                                id="filter-style"
                                value={selectedStyle}
                                onChange={(e) => setSelectedStyle(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                            >
                                {STYLES.map(s => <option key={s} value={s}>{s === 'All' ? 'All Styles' : s}</option>)}
                            </select>
                        </div>
                    </div>
                </section>

                {filteredDestinations.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredDestinations.map(({ dest, meta }) => (
                            <Link
                                key={dest.id}
                                href={`/explore/${dest.id}`}
                                className="group relative h-80 rounded-3xl overflow-hidden border border-white/10 hover:border-blue-500/50 transition-all shadow-2xl block"
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent z-10" />
                                <Image
                                    src={dest.image}
                                    alt={dest.imageAlt || `${dest.name}, ${dest.country}`}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                />
                                <div className="absolute top-4 left-4 z-20 flex gap-1.5">
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-slate-200 border border-white/10">
                                        {meta.budgetTier}
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600/70 backdrop-blur-md text-white">
                                        {meta.idealDuration.split(' ')[0]}
                                    </span>
                                </div>
                                <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
                                    <div className="flex items-center gap-1.5 text-blue-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                                        <MapPin className="w-3 h-3" />
                                        {dest.country}
                                    </div>
                                    <h2 className="text-2xl font-black text-white tracking-tight mb-2">{dest.name}</h2>
                                    <p className="text-[11px] text-slate-300 line-clamp-1 mb-3">{meta.dailyBudgetEstimate}</p>
                                    <span className="bg-white text-slate-950 rounded-full font-bold px-4 py-1.5 text-xs group-hover:bg-blue-500 group-hover:text-white transition-colors inline-block">
                                        Read Guide
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 border border-dashed border-white/10 rounded-3xl bg-white/5">
                        <MapPin className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <p className="text-xl font-bold text-slate-300">No destinations match those filters</p>
                        <p className="text-slate-500 mt-2 text-sm">Try broadening your region, budget tier, or search query.</p>
                        <Button variant="outline" onClick={resetFilters} className="mt-6 border-slate-700 text-slate-200">
                            Reset Filters
                        </Button>
                    </div>
                )}
            </main>
        </div>
    );
}
