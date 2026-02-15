import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us | Weekend Travellers - AI Trip Planning Support',
    description: 'Get in touch with the Weekend Travellers team for support, destination inquiries, or feedback on our AI itinerary generator.',
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
