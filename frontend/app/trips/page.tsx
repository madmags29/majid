import { Metadata } from 'next';
import TripsContent from '@/components/TripsContent';

export const metadata: Metadata = {
    title: 'Saved Trips & Itineraries | Your Custom Weekend Getaways',
    description: 'View and manage your saved weekend getaways and travel plans. Keep all your curated AI itineraries natively stored.',
    keywords: ['saved trips', 'my itineraries', 'travel plans', 'weekend logs', 'holiday management'],
    openGraph: {
        title: 'Saved Trips & Itineraries | Your Custom Weekend Getaways',
        description: 'View and manage your saved weekend getaways and travel plans. Keep all your curated AI itineraries natively stored.',
        type: 'website',
    }
};

export default function TripsPage() {
    return <TripsContent />;
}
