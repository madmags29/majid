import { Metadata } from 'next';

export const metadata = {
    title: 'Contact Us | AI Trip Planning & Weekend Getaway Support',
    description: 'Need help planning your weekend trip? Contact the Weekend Travellers support team.',
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
