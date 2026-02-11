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
    deleteAfter?: number;
}

export default function TypewriterText({
    text,
    className,
    cursorClassName,
    delay = 0,
    hideAfter,
    deleteAfter
}: TypewriterTextProps) {
    const [displayedText, setDisplayedText] = useState(text); // Initial state is the full text for SSR and SEO
    const [isComplete, setIsComplete] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        let hideTimeout: NodeJS.Timeout;
        let deleteTimeout: NodeJS.Timeout;

        let currentIndex = 0;

        // Reset state for typing animation
        setDisplayedText(''); // Start typing from empty on mount
        setIsComplete(false);
        setIsVisible(true);
        setIsDeleting(false);

        const typingTimeout = setTimeout(() => {
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
                    } else if (deleteAfter !== undefined) {
                        deleteTimeout = setTimeout(() => {
                            setIsDeleting(true);
                            let deleteIndex = text.length;
                            const deleteInterval = setInterval(() => {
                                if (deleteIndex > 0) {
                                    setDisplayedText(text.slice(0, deleteIndex - 1));
                                    deleteIndex--;
                                } else {
                                    clearInterval(deleteInterval);
                                    setIsVisible(false);
                                }
                            }, 50);
                        }, deleteAfter);
                    }
                }
            }, 100);
        }, delay);

        return () => {
            clearTimeout(typingTimeout);
            clearInterval(interval);
            if (hideTimeout) clearTimeout(hideTimeout);
            if (deleteTimeout) clearTimeout(deleteTimeout);
        };
    }, [text, delay, hideAfter, deleteAfter]);

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
                            (isComplete && !isDeleting) || (!isVisible) ? "opacity-0" : "opacity-100",
                            cursorClassName
                        )}
                    />
                </motion.span>
            )}
        </AnimatePresence>
    );
}
