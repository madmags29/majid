import { Metadata } from 'next';
import TripsContent from '@/components/TripsContent';

export const metadata: Metadata = {
    title: 'My Saved Trips & Itineraries',
    description: 'View and manage your saved weekend getaways and travel plans.',
};

export default function TripsPage() {
    return <TripsContent />;
}
