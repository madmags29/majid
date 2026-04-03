import React from 'react';
import Link from 'next/link';
import { ArrowLeft, HelpCircle, Compass, ShieldCheck, CreditCard, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FaqHeader from './FaqHeader';

const faqs = [
    {
        category: "General Information",
        icon: <HelpCircle className="w-5 h-5 text-blue-400" />,
        questions: [
            {
                q: "What is weekendtravellers.com and how does it help me?",
                a: "Weekendtravellers.com is an advanced AI-powered travel assistant meticulously designed for planning high-impact 2 to 4-day getaways. We solve the problem of 'planning fatigue' by analyzing thousands of data points—from transit logistics to local weather—to give you a cohesive, expert-level itinerary in seconds. Our goal is to make every weekend feel like a luxury vacation."
            },
            {
                q: "How does the smart AI trip planner work for 2026?",
                a: "Our engine utilizes the latest Large Language Models (LLMs) combined with real-time travel APIs. When you enter a destination, the AI cross-references current travel trends, popular hotspots, and hidden local secrets to create a balanced plan. It considers 'vibe' matches, geographical proximity of activities, and optimal meal timings to ensure a stress-free experience."
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
                a: "Every itinerary includes suggested transport between points, walking/driving distances, and estimated costs. We also provide 'Best Time to Start' suggestions for each day to help you avoid peak crowds at popular attractions."
            },
            {
                q: "How do I book the suggested hotels or flights?",
                a: "We partner with industry leaders like Hotellook and Agoda. Every hotel suggestion comes with a curated link that takes you directly to real-time pricing and availability. We don't handle payments directly, ensuring you always get the best market rates through verified partners."
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
                q: "Do you offer premium or group planning?",
                a: "Currently, our standard service is robust enough for all types of weekend travel. We are exploring advanced group-syncing features for late 2026, which will allow multiple users to edit a single plan in real-time."
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

                {/* AdSense Optimization: High-Value Content Section */}
                <div className="mt-24 bg-slate-900/40 border border-slate-800 rounded-3xl p-8 md:p-12 mb-16 text-left">
                    <h2 className="text-3xl font-bold text-white mb-6 uppercase tracking-tighter italic">Foundational Knowledge & Philosophy</h2>
                    <div className="space-y-6 text-slate-400 text-sm leading-relaxed">
                        <p>
                            Navigating the complexities of travel planning in 2026 can be daunting. Weekend Travellers was founded on a core principle: <strong>Information Accessibility</strong>. Our Frequently Asked Questions (FAQ) page isn&apos;t just a list of procedural instructions; it&apos;s a repository of the collective wisdom we have gathered about the &quot;Micro-Vacation&quot; movement. Whether you are curious about the technical specifications of our generative AI or want to understand the economics of weekend getaways, we provide transparency into our operations to build a culture of trust.
                        </p>
                        <p>
                            <strong>A Note on Our Content Integrity</strong><br/>
                            We pride ourselves on the accuracy and structural integrity of every answer provided here. Our destination expert team, comprising travelers who have collectively explored over 100 global cities, regularly audits these FAQs to reflect changes in tourism laws, visa policies, and transit norms. We strictly avoid the use of thin, boilerplate content in our support documentation, ensuring that every explanation provides genuine, unique value to the reader.
                        </p>
                        <p>
                            <strong>Global Standards and Ethical AI</strong><br/>
                            As we integrate more advanced machine learning models into our travel planner, we maintain a firm commitment to ethical AI usage. This means adhering to global standards for data protection (GDPR/CCPA) and ensuring that our algorithm doesn&apos;t overfit its recommendations to high-commission vendors. Our goal is to empower the individual traveler with the same level of granular logistical data that was once only available to high-end bespoke travel agents. 
                        </p>
                        <p>
                            We hope this documentation serves as a reliable guide for your next journey. If you find any information that requires further clarification or have a unique travel scenario not covered here, please reach out to our team immediately. Your success is the baseline metric by which we measure our own.
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
