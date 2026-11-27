import type { Metadata } from 'next';
import Link from 'next/link';
import InnerHeader from '@/components/InnerHeader';
import Breadcrumbs from '@/components/Breadcrumbs';
import { RefreshCw, Mail } from 'lucide-react';
import { SUPPORT_EMAIL } from '@/lib/config';

export const metadata: Metadata = {
    title: 'Corrections Policy | Weekend Travellers',
    description: 'How Weekend Travellers handles factual corrections, outdated prices, route changes, and reader feedback.',
    alternates: { canonical: '/corrections-policy' },
};

export default function CorrectionsPolicyPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <InnerHeader title="Corrections Policy" subtitle="Accuracy & Updates" showBack backHref="/" />
            <div className="max-w-4xl mx-auto w-full px-6 pt-6">
                <Breadcrumbs items={[{ label: 'Corrections Policy', href: '/corrections-policy', active: true }]} />
            </div>

            <main className="max-w-4xl mx-auto px-6 py-12 space-y-8">
                <header className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                        <RefreshCw className="w-3.5 h-3.5" /> Accuracy Commitment
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">Corrections Policy</h1>
                    <p className="text-slate-400 text-sm">Last reviewed: November 27, 2026</p>
                </header>

                <section className="space-y-4 text-slate-300 leading-relaxed">
                    <p>
                        Travel details—such as monument entry fees, ferry timings, road conditions, and hotel price brackets—change frequently. Weekend Travellers is committed to correcting inaccuracies promptly and transparently.
                    </p>
                    <h2 className="text-2xl font-bold text-white pt-4">How to Report an Error</h2>
                    <p>
                        If you notice an error in any destination guide, blog article, or route estimate, please include:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>The exact page URL where you spotted the issue.</li>
                        <li>The specific detail that needs correction (e.g., closed venue, updated ticket fee, or route restriction).</li>
                        <li>A reference link or official source, if available.</li>
                    </ul>
                    <p>
                        Send reports to{' '}
                        <a href={`mailto:${SUPPORT_EMAIL}`} className="text-blue-400 hover:underline inline-flex items-center gap-1">
                            <Mail className="w-4 h-4" /> {SUPPORT_EMAIL}
                        </a>{' '}
                        or submit via our <Link href="/contact" className="text-blue-400 hover:underline">Contact page</Link>.
                    </p>

                    <h2 className="text-2xl font-bold text-white pt-4">How We Process Corrections</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>We review reported errors and verify them against official tourism or transit sources.</li>
                        <li>Substantive factual updates update the guide&apos;s reviewed date and note the change where helpful to readers.</li>
                        <li>Minor typos or formatting fixes are corrected without altering the article&apos;s publication date.</li>
                    </ul>
                </section>
            </main>
        </div>
    );
}

