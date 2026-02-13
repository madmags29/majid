'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CinematicLoaderProps {
    messages?: string[];
    interval?: number;
    className?: string;
}

const DEFAULT_MESSAGES = [
    "Curating your ultimate travel experience...",
    "Sourcing high-definition travel wisdom...",
    "Discovering hidden gems and local secrets...",
    "Mapping out your perfect escape...",
    "Compiling wanderlust-worthy insights..."
];

export default function CinematicLoader({
    messages = DEFAULT_MESSAGES,
    interval = 3000,
    className
}: CinematicLoaderProps) {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % messages.length);
        }, interval);
        return () => clearInterval(timer);
    }, [messages, interval]);

    return (
        <div className={cn("min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6", className)}>
            <div className="relative mb-12">
                <div className="absolute inset-0 bg-blue-500/20 blur-3xl animate-pulse" />
                <Loader2 className="w-16 h-16 text-blue-500 animate-spin relative z-10" />
            </div>
            <motion.div
                key={messageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center"
            >
                <p className="text-2xl font-black italic tracking-tighter uppercase mb-2">
                    {messages[messageIndex]}
                </p>
                <p className="text-slate-500 text-lg">
                    {messageIndex === messages.length - 1 ? "Almost there..." : "Crafting your premium itinerary"}
                </p>
            </motion.div>
            <div className="mt-12 flex gap-2">
                {messages.map((_, idx) => (
                    <div
                        key={idx}
                        className={cn(
                            "h-1 w-8 rounded-full transition-all duration-500",
                            idx === messageIndex ? "bg-blue-500" : "bg-slate-800"
                        )}
                    />
                ))}
            </div>
        </div>
    );
}
