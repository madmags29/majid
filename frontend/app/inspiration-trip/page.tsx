import { Metadata } from 'next';
import SuspendedMenuClient from './MenuClient';

export const metadata: Metadata = {
    title: 'Inspirational Trip | Weekend Travellers',
    description: 'Explore our curated inspiration trips and discover your perfect escape.',
};

export default function WeekendMenuPage() {
    return <SuspendedMenuClient />;
}
