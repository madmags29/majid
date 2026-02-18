'use client';

import { Suspense } from 'react';
import AnalyticsTracker from './AnalyticsTracker';

export default function AnalyticsWrapper() {
    return (
        <Suspense fallback={null}>
            <AnalyticsTracker />
        </Suspense>
    );
}
