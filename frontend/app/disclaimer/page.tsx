import type { Metadata } from 'next';
import Link from 'next/link';
import InnerHeader from '@/components/InnerHeader';
import Breadcrumbs from '@/components/Breadcrumbs';
import { AlertTriangle } from 'lucide-react';
import { SUPPORT_EMAIL } from '@/lib/config';

export const metadata: Metadata = {
    title: 'Travel & AI Disclaimer | Weekend Travellers',
    description: 'Important disclaimers regarding AI-generated travel itineraries, cost estimates, safety, and third-party partner links on Weekend Travellers.',
    alternates: { canonical: '/disclaimer' },
};

export default function DisclaimerPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <InnerHeader title="Travel Disclaimer" subtitle="Estimates & Limitations" showBack backHref="/" />
            <div className="max-w-4xl mx-auto w-full px-6 pt-6">
                <Breadcrumbs items={[{ label: 'Travel Disclaimer', href: '/disclaimer', active: true }]} />
            </div>

            <main className="max-w-4xl mx-auto px-6 py-12 space-y-8">
                <header className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
                        <AlertTriangle className="w-3.5 h-3.5" /> Important Notice
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">Travel &amp; AI Estimate Disclaimer</h1>
                    <p className="text-slate-400 text-sm">Last reviewed: November 27, 2026</p>
                </header>

                <section className="space-y-5 text-slate-300 leading-relaxed">
                    <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                        <h2 className="text-xl font-bold text-white mb-2">1. Planning Estimates, Not Real-Time Quotes</h2>
                        <p className="text-sm">
                            All itineraries, trip budgets, fuel calculations, hotel price ranges, attraction entry fees, and travel durations on Weekend Travellers are <strong>informational planning estimates</strong>. They are not live quotes, guaranteed fares, or confirmed reservations. Always verify real-time prices, weather alerts, road closures, and ticket availability before departing.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-white mb-2">2. AI-Assisted Content Limitations</h2>
                        <p>
                            Our interactive Search, AI Chat, and custom itinerary tools use large language models alongside curated destination data. While designed to be helpful, AI outputs may occasionally suggest outdated business hours or seasonal routes. Use them as a starting framework and confirm critical logistics locally.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-white mb-2">3. Advertising &amp; Affiliate Disclosure</h2>
                        <p>
                            Weekend Travellers is free to use and is supported by display advertising (including Google AdSense) and third-party travel booking links (such as Agoda or Travelpayouts). If you click a partner link and complete a booking, we may earn a small commission at no extra cost to you. We do not process payments or manage hotel reservations directly.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-white mb-2">4. Personal Safety &amp; Travel Responsibility</h2>
                        <p>
                            Travelers are responsible for checking visa rules, local permits (such as Inner Line Permits in Himalayan regions), health advisories, and weather conditions. For questions or corrections, contact{' '}
                            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-blue-400 hover:underline">{SUPPORT_EMAIL}</a> or visit our{' '}
                            <Link href="/contact" className="text-blue-400 hover:underline">Contact page</Link>.
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
}

