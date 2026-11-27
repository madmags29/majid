import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, HelpCircle, Compass, ShieldCheck, CreditCard, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FaqHeader from './FaqHeader';

export const metadata: Metadata = {
    title: 'Frequently Asked Questions (FAQ) | AI Travel Planner Insights',
    description: 'Find direct answers to common questions about Weekend Travellers AI itinerary generation, budget travel, customization, hotel bookings, and travel security.',
    keywords: [
        'AI travel planner FAQ', 'weekend trip planner questions', 'AI itinerary generator help', 'weekend travellers support', 'free travel planner AI', 'micro-vacation answers'
    ],
    openGraph: {
        title: 'Frequently Asked Questions (FAQ) | Weekend Travellers',
        description: 'Find direct answers to common questions about Weekend Travellers AI itinerary generation, budget travel, customization, hotel bookings, and travel security.',
        type: 'website',
    },
    alternates: {
        canonical: '/faq',
    },
};

const faqs = [
    {
        category: "General Information",
        icon: <HelpCircle className="w-5 h-5 text-blue-400" />,
        questions: [
            {
                q: "What is weekendtravellers.com and how does it help me?",
                a: "Weekendtravellers.com is a weekend travel publication and AI-assisted trip planner designed for 2-to-4 day getaways. It brings together structured destination guides, budget and distance calculators, and custom itinerary drafting so you can plan a short trip in minutes."
            },
            {
                q: "How does the AI-assisted trip planner work?",
                a: "When you enter a destination, starting city, or travel style, our planner combines curated destination data with large language model (LLM) structuring and Open-Meteo weather forecasts to draft a day-by-day itinerary. Suggested timings, routes, and costs are planning estimates—always verify live fares and opening hours before booking."
            }
        ]
    },
    {
        category: "Planning & Customization",
        icon: <Compass className="w-5 h-5 text-purple-400" />,
        questions: [
            {
                q: "Can I customize the generated AI itineraries?",
                a: "Absolutely. We understand that travel is personal. Once an itinerary is generated, you can use our built-in AI chat interface to request granular changes. For example, you can say 'Add more kid-friendly spots', 'Switch to a luxury budget', or 'Make this more outdoorsy'. The AI will instantly restructure your plan while maintaining logistical integrity."
            },
            {
                q: "What kind of travel logistics are included?",
                a: "Itineraries include suggested neighborhood groupings, indicative transit options, and estimated budget ranges. Because local schedules and traffic vary, we recommend checking official rail, road, and attraction websites before departure."
            },
            {
                q: "How do I book the suggested hotels or flights?",
                a: "Where hotel links are shown, they connect to third-party booking partners such as Hotellook or Agoda so you can check current availability and prices directly on their platform. Weekend Travellers does not process hotel payments or manage reservations."
            }
        ]
    },
    {
        category: "Trust & Reliability",
        icon: <ShieldCheck className="w-5 h-5 text-green-400" />,
        questions: [
            {
                q: "Are the itineraries up to date?",
                a: "We prioritize current data. Our model is trained to recognize seasonal variations and current travel norms for 2026. While we recommend double-checking specific opening hours for very small local businesses, our primary attraction data is updated regularly."
            },
            {
                q: "Why should I create an account?",
                a: "An account acts as your digital travel vault. You can save unlimited itineraries, share them with friends via private links, and access your plans offline through our mobile-responsive interface. It also allows the AI to learn your preferences over time for even better recommendations."
            },
            {
                q: "How do you handle my personal data?",
                a: "Security and privacy are at our core. We use industry-standard encryption for all user data and never sell your personal information to third-party ad networks. Our revenue comes from travel partners, not from selling user data. Review our Privacy Policy for a full technical breakdown."
            }
        ]
    },
    {
        category: "Cost & Usage",
        icon: <CreditCard className="w-5 h-5 text-amber-400" />,
        questions: [
            {
                q: "Is weekendtravellers.com really free to use?",
                a: "Yes, the core planning engine, AI chat customization, and itinerary saving features are completely free for our users. We strive to provide the best travel planning experience without any paywalls or hidden subscriptions for the basic traveler."
            },
            {
                q: "Do you offer group planning?",
                a: "You can share any itinerary link with travel companions so everyone can review the day-by-day plan. Multi-user collaborative editing is not currently offered."
            }
        ]
    }
];

export default function FAQPage() {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.flatMap(category => 
            category.questions.map(faq => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.a
                }
            }))
        )
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            {/* Header / Navigation */}
            <FaqHeader />

            <main className="container mx-auto px-4 py-16 max-w-4xl">
                {/* Hero Section */}
                <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
                        Frequently Asked <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Questions</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Everything you need to know about planning your perfect weekend getaway with our AI assistant.
                    </p>
                </div>

                {/* FAQ Content */}
                <div className="space-y-16">
                    {faqs.map((category, catIdx) => (
                        <div key={catIdx} className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                            <div className="flex items-center gap-3 mb-8 border-b border-slate-800 pb-4">
                                {category.icon}
                                <h2 className="text-xl font-bold text-white uppercase tracking-widest">{category.category}</h2>
                            </div>
                            <div className="space-y-8">
                                {category.questions.map((faq, qIdx) => (
                                    <div key={qIdx} className="glass-panel p-6 rounded-2xl hover:border-blue-500/30 transition-all group">
                                        <h3 className="text-lg font-bold text-slate-100 mb-3 group-hover:text-blue-400 transition-colors">
                                            {faq.q}
                                        </h3>
                                        <p className="text-slate-400 leading-relaxed">
                                            {faq.a}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-24 bg-slate-900/40 border border-slate-800 rounded-3xl p-8 md:p-12 mb-16 text-left">
                    <h2 className="text-3xl font-bold text-white mb-6 uppercase tracking-tighter italic">Editorial Standards &amp; Transparency</h2>
                    <div className="space-y-6 text-slate-400 text-sm leading-relaxed">
                        <p>
                            Weekend Travellers is an independent travel publication and trip-planning platform founded by <strong>Majid Khan</strong>. This FAQ explains how our destination guides, calculators, and AI-assisted itinerary drafts work, and what their limitations are.
                        </p>
                        <p>
                            <strong>How We Maintain Accuracy</strong><br/>
                            Curated destination guides and policy pages are reviewed by our editorial desk against official tourism portals, rail/highway references, and reader feedback. Cost ranges, entry fees, and travel durations are always presented as planning estimates rather than live quotes. Read our{' '}
                            <Link href="/editorial-policy" className="text-blue-400 hover:underline">Editorial Policy</Link>,{' '}
                            <Link href="/authors" className="text-blue-400 hover:underline">Authors &amp; Team</Link>, and{' '}
                            <Link href="/corrections-policy" className="text-blue-400 hover:underline">Corrections Policy</Link>.
                        </p>
                    </div>
                </div>

                {/* Still have questions? */}
                <div className="mt-24 p-12 rounded-3xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 text-center">
                    <MessageCircle className="w-12 h-12 text-blue-400 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-white mb-4">Still have questions?</h2>
                    <p className="text-slate-400 mb-8 max-w-md mx-auto">
                        Cant find the answer you are looking for? Reach out to our team directly.
                    </p>
                    <Link href="/contact">
                        <Button className="bg-white text-slate-950 hover:bg-slate-200 font-bold px-8 py-6 h-auto text-lg rounded-xl">
                            Contact Us
                        </Button>
                    </Link>
                </div>

            </main>
        </div>
    );
}
