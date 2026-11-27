'use client';

import { Star } from 'lucide-react';

const STATIC_ITEMS = [
    { id: 0, text: 'Paris', x: 8, y: 18, delay: 0.2, duration: 7.0 },
    { id: 1, text: 'Tokyo', x: 82, y: 22, delay: 1.1, duration: 8.2 },
    { id: 2, text: 'Bali', x: 10, y: 72, delay: 0.6, duration: 6.8 },
    { id: 3, text: 'Jaipur', x: 84, y: 74, delay: 1.8, duration: 7.5 },
];

export default function FloatingDestinations() {
    return (
        <div className="hidden md:block fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {STATIC_ITEMS.map((item) => (
                <div
                    key={item.id}
                    style={{
                        position: 'absolute',
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                        animationName: 'floatPulse',
                        animationDuration: `${item.duration}s`,
                        animationDelay: `${item.delay}s`,
                        animationIterationCount: 'infinite',
                        animationTimingFunction: 'ease-in-out',
                    }}
                    className="flex flex-col items-center justify-center text-white font-cursive text-2xl md:text-3xl tracking-wide select-none opacity-0"
                >
                    <Star className="w-4 h-4 text-yellow-200 fill-yellow-200 mb-1" />
                    {item.text}
                </div>
            ))}
        </div>
    );
}
