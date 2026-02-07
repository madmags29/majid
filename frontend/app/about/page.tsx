import React from 'react';
import { MapPin, Users, Heart, Globe } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us',
    description: 'Learn about our mission to help you discover the perfect weekend getaways.',
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-20 px-6">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-cursive">
                        About Us
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        We are passionate travelers dedicated to making your weekend getaways unforgettable.
                    </p>
                </div>

                {/* Mission */}
                <div className="grid md:grid-cols-2 gap-12 items-center bg-slate-900/50 p-8 rounded-2xl border border-slate-800">
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold text-white">Our Mission</h2>
                        <p className="text-slate-300 leading-relaxed">
                            At Weekend Travellers, we believe that you don't need a long vacation to explore the world.
                            Our mission is to help you discover hidden gems, plan perfect itineraries, and make the most
                            of your weekends. Whether you're looking for adventure, relaxation, or culture, we've got you covered.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800 p-6 rounded-xl flex flex-col items-center justify-center text-center space-y-2">
                            <Globe className="w-8 h-8 text-blue-400" />
                            <span className="font-semibold">Global Destinations</span>
                        </div>
                        <div className="bg-slate-800 p-6 rounded-xl flex flex-col items-center justify-center text-center space-y-2">
                            <Users className="w-8 h-8 text-purple-400" />
                            <span className="font-semibold">Community Driven</span>
                        </div>
                        <div className="bg-slate-800 p-6 rounded-xl flex flex-col items-center justify-center text-center space-y-2">
                            <Heart className="w-8 h-8 text-pink-400" />
                            <span className="font-semibold">Curated with Love</span>
                        </div>
                        <div className="bg-slate-800 p-6 rounded-xl flex flex-col items-center justify-center text-center space-y-2">
                            <MapPin className="w-8 h-8 text-green-400" />
                            <span className="font-semibold">Local Insights</span>
                        </div>
                    </div>
                </div>

                {/* Story */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-white">Our Story</h2>
                    <p className="text-slate-300 leading-relaxed">
                        Founded in 2024 by a group of travel enthusiasts, Weekend Travellers started as a small blog sharing
                        weekend trip ideas. Today, it has grown into a comprehensive platform helping thousands of travelers
                        plan their mini-vacations. We leverage AI and community insights to provide you with the best
                        travel recommendations tailored to your interests.
                    </p>
                </div>

                {/* CTA */}
                <div className="text-center pt-12">
                    <h3 className="text-2xl font-bold text-white mb-6">Ready to explore?</h3>
                    <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-all">
                        Plan Your Next Trip
                    </Link>
                </div>
            </div>
        </div>
    );
}
