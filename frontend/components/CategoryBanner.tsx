'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Car, Gem, CloudRain, Snowflake } from 'lucide-react';

const CATEGORIES = [
    { name: 'Budget travel', icon: Wallet, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
    { name: 'Road trips', icon: Car, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { name: 'Hidden gems', icon: Gem, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    { name: 'Monsoon trips', icon: CloudRain, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20' },
    { name: 'Winter trips', icon: Snowflake, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
];

interface CategoryBannerProps {
    userLocation?: string;
}

export default function CategoryBanner({ userLocation }: CategoryBannerProps) {
    const handleCategoryClick = (category: string) => {
        const originParam = userLocation ? `&origin=${encodeURIComponent(userLocation)}` : '';
        window.location.href = `/search?destination=${encodeURIComponent(category)}${originParam}`;
    };

    return (
        <div className="w-full mt-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-500">
            <div className="grid grid-cols-2 md:flex md:justify-center gap-3 md:gap-4 px-4 max-w-4xl mx-auto">
                {CATEGORIES.map((cat, index) => (
                    <motion.button
                        key={cat.name}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCategoryClick(cat.name)}
                        className={`flex items-center justify-center md:justify-start gap-2.5 px-4 md:px-5 py-3 rounded-2xl backdrop-blur-md border ${cat.bg} ${cat.border} transition-all shadow-xl group cursor-pointer ${index === CATEGORIES.length - 1 ? 'col-span-2 sm:col-span-1' : ''}`}
                    >
                        <cat.icon className={`w-4 h-4 md:w-5 md:h-5 ${cat.color} group-hover:scale-110 transition-transform`} />
                        <span className="text-xs md:text-sm font-semibold text-slate-100 whitespace-nowrap">
                            {cat.name}
                        </span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
