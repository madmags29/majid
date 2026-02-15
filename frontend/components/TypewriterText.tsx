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
    const [displayedText, setDisplayedText] = useState("");
    const [isHydrated, setIsHydrated] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (!isHydrated) return;
        let interval: NodeJS.Timeout;

        // Reset state for typing animation
        setDisplayedText('');
        setIsComplete(false);
        setIsVisible(true);
        setIsDeleting(false);

        const typingTimeout = setTimeout(() => {
            interval = setInterval(() => {
                setDisplayedText(prev => {
                    if (prev.length < text.length) {
                        return text.slice(0, prev.length + 1);
                    }
                    clearInterval(interval);
                    setIsComplete(true);
                    return prev;
                });
            }, 100);
        }, delay);

        return () => {
            clearTimeout(typingTimeout);
            clearInterval(interval);
        };
    }, [text, delay, isHydrated]);

    useEffect(() => {
        if (!isComplete) return;

        let hideTimeout: NodeJS.Timeout;
        let deleteTimeout: NodeJS.Timeout;

        if (hideAfter !== undefined) {
            hideTimeout = setTimeout(() => {
                setIsVisible(false);
            }, hideAfter);
        } else if (deleteAfter !== undefined) {
            deleteTimeout = setTimeout(() => {
                setIsDeleting(true);
                const deleteInterval = setInterval(() => {
                    setDisplayedText(prev => {
                        if (prev.length > 0) {
                            return prev.slice(0, -1);
                        }
                        clearInterval(deleteInterval);
                        setIsVisible(false);
                        return prev;
                    });
                }, 50);
            }, deleteAfter);
        }

        return () => {
            if (hideTimeout) clearTimeout(hideTimeout);
            if (deleteTimeout) clearTimeout(deleteTimeout);
        };
    }, [isComplete, hideAfter, deleteAfter, text.length]);

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
                            "w-[2px] h-[1.2em] bg-blue-400 ml-1",
                            isComplete && !isDeleting ? "animate-none opacity-0" : "animate-pulse opacity-100",
                            cursorClassName
                        )}
                    />
                </motion.span>
            )}
        </AnimatePresence>
    );
}
