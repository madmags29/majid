'use client';

import Link from 'next/link';
import { Instagram, Youtube } from 'lucide-react';
import React from 'react';
import dynamic from 'next/dynamic';
const TypewriterText = dynamic(() => import('@/components/TypewriterText'), { ssr: false });

const Footer = () => {
    return (
        <footer className="bg-slate-950 text-slate-300 py-12 border-t border-slate-800 mt-auto">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="md:w-1/3">
                        <Link href="/" className="inline-block mb-4">
                            <TypewriterText
                                text="weekendtravellers.com"
                                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-cursive"
                                delay={1000}
                            />
                        </Link>
                        <p className="text-sm text-slate-400 mb-4">
                            Discover your perfect weekend getaway. Plan, save, and share your adventures with ease.
                        </p>
                        <div className="flex space-x-4">
                            <Link href="https://instagram.com/weekendtravellers.official" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors">
                                <Instagram size={24} />
                            </Link>
                            <Link href="https://youtube.com/@weekendtravellers.official" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors">
                                <Youtube size={24} />
                            </Link>
                        </div>
                    </div>

                    {/* Links Section */}
                    <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                        {/* Plan Your Trip */}
                        <div>
                            <h3 className="text-white font-bold mb-6 text-xs tracking-[0.2em] uppercase italic">Plan Your Trip</h3>
                            <ul className="space-y-3 text-sm">
                                <li>
                                    <Link href="/chat" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2">
                                        <span className="w-1 h-1 bg-blue-500 rounded-full"></span> AI Weekend Planner
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/inspiration-trip" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2">
                                        <span className="w-1 h-1 bg-purple-500 rounded-full"></span> Inspiration Trip
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/explore/all" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2">
                                        <span className="w-1 h-1 bg-pink-500 rounded-full"></span> Explore All
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/search" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2">
                                        <span className="w-1 h-1 bg-indigo-500 rounded-full"></span> Smart Search
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Resources */}
                        <div>
                            <h3 className="text-white font-bold mb-6 text-xs tracking-[0.2em] uppercase italic">Company</h3>
                            <ul className="space-y-3 text-sm">
                                <li>
                                    <Link href="/blog" className="text-slate-400 hover:text-blue-400 transition-colors">
                                        Travel Blog
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/about" className="text-slate-400 hover:text-blue-400 transition-colors">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contact" className="text-slate-400 hover:text-blue-400 transition-colors">
                                        Contact Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/faq" className="text-slate-400 hover:text-blue-400 transition-colors">
                                        Travel FAQ
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Destinations */}
                        <div>
                            <h3 className="text-white font-bold mb-6 text-xs tracking-[0.2em] uppercase italic">Destinations</h3>
                            <ul className="space-y-3 text-sm">
                                <li>
                                    <Link href="/explore/india" className="text-slate-400 hover:text-blue-400 transition-colors">
                                        All India Guides
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/explore/india/goa" className="text-slate-400 hover:text-blue-400 transition-colors">
                                        Goa Weekends
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/explore/india/rajasthan" className="text-slate-400 hover:text-blue-400 transition-colors">
                                        Rajasthan Heritage
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/explore/india/kerala" className="text-slate-400 hover:text-blue-400 transition-colors">
                                        Kerala Backwaters
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Account & Legal */}
                        <div>
                            <h3 className="text-white font-bold mb-6 text-xs tracking-[0.2em] uppercase italic">Account & Legal</h3>
                            <ul className="space-y-3 text-sm">
                                <li>
                                    <Link href="/profile" className="text-slate-400 hover:text-blue-400 transition-colors">
                                        My Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/trips" className="text-slate-400 hover:text-blue-400 transition-colors">
                                        My Saved Trips
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/terms" className="text-slate-400 hover:text-blue-400 transition-colors">
                                        Terms of Service
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/privacy" className="text-slate-400 hover:text-blue-400 transition-colors">
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/cookie-policy" className="text-slate-400 hover:text-blue-400 transition-colors">
                                        Cookie Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/reset-password" name="reset-password-link" className="text-slate-400 hover:text-blue-400 transition-colors">
                                        Secure Password Reset
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <p>&copy; {new Date().getFullYear()} Weekend Travellers. All rights reserved. Powered By <Link href="https://devdesigns.net" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">Dev Designs</Link></p>
                    </div>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link href="/privacy" className="hover:text-slate-300">Privacy</Link>
                        <Link href="/terms" className="hover:text-slate-300">Terms</Link>
                        <Link href="/sitemap.xml" className="hover:text-slate-300">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
