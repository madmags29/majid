import { Metadata } from 'next';
import SuspendedChatClient from './ChatClient';

export const metadata: Metadata = {
    title: 'Plan Your Perfect Trip | Chat with AI',
    description: 'Tell our AI about your dream weekend trip and let it generate a personalized itinerary instantly.',
};

export default function ChatPage() {
    return <SuspendedChatClient />;
}
