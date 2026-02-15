import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Reset Password | Weekend Travellers',
    description: 'Securely reset your Weekend Travellers account password.',
    robots: {
        index: false,
        follow: false,
    },
};

export default function ResetPasswordLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
