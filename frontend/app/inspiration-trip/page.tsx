import { Metadata } from 'next';
import SuspendedMenuClient from './MenuClient';

export const metadata: Metadata = {
    title: 'Trip Inspiration | Discover Unique Weekend Getaways',
    description: 'Browse curated collections of top-rated weekend getaways and hidden gems. Find your next travel inspiration, from mountain cabins to beachside escapes.',
    keywords: ['trip inspiration', 'unique getaways', 'hidden travel gems', 'weekend escape ideas', 'holiday inspiration', 'AI trip planner', 'romantic getaways', 'solo travel ideas', 'best vacation spots', 'weekend road trips'],
    openGraph: {
        title: 'Trip Inspiration | Discover Unique Weekend Getaways',
        description: 'Browse curated collections of top-rated weekend getaways and hidden gems. Find your next travel inspiration, from mountain cabins to beachside escapes.',
        type: 'website',
    }
};

export default function WeekendMenuPage() {
    return <SuspendedMenuClient />;
}
