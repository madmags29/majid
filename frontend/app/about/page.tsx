import { Metadata } from 'next';
import { MapPin, Users, Heart, Globe } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'About Us | AI Travel Planner for Weekend Getaways',
    description: 'Discover how Weekend Travellers uses advanced AI to curate the best 2 & 3 day weekend itineraries, hidden gems, and road trip plans for 2026.',
    keywords: [
        'AI travel planner', 'AI trip planner', 'best AI travel planner', 'vacation itinerary generator', 'custom travel itineraries', 'holiday planner AI', 'weekend getaway planner', 'weekend trip generator', 'global travel planner', 'AI travel guide', 'free AI travel planner', 'weekend travellers', 'road trip planner AI', 'AI travel assistant', 'smart travel itinerary', 'travel planner 2026', 'best travel destinations globally', 'AI trip planner destinations', 'top vacation spots worldwide', 'global weekend getaways'
    ],
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

                    <section className="space-y-8 mt-12 bg-slate-900/30 p-8 md:p-12 rounded-[2.5rem] border border-slate-800">
                        <h2 className="text-3xl font-bold text-white border-l-4 border-purple-500 pl-6">Why Trust Us? (E-E-A-T Methodology)</h2>
                        <div className="space-y-6 text-slate-300 leading-relaxed text-lg">
                            <p>
                                In 2026, the internet is flooded with unverified travel lists and automated content. At Weekend Travellers, we strictly adhere to Google's E-E-A-T guidelines (Experience, Expertise, Authoritativeness, and Trustworthiness). We don&apos;t just generate text; we curate verified, actionable experiences. Our AI engine is trained on thousands of hours of local travel journalism, user-verified reviews, and real-time transit data. Every recommendation is cross-referenced for quality, ensuring you don't end up at a closed restaurant or a tourist trap.
                            </p>
                            <p>
                                <strong>Algorithmic Transparency & Data Sourcing</strong><br/>
                                Our engine does not randomly pick attractions from a map. We use a proprietary ranking system that scores destinations based on &quot;Weekend Viability.&quot; This score calculates factors such as airport proximity to downtown cores, the density of top-rated local dining within walking distance, and the average time spent in transit versus time spent exploring. If a destination requires too much logistical friction for a 48-hour trip, our algorithm filters it out.
                            </p>
                            <p>
                                <strong>Human-in-the-Loop Editorial Process</strong><br/>
                                While AI provides the data backbone, human expertise ensures the soul of travel remains intact. Our global network of destination experts regularly audits our AI-generated itineraries. They adjust the pacing to ensure you aren't rushing from landmark to landmark, and they verify that the &quot;hidden gems&quot; recommended are genuinely authentic and culturally respectful. We firmly believe that AI should assist human curation, not replace it.
                            </p>
                            <p>
                                <strong>Commitment to Sustainable Travel</strong><br/>
                                Weekend getaways have historically contributed to high carbon footprints per day of travel. We are committed to changing this narrative. Our platform actively promotes train travel and public transit networks where available, and our hotel recommendations prioritize properties with verified eco-certifications. We also work to combat overtourism by highlighting secondary cities and off-season windows, ensuring your visit supports local economies without straining infrastructure.
                            </p>
                        </div>
                        <ul className="grid md:grid-cols-2 gap-6 list-none p-0 mt-8">
                            <li className="flex gap-4 items-start bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
                                <div className="bg-blue-500/10 p-2 rounded-lg mt-1"><Users className="w-5 h-5 text-blue-400" /></div>
                                <div>
                                    <span className="block font-bold text-white">Community Driven</span>
                                    <span className="text-sm text-slate-400">Our geographical data is refined by continuous feedback and active reviews from thousands of weekend travelers worldwide.</span>
                                </div>
                            </li>
                            <li className="flex gap-4 items-start bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
                                <div className="bg-purple-500/10 p-2 rounded-lg mt-1"><MapPin className="w-5 h-5 text-purple-400" /></div>
                                <div>
                                    <span className="block font-bold text-white">Hyper-Local Logistics</span>
                                    <span className="text-sm text-slate-400">We prioritize local transit efficiency and pedestrian-friendly zones to maximize your time exploring over time spent commuting.</span>
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
