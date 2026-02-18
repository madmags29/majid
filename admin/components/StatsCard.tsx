"use client";

import { LucideIcon } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    subtext?: string;
    loading?: boolean;
    color?: 'blue' | 'emerald' | 'amber' | 'rose' | 'zinc';
}

export default function StatsCard({
    title,
    value,
    icon: Icon,
    trend,
    subtext,
    loading,
    color = 'blue'
}: StatsCardProps) {
    if (loading) {
        return (
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl animate-pulse">
                <div className="h-4 w-24 bg-zinc-800 rounded mb-4" />
                <div className="h-8 w-32 bg-zinc-800 rounded" />
            </div>
        );
    }

    const colorClasses = {
        blue: "group-hover:bg-blue-600/10 group-hover:text-blue-400",
        emerald: "group-hover:bg-emerald-600/10 group-hover:text-emerald-400",
        amber: "group-hover:bg-amber-600/10 group-hover:text-amber-400",
        rose: "group-hover:bg-rose-600/10 group-hover:text-rose-400",
        zinc: "group-hover:bg-zinc-600/10 group-hover:text-zinc-400",
    };

    const iconColors = {
        blue: "group-hover:text-blue-400",
        emerald: "group-hover:text-emerald-400",
        amber: "group-hover:text-amber-400",
        rose: "group-hover:text-rose-400",
        zinc: "group-hover:text-zinc-400",
    }

    return (
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl hover:border-zinc-700 transition-all group">
            <div className="flex items-start justify-between mb-4">
                <div className={cn(
                    "p-2.5 bg-zinc-800 rounded-xl transition-colors",
                    colorClasses[color]
                )}>
                    <Icon size={20} className={cn("text-zinc-400 transition-colors", iconColors[color])} />
                </div>
                {trend && (
                    <span className={cn(
                        "text-xs font-bold px-2 py-1 rounded-full",
                        trend.isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                    )}>
                        {trend.isPositive ? '+' : ''}{trend.value}%
                    </span>
                )}
            </div>
            <div>
                <h3 className="text-zinc-400 text-sm font-medium">{title}</h3>
                <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white">{value}</span>
                </div>
                {subtext && <p className="text-xs text-zinc-500 mt-2">{subtext}</p>}
            </div>
        </div>
    );
}
