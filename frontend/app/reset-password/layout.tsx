import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Reset Password | Weekend Travellers Travel App',
    description: 'Securely reset the password for your Weekend Travellers account.',
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
