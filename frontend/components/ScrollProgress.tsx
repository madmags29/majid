'use client';

import { useState } from 'react';
import { motion, useScroll, useSpring, useMotionValueEvent } from 'framer-motion';

export default function ScrollProgress() {
    const { scrollYProgress, scrollY } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const [isVisible, setIsVisible] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest > 50) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    });

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-[6px] bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 z-[100000] origin-left shimmer-effect"
            style={{
                scaleX,
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out'
            }}
        />
    );
}
