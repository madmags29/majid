import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'FAQ | AI Trip Planner & Weekend Getaway Questions',
    description: 'Find answers to common questions about using our AI travel planner, customizing itineraries, and managing your weekend trips.',
    keywords: ['FAQ', 'weekend trips faq', 'AI travel planner help', 'how to use weekend travellers', 'weekend getaways questions', 'vacation planner faq', 'trip generator help'],
    openGraph: {
        title: 'FAQ | AI Trip Planner & Weekend Getaway Questions',
        description: 'Find answers to common questions about using our AI travel planner, customizing itineraries, and managing your weekend trips.',
        type: 'website',
    },
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
