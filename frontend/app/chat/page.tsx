import { Metadata } from 'next';
import SuspendedChatClient from './ChatClient';

export const metadata: Metadata = {
    title: 'AI Travel Assistant | Chat & Plan Your Weekend Trip',
    description: 'Chat with our intelligent travel assistant to instantly create custom 2-3 day weekend plans. Get advice, weather updates, and personalized recommendations.',
    keywords: [
        'AI travel planner', 'AI trip planner', 'best AI travel planner', 'vacation itinerary generator', 'custom travel itineraries', 'holiday planner AI', 'weekend getaway planner', 'weekend trip generator', 'global travel planner', 'AI travel guide', 'free AI travel planner', 'weekend travellers', 'road trip planner AI', 'AI travel assistant', 'smart travel itinerary', 'travel planner 2026', 'best travel destinations globally', 'AI trip planner destinations', 'top vacation spots worldwide', 'global weekend getaways'
    ],
    openGraph: {
        title: 'AI Travel Assistant | Chat & Plan Your Weekend Trip',
        description: 'Chat with our intelligent travel assistant to instantly create custom 2-3 day weekend plans. Get advice, weather updates, and personalized recommendations.',
        type: 'website',
    }
};

export default function ChatPage() {
    return <SuspendedChatClient />;
}
