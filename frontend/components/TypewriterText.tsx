'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TypewriterTextProps {
    text: string;
    className?: string;
    cursorClassName?: string;
    delay?: number;
}

export default function TypewriterText({
    text,
    className,
    cursorClassName,
    delay = 0
}: TypewriterTextProps) {
    const [displayedText, setDisplayedText] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        let interval: NodeJS.Timeout;
        let currentIndex = 0;

        // Reset state on effect triggers (handling prop changes / strict mode)
        setDisplayedText('');
        setIsComplete(false);

        timeout = setTimeout(() => {
            interval = setInterval(() => {
                if (currentIndex < text.length) {
                    // Use slice to guarantee correct substring regardless of execution count
                    setDisplayedText(text.slice(0, currentIndex + 1));
                    currentIndex++;
                } else {
                    clearInterval(interval);
                    setIsComplete(true);
                }
            }, 100);
        }, delay);

        return () => {
            clearTimeout(timeout);
            clearInterval(interval);
        };
    }, [text, delay]);

    return (
        <span className={cn("inline-flex items-center", className)}>
            {displayedText}
            <span
                className={cn(
                    "w-[2px] h-[1.2em] bg-current ml-1 animate-pulse",
                    isComplete ? "opacity-0" : "opacity-100", // Hide cursor after typing? Or keep blinking? Usuall keep blinking or hide.
                    // User said "writing style animated", implies the action of writing.
                    // I will hide it after completion to look cleaner, or keep it if "terminal" style.
                    // Let's keep it blinking for a bit then hide? Or just hide.
                    // Let's keep it blinking but transparent if complete?
                    // "opacity-0" hides it.
                    cursorClassName
                )}
            />
        </span>
    );
}
