import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'FAQ | AI Trip Planner & Weekend Getaway Questions',
    description: 'Find answers to common questions about using our AI travel planner, customizing itineraries, and managing your weekend trips.',
    alternates: {
        canonical: '/faq',
    },
};

export default function FAQLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
