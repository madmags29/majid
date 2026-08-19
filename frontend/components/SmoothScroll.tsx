'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import { ReactNode, useEffect, useState } from 'react';

export default function SmoothScroll({ children }: { children: ReactNode }) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (!isMobile) {
            document.documentElement.classList.add('lenis');
            return () => {
                document.documentElement.classList.remove('lenis');
            };
        } else {
            document.documentElement.classList.remove('lenis');
        }
    }, [isMobile]);

    if (isMobile) {
        return <>{children}</>;
    }

    return (
        <ReactLenis root options={{
            duration: 1.0,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 1.0,
            touchMultiplier: 1.0,
        }}>
            {children}
        </ReactLenis>
    );
}
