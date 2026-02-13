import { Metadata } from 'next';
import SearchContent from '@/components/SearchContent';
import { Suspense } from 'react';
import CinematicLoader from '@/components/CinematicLoader';

export const metadata: Metadata = {
    title: 'Plan Your Perfect Weekend Trip | AI Itinerary Generator',
    description: 'Generate personalized 2-day travel itineraries in seconds. Tell us where you want to go, and our AI will plan your perfect weekend escape.',
};

export default function SearchPage() {
    return (
        <Suspense fallback={<CinematicLoader />}>
            <SearchContent />
        </Suspense>
    );
}
