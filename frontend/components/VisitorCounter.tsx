'use client';

import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';

export default function VisitorCounter() {
    const [count, setCount] = useState(() => Math.floor(Math.random() * (200 - 100 + 1) + 100));

    useEffect(() => {

        const interval = setInterval(() => {
            setCount(prev => {
                const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
                return Math.max(80, prev + change); // Minimum 80
            });
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-lg animate-fade-in hover:bg-white/20 transition-colors cursor-default">
            <div className="relative">
                <div className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                <Users className="w-4 h-4 text-white" />
            </div>
            <span className="text-white text-xs font-medium">
                <span className="font-bold">{count}</span> traveling now through weekend travellers
            </span>
        </div>
    );
}
