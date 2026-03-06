import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'User Profile | Manage Your AI Trip Plans & Getaways',
    description: 'Manage your account settings, preferences, and profile information.',
    alternates: {
        canonical: '/profile',
    },
};

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
