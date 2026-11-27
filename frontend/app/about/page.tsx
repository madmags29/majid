import { Metadata } from 'next';
import { MapPin, Users, Heart, Globe } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'About Us | Weekend Travellers',
    description: 'Learn who runs Weekend Travellers, how we research 2-to-4 day weekend travel guides, and how our AI planning tools and editorial reviews work.',
    openGraph: {
        title: 'About Us | Weekend Travellers',
        description: 'Learn who runs Weekend Travellers, how we research weekend travel guides, and how our planning tools work.',
        type: 'website',
    },
    alternates: {
        canonical: '/about',
    },
};

export default function AboutPage() {
    const aboutPageSchema = {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'About Weekend Travellers',
        url: 'https://weekendtravellers.com/about',
        description: 'Discover how Weekend Travellers uses advanced AI to curate the best 2 & 3 day weekend itineraries, hidden gems, and road trip plans.',
        mainEntity: {
            '@type': 'Organization',
            name: 'Weekend Travellers',
            url: 'https://weekendtravellers.com',
            logo: 'https://weekendtravellers.com/icon.svg',
            foundingDate: '2024',
            description: 'Global AI travel planner and intelligent weekend getaway generator.'
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-20 px-6">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
            />
            <div className="max-w-4xl mx-auto space-y-16">
                {/* Header */}
                <div className="text-center space-y-6">
                    <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white uppercase">
                        Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Story</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Redefining the way you experience short getaways through the power of Artificial Intelligence and local passion.
                    </p>
                </div>

                {/* Main Content */}
                <div className="prose prose-invert max-w-none">
                    <section className="space-y-8">
                        <h2 className="text-3xl font-bold text-white border-l-4 border-blue-500 pl-6">The Problem We Solve</h2>
                        <p className="text-lg text-slate-300 leading-relaxed">
                            Planning a 2-week vacation is exciting, but planning a 2-day weekend getaway often feels like more work than it&apos;s worth. Between finding the right destination, coordinating travel timings, and vetting restaurant reviews, hours are wasted on research. 
                        </p>
                        <p className="text-lg text-slate-300 leading-relaxed">
                            In 2024, a group of dedicated travelers and data scientists asked: <strong>&quot;What if you could plan a perfect weekend in under 60 seconds?&quot;</strong> That question led to the birth of <strong>Weekend Travellers</strong>.
                        </p>
                    </section>

                    <div className="grid md:grid-cols-2 gap-12 py-12">
                        <div className="bg-slate-900/50 p-10 rounded-[2rem] border border-slate-800 space-y-6">
                            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                <Globe className="text-blue-400" /> Our Mission
                            </h3>
                            <p className="text-slate-400 leading-relaxed">
                                To democratize travel planning. We believe everyone deserves a rejuvenating break without the administrative burden. Our mission is to provide 2026-ready, AI-driven itineraries that focus on local authenticity, sustainability, and efficiency.
                            </p>
                        </div>
                        <div className="bg-slate-900/50 p-10 rounded-[2rem] border border-slate-800 space-y-6">
                            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                <Heart className="text-pink-400" /> Our Vision
                            </h3>
                            <p className="text-slate-400 leading-relaxed">
                                To become the world&apos;s most trusted travel companion for short-form tourism. We envision a future where travel is spontaneous, stress-free, and deeply connected to local cultures, facilitated by smart technology that understands your unique pulse.
                            </p>
                        </div>
                    </div>

                    <section className="space-y-8 mt-12 bg-slate-900/30 p-8 md:p-12 rounded-[2.5rem] border border-slate-800">
                        <h2 className="text-3xl font-bold text-white border-l-4 border-purple-500 pl-6">How We Research &amp; Maintain Guides</h2>
                        <div className="space-y-6 text-slate-300 leading-relaxed text-lg">
                            <p>
                                Weekend Travellers is an independent travel publication and trip-planning platform founded by <strong>Majid Khan</strong>. Our focus is simple: practical 2-to-4 day itineraries with realistic travel times, route guidance, and transparent budget ranges.
                            </p>
                            <p>
                                <strong>Honest Use of AI &amp; Editorial Review</strong><br/>
                                We use AI tools to help structure custom trip plans in our interactive planner and draft initial destination outlines. Every curated editorial guide is reviewed for geographical feasibility, seasonal fit, and clear separation between verified reference facts and planning estimates. Read our full{' '}
                                <Link href="/editorial-policy" className="text-blue-400 hover:underline">Editorial Policy</Link>{' '}
                                and{' '}
                                <Link href="/disclaimer" className="text-blue-400 hover:underline">Travel Disclaimer</Link>.
                            </p>
                            <p>
                                <strong>Corrections &amp; Transparency</strong><br/>
                                Prices, road conditions, and attraction timings change over time. If you spot anything outdated, you can report it anytime via our{' '}
                                <Link href="/corrections-policy" className="text-blue-400 hover:underline">Corrections Policy</Link>{' '}
                                or <Link href="/contact" className="text-blue-400 hover:underline">Contact page</Link>.
                            </p>
                        </div>
                        <ul className="grid md:grid-cols-2 gap-6 list-none p-0 mt-8">
                            <li className="flex gap-4 items-start bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
                                <div className="bg-blue-500/10 p-2 rounded-lg mt-1"><Users className="w-5 h-5 text-blue-400" /></div>
                                <div>
                                    <span className="block font-bold text-white">Meet the Team</span>
                                    <span className="text-sm text-slate-400">Learn who operates the site on our <Link href="/authors" className="text-blue-400 hover:underline">Authors &amp; Editorial Team</Link> page.</span>
                                </div>
                            </li>
                            <li className="flex gap-4 items-start bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
                                <div className="bg-purple-500/10 p-2 rounded-lg mt-1"><MapPin className="w-5 h-5 text-purple-400" /></div>
                                <div>
                                    <span className="block font-bold text-white">Weekend-First Logistics</span>
                                    <span className="text-sm text-slate-400">We prioritize realistic transit windows and compact sightseeing clusters suited for 48–72 hour trips.</span>
                                </div>
                            </li>
                        </ul>
                    </section>
                </div>

                {/* Fact-Checked Platform Scope */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-t border-b border-slate-800">
                    <div className="text-center space-y-2">
                        <div className="text-4xl font-black text-white">2024</div>
                        <div className="text-xs uppercase tracking-widest font-bold text-slate-500">Founded</div>
                    </div>
                    <div className="text-center space-y-2">
                        <div className="text-4xl font-black text-white">68+</div>
                        <div className="text-xs uppercase tracking-widest font-bold text-slate-500">Destination Guides</div>
                    </div>
                    <div className="text-center space-y-2">
                        <div className="text-4xl font-black text-white">2–4</div>
                        <div className="text-xs uppercase tracking-widest font-bold text-slate-500">Day Trip Focus</div>
                    </div>
                    <div className="text-center space-y-2">
                        <div className="text-4xl font-black text-white">Free</div>
                        <div className="text-xs uppercase tracking-widest font-bold text-slate-500">Planning Tools</div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center pt-12">
                    <h3 className="text-2xl font-bold text-white mb-6">Ready for your next adventure?</h3>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-lg shadow-blue-900/40">
                            Start Planning Now
                        </Link>
                        <Link href="/contact" className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 px-10 rounded-2xl transition-all border border-slate-700">
                            Contact Our Team
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
