'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';

const DESTINATIONS = [
    "Paris", "Tokyo", "Bali", "New York", "Santorini", "Dubai", "London",
    "Rome", "Maldives", "Kyoto", "Barcelona", "Sydney", "Cairo", "Istanbul",
    "Bangkok", "Cape Town", "Rio de Janeiro", "Amalfi Coast", "Petra", "Machu Picchu",
    "Bora Bora", "Venice", "Prague", "Amsterdam", "San Francisco", "Queenstown",
    "Reykjavik", "Marrakech", "Seville", "Florence", "Lisbon", "Edinburgh",
    "Hawaii", "Las Vegas", "Miami", "Singapore", "Hong Kong", "Seoul", "Mumbai",
    "Goa", "Jaipur", "Cusco", "Lima", "Buenos Aires", "Vancouver", "Toronto",
    "Kuala Lumpur", "Hanoi", "New Delhi", "Agra"
];

interface FloatingText {
    id: number;
    text: string;
    x: number;
    y: number;
    delay: number;
    duration: number;
}

export default function FloatingDestinations() {
    const [items, setItems] = useState<FloatingText[]>([]);

    useEffect(() => {
        const shuffled = [...DESTINATIONS].sort(() => Math.random() - 0.5);
        const initialItems = Array.from({ length: 6 }).map((_, i) => {
            let x, y;
            do {
                x = Math.floor(Math.random() * 85 + 5);
                y = Math.floor(Math.random() * 85 + 5);
            } while (x > 25 && x < 75 && y > 25 && y < 75);

            return {
                id: i,
                text: shuffled[i % shuffled.length],
                x,
                y,
                delay: Math.round((Math.random() * 3) * 10) / 10,
                duration: Math.round((6 + Math.random() * 3) * 10) / 10
            };
        });
        setItems(initialItems);
    }, []);

    if (items.length === 0) return null;

    return (
        <div className="hidden md:block fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {items.map((item) => (
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
                        textShadow: '0 0 20px rgba(255,255,255,0.8)'
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
