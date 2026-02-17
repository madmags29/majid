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

    // Get or create session ID
    const getSessionId = useCallback(() => {
        let sid = sessionStorage.getItem('session_id');
        if (!sid) {
            sid = uuidv4();
            sessionStorage.setItem('session_id', sid);
        }
        return sid;
    }, []);

    const trackEvent = useCallback(async (action: string, metadata: any = {}, duration: number = 0) => {
        try {
            const visitorId = getVisitorId();
            const sessionId = getSessionId();
            const referrer = document.referrer;
            const userStr = localStorage.getItem('user');
            const userId = userStr ? JSON.parse(userStr)._id : undefined;

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
                    sessionId,
                    userId,
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
    }, [pathname, searchParams, getVisitorId, getSessionId]);

    // Expose trackEvent globally
    useEffect(() => {
        if (typeof window !== 'undefined') {
            (window as any).trackWtripEvent = trackEvent;
        }
    }, [trackEvent]);

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
