'use client';

import { useEffect, useRef, useState } from 'react';

interface AdBannerProps {
    dataAdSlot: string;
    dataAdFormat?: string;
    dataFullWidthResponsive?: boolean;
    className?: string;
}

const AdBanner = ({
    dataAdSlot,
    dataAdFormat = 'auto',
    dataFullWidthResponsive = true,
    className = '',
}: AdBannerProps) => {
    const adRef = useRef<HTMLModElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        // Only run after the component is fully mounted and has a parent with width
        const timer = setTimeout(() => {
            if (typeof window !== 'undefined' && adRef.current) {
                // Check if the ad is already processed
                const isProcessed = adRef.current.getAttribute('data-adsbygoogle-status') === 'done';

                if (!isProcessed && !isLoaded) {
                    try {
                        // @ts-ignore
                        (window.adsbygoogle = window.adsbygoogle || []).push({});
                        setIsLoaded(true);
                    } catch (e) {
                        console.error('AdSense error:', e);
                    }
                }
            }
        }, 500); // Wait 500ms to ensure layout is settled

        return () => clearTimeout(timer);
    }, [isLoaded]);

    if (!mounted) return null;

    return (
        <div className={`ad-container my-6 overflow-hidden flex justify-center w-full min-h-[100px] ${className}`}>
            <ins
                ref={adRef}
                className="adsbygoogle"
                style={{ display: 'block', minWidth: '250px' }}
                data-ad-client="ca-pub-9460255466960810"
                data-ad-slot={dataAdSlot}
                data-ad-format={dataAdFormat}
                data-full-width-responsive={dataFullWidthResponsive.toString()}
            />
        </div>
    );
};

export default AdBanner;
