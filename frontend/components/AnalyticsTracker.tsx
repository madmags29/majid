"use client";

import { useEffect, useTransition } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { API_URL } from '@/lib/config';

export default function AnalyticsTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        const trackPageview = async () => {
            try {
                // Get or create session ID
                let sessionId = localStorage.getItem('wt_session_id');
                if (!sessionId) {
                    sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
                    localStorage.setItem('wt_session_id', sessionId);
                }

                const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;

                const payload = {
                    sessionId,
                    userId: user?.id,
                    page: pathname,
                    referrer: document.referrer,
                    device: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
                    timestamp: new Date().toISOString()
                };

                // Use sendBeacon for more reliable fires on page hide, or simple fetch for route changes
                fetch(`${API_URL}/api/admin/track/pageview`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                    keepalive: true
                }).catch(err => console.debug("Tracking failed", err));

            } catch (err) {
                // Fail silently to not impact user
            }
        };

        trackPageview();
    }, [pathname, searchParams]);

    return null;
}
