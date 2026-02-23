import { Metadata } from 'next';
import TripsContent from '@/components/TripsContent';

export const metadata: Metadata = {
    title: 'Saved Trips & Itineraries | Your Custom Weekend Getaways',
    description: 'View and manage your saved weekend getaways and travel plans.',
};

export default function TripsPage() {
    return <TripsContent />;
}
