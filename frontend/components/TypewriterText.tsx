'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface TypewriterTextProps {
    text: string;
    className?: string;
    cursorClassName?: string;
    delay?: number;
    hideAfter?: number;
}

export default function TypewriterText({
    text,
    className,
    cursorClassName,
    delay = 0,
    hideAfter
}: TypewriterTextProps) {
    const [displayedText, setDisplayedText] = useState(text); // Initial state is the full text for SSR and SEO
    const [isComplete, setIsComplete] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        let hideTimeout: NodeJS.Timeout;

        let currentIndex = 0;

        // Reset state for typing animation
        setDisplayedText(''); // Start typing from empty on mount
        setIsComplete(false);
        setIsVisible(true);

        const timeout = setTimeout(() => {
            interval = setInterval(() => {
                if (currentIndex < text.length) {
                    setDisplayedText(text.slice(0, currentIndex + 1));
                    currentIndex++;
                } else {
                    clearInterval(interval);
                    setIsComplete(true);

                    if (hideAfter !== undefined) {
                        hideTimeout = setTimeout(() => {
                            setIsVisible(false);
                        }, hideAfter);
                    }
                }
            }, 100);
        }, delay);

        return () => {
            clearTimeout(timeout);
            clearInterval(interval);
            if (hideTimeout) clearTimeout(hideTimeout);
        };
    }, [text, delay, hideAfter]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.span
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className={cn("inline-flex items-center", className)}
                >
                    {displayedText}
                    <span
                        className={cn(
                            "w-[2px] h-[1.2em] bg-current ml-1 animate-pulse",
                            isComplete ? "opacity-0" : "opacity-100",
                            cursorClassName
                        )}
                    />
                </motion.span>
            )}
        </AnimatePresence>
    );
}
