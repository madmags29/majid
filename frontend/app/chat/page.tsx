import { Metadata } from 'next';
import SuspendedChatClient from './ChatClient';

export const metadata: Metadata = {
    title: 'AI Travel Assistant | Chat & Plan Your Weekend Trip',
    description: 'Chat with our intelligent travel assistant to instantly create custom 2-3 day weekend plans. Get advice, weather updates, and personalized recommendations.',
    keywords: ['AI travel assistant', 'travel chatbot', 'trip planning chat', 'AI vacation planner', 'weekend trip helper'],
    openGraph: {
        title: 'AI Travel Assistant | Chat & Plan Your Weekend Trip',
        description: 'Chat with our intelligent travel assistant to instantly create custom 2-3 day weekend plans. Get advice, weather updates, and personalized recommendations.',
        type: 'website',
    }
};

export default function ChatPage() {
    return <SuspendedChatClient />;
}
