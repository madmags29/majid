import { Metadata } from 'next';
import SuspendedMenuClient from './MenuClient';

export const metadata: Metadata = {
    title: 'Trip Inspiration | Discover Unique Weekend Getaways',
    description: 'Browse curated collections of top-rated weekend getaways and hidden gems.',
};

export default function WeekendMenuPage() {
    return <SuspendedMenuClient />;
}
