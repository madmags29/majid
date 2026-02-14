'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, HelpCircle, Compass, ShieldCheck, CreditCard, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';

const AdBanner = dynamic(() => import('@/components/AdBanner'), { ssr: false });
const AnimatedLogo = dynamic(() => import('@/components/AnimatedLogo'), { ssr: false });

const faqs = [
    {
        category: "General Information",
        icon: <HelpCircle className="w-5 h-5 text-blue-400" />,
        questions: [
            {
                q: "What is weekendtravellers.com?",
                a: "Weekendtravellers.com is an AI-powered travel assistant designed specifically for planning perfect 2-day getaways. We analyze thousands of data points to give you the best itineraries, hotel suggestions, and travel logistics for your weekend trips."
            },
            {
                q: "How does the AI itinerary generator work?",
                a: "Our AI uses advanced language models and real-time travel data to understand your preferences. When you search for a destination, it creates a custom-tailored 48-hour plan including activities, timings, and logistics based on the latest trends and local secrets."
            }
        ]
    },
    {
        category: "Planning & Booking",
        icon: <Compass className="w-5 h-5 text-purple-400" />,
        questions: [
            {
                q: "Can I customize my generated itinerary?",
                a: "Yes! Once an itinerary is generated, you can use the chat box to request specific changes like 'Make it more budget-friendly', 'Add more nature spots', or 'Include better vegan options'. The AI will immediately refine the plan for you."
            },
            {
                q: "How do I book hotels suggested in the plan?",
                a: "Every hotel suggestion includes a 'Book Now' link that takes you to our booking partner (Hotellook) where you can see real-time availability and the best prices across multiple booking sites."
            }
        ]
    },
    {
        category: "Account & Safety",
        icon: <ShieldCheck className="w-5 h-5 text-green-400" />,
        questions: [
            {
                q: "Why should I create an account?",
                a: "Creating an account allows you to save your favorite itineraries, access them from any device, and build a history of your past weekend adventures. It's completely free and only takes a minute."
            },
            {
                q: "Is my data secure?",
                a: "We take your privacy seriously. Your personal information is encrypted and we never share your data with third parties without your explicit consent. Check our Privacy Policy for more details."
            }
        ]
    },
    {
        category: "Pricing",
        icon: <CreditCard className="w-5 h-5 text-amber-400" />,
        questions: [
            {
                q: "Is weekendtravellers.com free usage?",
                a: "Yes! All our planning tools, AI chat refinements, and itinerary saving features are currently free for all users."
            }
        ]
    }
];

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
            {/* Header / Navigation */}
            <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-6 sticky top-0 w-full z-50">
                <div className="flex items-center gap-3">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                            <ArrowLeft className="w-5 h-5 text-slate-300" />
                        </Button>
                    </Link>
                    <Link href="/" className="flex items-center gap-2 group">
                        <AnimatedLogo className="w-8 h-8 text-blue-500 group-hover:text-blue-400 transition-colors" />
                        <span className="font-cursive text-2xl text-white hidden sm:block">weekendtravellers.com</span>
                    </Link>
                </div>
            </header>

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

                {/* Ad Banner */}
                <div className="mt-20">
                    <AdBanner dataAdSlot="4444555566" />
                </div>
            </main>
        </div>
    );
}
