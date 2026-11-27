import type { Metadata } from 'next';
import Link from 'next/link';
import InnerHeader from '@/components/InnerHeader';
import Breadcrumbs from '@/components/Breadcrumbs';
import { User, Mail, ShieldCheck } from 'lucide-react';
import { SUPPORT_EMAIL } from '@/lib/config';

export const metadata: Metadata = {
    title: 'Authors & Editorial Team | Weekend Travellers',
    description: 'Meet the founder and editorial team behind Weekend Travellers, and learn how our destination guides are authored and maintained.',
    alternates: { canonical: '/authors' },
};

export default function AuthorsPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <InnerHeader title="Authors & Team" subtitle="Who Runs Weekend Travellers" showBack backHref="/" />
            <div className="max-w-4xl mx-auto w-full px-6 pt-6">
                <Breadcrumbs items={[{ label: 'Authors', href: '/authors', active: true }]} />
            </div>

            <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
                <header className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
                        Authors &amp; Editorial Team
                    </h1>
                    <p className="text-lg text-slate-300 leading-relaxed">
                        Transparency matters. Below is the real team operating <strong>weekendtravellers.com</strong>, along with how editorial guides and AI-assisted planning tools are maintained.
                    </p>
                </header>

                <div className="grid gap-6">
                    <article className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row gap-6 items-start">
                        <div className="w-16 h-16 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0">
                            <User className="w-8 h-8 text-blue-400" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-3">
                                <h2 className="text-2xl font-bold text-white">Majid Khan</h2>
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                                    Founder, Product Architect &amp; Editor
                                </span>
                            </div>
                            <p className="text-slate-300 leading-relaxed text-sm">
                                Majid Khan is the creator and operator of Weekend Travellers (web and Android). Based in India, he oversees product design, route-planning tools, destination data curation, and editorial quality reviews across India and international weekend guides.
                            </p>
                            <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-400">
                                <a href={`mailto:${SUPPORT_EMAIL}`} className="inline-flex items-center gap-1.5 text-blue-400 hover:underline">
                                    <Mail className="w-3.5 h-3.5" /> {SUPPORT_EMAIL}
                                </a>
                            </div>
                        </div>
                    </article>

                    <article className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row gap-6 items-start">
                        <div className="w-16 h-16 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-8 h-8 text-purple-400" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-3">
                                <h2 className="text-2xl font-bold text-white">Weekend Travellers Editorial Team</h2>
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                                    Research &amp; Fact-Checking Desk
                                </span>
                            </div>
                            <p className="text-slate-300 leading-relaxed text-sm">
                                Articles published under the Weekend Travellers Editorial Team byline are structured using AI-assisted research and reviewed against public tourism boards, highway/rail transit schedules, and seasonal travel advisories. Read our{' '}
                                <Link href="/editorial-policy" className="text-blue-400 hover:underline">Editorial Policy</Link>{' '}
                                for full details on how AI and human review work together.
                            </p>
                        </div>
                    </article>
                </div>
            </main>
        </div>
    );
}

