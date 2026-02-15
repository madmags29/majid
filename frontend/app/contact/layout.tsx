import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us | Weekend Travellers - AI Trip Planning Support',
    description: 'Get in touch with the Weekend Travellers team for support, destination inquiries, or feedback on our smart travel planner.',
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
