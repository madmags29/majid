import type { Metadata } from 'next';
import Link from 'next/link';
import InnerHeader from '@/components/InnerHeader';
import Breadcrumbs from '@/components/Breadcrumbs';
import { ShieldCheck, Bot, CheckCircle2, FileText, AlertCircle } from 'lucide-react';
import { SUPPORT_EMAIL } from '@/lib/config';

export const metadata: Metadata = {
    title: 'Editorial Policy | How We Research & Verify Guides',
    description: 'Learn how Weekend Travellers researches destinations, uses AI responsibly, verifies transport and budget estimates, and maintains editorial independence.',
    alternates: { canonical: '/editorial-policy' },
};

export default function EditorialPolicyPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <InnerHeader title="Editorial Policy" subtitle="Standards & Methodology" showBack backHref="/" />
            <div className="max-w-4xl mx-auto w-full px-6 pt-6">
                <Breadcrumbs items={[{ label: 'Editorial Policy', href: '/editorial-policy', active: true }]} />
            </div>

            <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
                <header className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
                        <ShieldCheck className="w-3.5 h-3.5" /> Editorial Standards
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
                        Editorial Policy &amp; Research Methodology
                    </h1>
                    <p className="text-slate-400 text-sm">Last reviewed: November 27, 2026</p>
                    <p className="text-lg text-slate-300 leading-relaxed">
                        Weekend Travellers (<span className="text-blue-400">weekendtravellers.com</span>) publishes practical weekend travel guides, route breakdowns, and interactive planning tools. Our goal is to help travelers make informed, realistic decisions for 2-to-4 day trips.
                    </p>
                </header>

                <section className="space-y-4 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
                        <Bot className="w-6 h-6 text-purple-400" /> 1. How We Use AI &amp; Human Review
                    </h2>
                    <p className="text-slate-300 leading-relaxed">
                        We use AI tools to assist with structuring itineraries, summarizing regional geography, and generating custom route suggestions in our interactive planner. However, AI-generated outputs can be outdated or inaccurate.
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-300">
                        <li><strong>Editorial Guides:</strong> Curated destination guides and travel stories are reviewed for realistic travel times, seasonal suitability, and practical logistics before being marked as reviewed.</li>
                        <li><strong>Interactive Planner Outputs:</strong> Custom itineraries generated on demand via Search or Chat are clearly labeled as AI-assisted planning estimates. Users should verify live transport schedules, entry fees, and opening hours before booking.</li>
                        <li><strong>No Fabricated First-Hand Claims:</strong> We do not invent fictional travel writers, fake first-person anecdotes, or fabricated user reviews.</li>
                    </ul>
                </section>

                <section className="space-y-4 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" /> 2. Facts vs. Estimates vs. Guidance
                    </h2>
                    <p className="text-slate-300 leading-relaxed">
                        Across our destination guides and tools, we distinguish between three types of information:
                    </p>
                    <div className="grid md:grid-cols-3 gap-4 pt-2">
                        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                            <h3 className="font-bold text-white mb-1 text-sm">Verified Reference Data</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">Coordinates, official destination names, highway corridors, and established seasonal weather patterns.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                            <h3 className="font-bold text-white mb-1 text-sm">Planning Estimates</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">Typical hotel ranges, meal budgets, fuel/transit costs, and driving durations. Prices fluctuate by season and availability.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                            <h3 className="font-bold text-white mb-1 text-sm">Editorial Guidance</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">Pacing advice, family/couple/solo suitability notes, and neighborhood recommendations for short stays.</p>
                        </div>
                    </div>
                </section>

                <section className="space-y-4 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
                        <FileText className="w-6 h-6 text-blue-400" /> 3. Updates, Sourcing &amp; Independence
                    </h2>
                    <p className="text-slate-300 leading-relaxed">
                        Dates shown on our editorial guides reflect when an article was published or substantively reviewed. We do not artificially bump dates without reviewing content.
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                        Weekend Travellers may display advertising (such as Google AdSense) and partner accommodation links (such as Agoda/Travelpayouts). Commercial partnerships never dictate which destinations we recommend or how we rate suitability.
                    </p>
                </section>

                <section className="space-y-4 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
                        <AlertCircle className="w-6 h-6 text-amber-400" /> 4. Corrections &amp; Feedback
                    </h2>
                    <p className="text-slate-300 leading-relaxed">
                        Spotted an outdated ticket fee, closed attraction, or incorrect route? Read our{' '}
                        <Link href="/corrections-policy" className="text-blue-400 hover:underline">Corrections Policy</Link>{' '}
                        or email us directly at{' '}
                        <a href={`mailto:${SUPPORT_EMAIL}`} className="text-blue-400 hover:underline">{SUPPORT_EMAIL}</a>.
                    </p>
                </section>
            </main>
        </div>
    );
}

