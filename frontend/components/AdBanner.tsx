'use client';

import { useEffect, useRef, useState } from 'react';

interface AdBannerProps {
    dataAdSlot: string;
    dataAdFormat?: string;
    dataFullWidthResponsive?: boolean;
    className?: string;
}

const AdBanner = ({
    className = '',
}: AdBannerProps) => {
    const adRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || !adRef.current) return;

        // Check if script is already present to prevent duplicate injections
        if (adRef.current.querySelector('script[src*="highperformanceformat.com"]')) {
            return;
        }

        // 1. Create the config script block
        const configScript = document.createElement('script');
        configScript.type = 'text/javascript';
        configScript.innerHTML = `
            atOptions = {
                'key' : '0a50b9a701d9e9ef3c83bf46726d6c61',
                'format' : 'iframe',
                'height' : 50,
                'width' : 320,
                'params' : {}
            };
        `;

        // 2. Create the invoke script block
        const invokeScript = document.createElement('script');
        invokeScript.type = 'text/javascript';
        invokeScript.src = 'https://www.highperformanceformat.com/0a50b9a701d9e9ef3c83bf46726d6c61/invoke.js';
        invokeScript.async = true;

        // Append to the specific container
        adRef.current.appendChild(configScript);
        adRef.current.appendChild(invokeScript);

    }, [mounted]);

    if (!mounted) return null;

    return (
        <div className={`ad-container my-6 overflow-hidden flex justify-center w-full min-h-[50px] ${className}`}>
            <div ref={adRef} className="hpf-ad-wrapper flex justify-center items-center w-[320px] h-[50px]" />
        </div>
    );
};

export default AdBanner;
