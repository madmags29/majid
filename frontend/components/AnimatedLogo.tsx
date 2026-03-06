'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function AnimatedLogo({ className, solid = false }: { className?: string, solid?: boolean }) {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setAnimate(true), 10);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={cn("relative w-12 h-12 flex items-center justify-center", className)}>
            <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={cn("w-full h-full transition-opacity duration-500", animate ? "opacity-100" : "opacity-0")}
            >
                <defs>
                    <linearGradient id="voyagerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                </defs>

                {/* Orbital Path - Fades in and rotates */}
                <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="currentColor"
                    strokeOpacity="0.1"
                    strokeWidth="1.5"
                    strokeDasharray="8 8"
                    className={cn(
                        "transition-all duration-1000 delay-500",
                        animate && "animate-[spin_20s_linear_infinite]"
                    )}
                />

                {/* Fluid W / Flight Path - Draws itself */}
                <path
                    d="M20 50 Q 35 15 50 50 Q 65 85 80 50"
                    stroke="url(#voyagerGradient)"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray="200"
                    strokeDashoffset={animate ? 0 : 200}
                    className="transition-all duration-[1.5s] ease-in-out"
                />

                {/* Voyager Tip / Plane - Floats */}
                <path
                    d="M80 50 L70 42 M80 50 L70 58"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                    className={cn(
                        "transition-all duration-500 delay-1000 opacity-0",
                        animate && "opacity-100 animate-[bounce_3s_infinite_ease-in-out]"
                    )}
                    style={{ transformOrigin: '80px 50px' }}
                />
            </svg>
        </div>
    );
}
