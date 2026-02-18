'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';

const DESTINATIONS = [
    "Paris", "Tokyo", "Bali", "New York", "Santorini", "Dubai", "London",
    "Rome", "Maldives", "Kyoto", "Barcelona", "Sydney", "Cairo", "Istanbul",
    "Bangkok", "Cape Town", "Rio de Janeiro", "Amalfi Coast", "Petra", "Machu Picchu",
    "Bora Bora", "Venice", "Prague", "Amsterdam", "San Francisco", "Queenstown",
    "Reykjavik", "Marrakech", "Seville", "Florence", "Lisbon", "Edinburgh",
    "Hawaii", "Las Vegas", "Miami", "Singapore", "Hong Kong", "Seoul", "Mumbai",
    "Goa", "Jaipur", "Cusco", "Lima", "Buenos Aires", "Vancouver", "Toronto"
];

interface FloatingText {
    id: number;
    text: string;
    x: number;
    y: number;
    delay: number;
}

export default function FloatingDestinations() {
    const [visibleDestinations, setVisibleDestinations] = useState<FloatingText[]>([]);
    const [availableDestinations, setAvailableDestinations] = useState<string[]>([]);

    useEffect(() => {
        // Initial shuffle
        const shuffled = [...DESTINATIONS].sort(() => Math.random() - 0.5);
        setAvailableDestinations(shuffled);
    }, []);

    useEffect(() => {
        if (availableDestinations.length === 0) return;

        let currentIndex = 0;

        const generateDestination = (id: number) => {
            // Get next destination from the shuffled list
            if (currentIndex >= availableDestinations.length) {
                currentIndex = 0; // Loop if exhausted (or we could reshuffle)
            }

            const text = availableDestinations[currentIndex];
            currentIndex++;

            // Random position, avoiding the center 50% of the screen
            let x, y;
            do {
                x = Math.random() * 90 + 5;
                y = Math.random() * 90 + 5;
            } while (x > 25 && x < 75 && y > 25 && y < 75);

            return {
                id,
                text,
                x,
                y,
                delay: Math.random() * 3
            };
        };

        // Create initial batch
        const initial = Array.from({ length: 6 }).map((_, i) => generateDestination(i));
        setVisibleDestinations(initial);

        // Interval to refresh
        const interval = setInterval(() => {
            setVisibleDestinations(prev => {
                const newItems = [...prev];
                // Replace 1 item at a time to keep it smooth
                const replaceIdx = Math.floor(Math.random() * newItems.length);
                newItems[replaceIdx] = generateDestination(Date.now() + Math.random());
                return newItems;
            });
        }, 4000);

        return () => clearInterval(interval);
    }, [availableDestinations]);

    return (
        <div className="hidden md:block fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <AnimatePresence mode="popLayout">
                {visibleDestinations.map((item) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                            opacity: [0, 1, 0],
                            scale: [0.8, 1.1, 0.8],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            delay: item.delay,
                            ease: "easeInOut",
                            repeatDelay: Math.random() * 5
                        }}
                        style={{
                            position: 'absolute',
                            left: `${item.x}%`,
                            top: `${item.y}%`,
                            textShadow: '0 0 20px rgba(255,255,255,0.8)'
                        }}
                        className="flex flex-col items-center justify-center text-white font-cursive text-2xl md:text-3xl tracking-wide select-none opacity-100"
                    >
                        <Star className="w-4 h-4 text-yellow-200 fill-yellow-200 mb-1 animate-pulse" />
                        {item.text}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
