import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Frequently Asked Questions | Weekend Travellers AI Assistant',
    description: 'Find answers to common questions about using our AI travel planner, customizing itineraries, and managing your weekend trips.',
};

export default function FAQLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
