import { Metadata } from 'next';
import SuspendedChatClient from './ChatClient';

export const metadata: Metadata = {
    title: 'AI Travel Assistant | Chat & Plan Your Weekend Trip',
    description: 'Chat with our intelligent travel assistant to instantly create custom 2-3 day weekend plans.',
};

export default function ChatPage() {
    return <SuspendedChatClient />;
}
