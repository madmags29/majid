import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Weekend Travel Planning Tools | Budget & Distance Calculators',
    description: 'Estimate realistic weekend trip budgets, check driving distances from major cities, and evaluate 2-to-4 day travel feasibility.',
    alternates: { canonical: '/tools' },
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

