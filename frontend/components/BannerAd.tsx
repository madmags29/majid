'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

interface BannerAdProps {
    zoneId?: string;
    className?: string;
    format?: 'banner' | 'rectangle';
}

export default function BannerAd({ zoneId = "217835", className, format = 'banner' }: BannerAdProps) {
    const adRef = useRef<HTMLDivElement>(null);

    return (
        <div className={className}>
            <Script
                src="https://quge5.com/88/tag.min.js"
                data-zone={zoneId}
                data-cfasync="false"
                strategy="lazyOnload"
            />
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 text-center font-bold opacity-50">Advertisement</div>
            <div
                ref={adRef}
                className="bg-slate-800/20 rounded-lg border border-slate-700/50 min-h-[100px] flex items-center justify-center overflow-hidden"
            >
                {/* 
                    This is a placeholder for the banner ad. 
                    If the quge5 script supports manual placement, we would inject it here.
                    For now, we keep the global script but if the user provides a specific 
                    banner tag, we should place its <div> here.
                */}
                <div id={`ad-zone-${zoneId}`} className="w-full h-full flex items-center justify-center">
                    <span className="text-slate-600 text-xs italic">Sponsored Content</span>
                </div>
            </div>
            {/* 
                If the script needs to be per-banner, we would use:
                <Script 
                    src={`https://quge5.com/88/tag.min.js`} 
                    data-zone={zoneId} 
                    strategy="lazyOnload"
                /> 
            */}
        </div>
    );
}
