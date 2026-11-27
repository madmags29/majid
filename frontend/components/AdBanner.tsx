'use client';
import { useEffect, useRef } from 'react';

type AdBannerProps = {
    dataAdSlot: string;
    dataAdFormat: string;
    dataFullWidthResponsive: boolean;
};

export default function AdBanner({
    dataAdSlot,
    dataAdFormat,
    dataFullWidthResponsive,
}: AdBannerProps) {
    const pushedRef = useRef(false);

    useEffect(() => {
        if (pushedRef.current) return;
        pushedRef.current = true;
        try {
            const w = window as unknown as { adsbygoogle?: unknown[] };
            (w.adsbygoogle = w.adsbygoogle || []).push({});
        } catch {
            // AdSense script not loaded or already initialized
        }
    }, []);

    return (
        <div className="my-8 flex justify-center items-center w-full min-h-[100px] bg-slate-900/20 rounded-xl border border-slate-800/50 relative overflow-hidden">
            <span className="absolute text-slate-700 text-xs font-bold uppercase tracking-widest z-0">Advertisement</span>
            <div className="w-full relative z-10">
                <ins
                    className="adsbygoogle"
                    style={{ display: 'block' }}
                    data-ad-client="ca-pub-9460255466960810"
                    data-ad-slot={dataAdSlot}
                    data-ad-format={dataAdFormat}
                    data-full-width-responsive={dataFullWidthResponsive.toString()}
                />
            </div>
        </div>
    );
}
