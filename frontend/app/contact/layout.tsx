import { Metadata } from 'next';

export const metadata = {
    title: 'Contact Us | AI Trip Planning & Weekend Getaway Support',
    description: 'Need help planning your weekend trip? Contact the Weekend Travellers support team for inquiries, bug reports, and partnership opportunities.',
    keywords: ['contact weekend travellers', 'trip planner support', 'travel customer service'],
    openGraph: {
        title: 'Contact Us | AI Trip Planning & Weekend Getaway Support',
        description: 'Need help planning your weekend trip? Contact the Weekend Travellers support team for inquiries, bug reports, and partnership opportunities.',
        type: 'website',
    },
    alternates: {
        canonical: '/contact',
    },
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
