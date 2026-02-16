'use client';

import { useEffect, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { API_URL } from '@/lib/config';

export default function AnalyticsTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Get or create visitor ID
    const getVisitorId = useCallback(() => {
        let vid = localStorage.getItem('visitor_id');
        if (!vid) {
            vid = uuidv4();
            localStorage.setItem('visitor_id', vid);
        }
        return vid;
    }, []);

    const trackEvent = useCallback(async (action: string, metadata: any = {}, duration: number = 0) => {
        try {
            const visitorId = getVisitorId();
            const referrer = document.referrer;

            // Collect UTM params
            const utmParams: any = {};
            searchParams.forEach((value, key) => {
                if (key.startsWith('utm_')) {
                    utmParams[key] = value;
                }
            });

            await fetch(`${API_URL}/api/analytics/track`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    visitorId,
                    path: pathname,
                    action,
                    metadata: { ...metadata, ...utmParams },
                    referrer,
                    duration
                }),
            });
        } catch (error) {
            console.error('Tracking failed', error);
        }
    }, [pathname, searchParams, getVisitorId]);

    // Track Pageview on route change
    useEffect(() => {
        trackEvent('pageview');
    }, [pathname, trackEvent]);

    // Heartbeat every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            trackEvent('heartbeat', {}, 30);
        }, 30000);

        return () => clearInterval(interval);
    }, [trackEvent]);

    return null; // Component does not render anything
}
