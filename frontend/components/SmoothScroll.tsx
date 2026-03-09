'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import { ReactNode, useEffect } from 'react';

export default function SmoothScroll({ children }: { children: ReactNode }) {
    const lenis = useLenis((root) => {
        // optional: track scroll progress or other events
    });

    useEffect(() => {
        // Add lenis-specific styles to handle the scrolling root
        document.documentElement.classList.add('lenis');

        return () => {
            document.documentElement.classList.remove('lenis');
        };
    }, []);

    return (
        <ReactLenis root options={{
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 1.1,
            touchMultiplier: 2,
        }}>
            {children}
        </ReactLenis>
    );
}
