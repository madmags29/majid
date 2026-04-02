import { Metadata } from 'next';
import { MapPin, Users, Heart, Globe } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'About Us | AI Travel Planner for Weekend Getaways',
    description: 'Discover how Weekend Travellers uses advanced AI to curate the best 2 & 3 day weekend itineraries, hidden gems, and road trip plans for 2026.',
    keywords: ['about weekend travellers', 'AI travel team', 'travel planner mission', 'our story', 'AI travel planner', 'weekend getaways team', 'smart travel itineraries'],
    openGraph: {
        title: 'About Us | AI Travel Planner for Weekend Getaways',
        description: 'Discover how Weekend Travellers uses advanced AI to curate the best 2 & 3 day weekend itineraries, hidden gems, and road trip plans for 2026.',
        type: 'website',
    },
    alternates: {
        canonical: '/about',
    },
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-20 px-6">
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

                    <section className="space-y-8">
                        <h2 className="text-3xl font-bold text-white border-l-4 border-purple-500 pl-6">Why Trust Us? (E-E-A-T)</h2>
                        <p className="text-lg text-slate-300 leading-relaxed">
                            We don&apos;t just generate text; we curate experiences. Our AI engine is trained on verified travel data, local blogs, and real-time transit information. Every recommendation is cross-referenced for quality and relevance. 
                        </p>
                        <ul className="grid md:grid-cols-2 gap-6 list-none p-0">
                            <li className="flex gap-4 items-start">
                                <div className="bg-blue-500/10 p-2 rounded-lg mt-1"><Users className="w-5 h-5 text-blue-400" /></div>
                                <div>
                                    <span className="block font-bold text-white">Community First</span>
                                    <span className="text-sm text-slate-400">Our logs are refined by feedback from thousands of real travelers.</span>
                                </div>
                            </li>
                            <li className="flex gap-4 items-start">
                                <div className="bg-purple-500/10 p-2 rounded-lg mt-1"><MapPin className="w-5 h-5 text-purple-400" /></div>
                                <div>
                                    <span className="block font-bold text-white">Hyper-Local Data</span>
                                    <span className="text-sm text-slate-400">We prioritize &quot;hidden gems&quot; over typical tourist traps for a unique vibe.</span>
                                </div>
                            </li>
                        </ul>
                    </section>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-t border-b border-slate-800">
                    <div className="text-center space-y-2">
                        <div className="text-4xl font-black text-white">2024</div>
                        <div className="text-xs uppercase tracking-widest font-bold text-slate-500">Established</div>
                    </div>
                    <div className="text-center space-y-2">
                        <div className="text-4xl font-black text-white">100+</div>
                        <div className="text-xs uppercase tracking-widest font-bold text-slate-500">Global Cities</div>
                    </div>
                    <div className="text-center space-y-2">
                        <div className="text-4xl font-black text-white">50k+</div>
                        <div className="text-xs uppercase tracking-widest font-bold text-slate-500">Active Users</div>
                    </div>
                    <div className="text-center space-y-2">
                        <div className="text-4xl font-black text-white">AI</div>
                        <div className="text-xs uppercase tracking-widest font-bold text-slate-500">Integration</div>
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
