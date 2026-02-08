'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function AnimatedLogo({ className }: { className?: string }) {
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
                stroke="currentColor"
                strokeWidth="5" // Increased thickness
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-full h-full"
            >
                <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" /> {/* Blue-500 */}
                        <stop offset="100%" stopColor="#a855f7" /> {/* Purple-500 */}
                    </linearGradient>
                </defs>

                {/* Location Pin - Gradient Stroke */}
                <path
                    d="M 50 20 C 35 20 25 30 25 45 C 25 65 50 90 50 90 C 50 90 75 65 75 45 C 75 30 65 20 50 20 Z"
                    className={cn("transition-all duration-700 ease-out opacity-0 origin-bottom", animate && "opacity-100 scale-100")}
                    stroke="url(#logoGradient)"
                    strokeDasharray="200"
                    strokeDashoffset={animate ? 0 : 200}
                    style={{ transitionDelay: '0s', transformOrigin: '50% 90%' }}
                />
                <circle
                    cx="50"
                    cy="45"
                    r="8"
                    className={cn(
                        "transition-all duration-500 ease-out opacity-0 delay-500",
                        animate && "opacity-100 animate-pulse" // Added animate-pulse for fade in/out
                    )}
                    fill="white" // Changed to white
                    fillOpacity="1"
                    stroke="none"
                />

                {/* Flight Path (Looping) - Light Blue/White */}
                <path
                    d="M 10 70 Q 30 90 50 60 Q 70 30 90 50"
                    className={cn("transition-all duration-1000 ease-in-out opacity-0", animate && "opacity-60")}
                    stroke="#93c5fd" // Blue-300
                    strokeWidth="2.5"
                    style={{ transitionDelay: '0.5s' }}
                    strokeDasharray="4 8"
                />

                {/* Alternative Plane (Static at end of path for robustness) - White */}
                <path
                    d="M 88 48 L 98 52 L 88 56 L 90 52 Z"
                    fill="#ffffff"
                    stroke="#ffffff"
                    strokeWidth="1"
                    className={cn("transition-all duration-300 ease-out opacity-0 scale-0 origin-center", animate && "opacity-100 scale-100")}
                    style={{ transitionDelay: '1.4s' }}
                />
            </svg>
        </div>
    );
}
