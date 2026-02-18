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
                    <div className="grid grid-cols-2 gap-8 md:flex md:gap-24">
                        {/* Discover India */}
                        <div>
                            <h3 className="text-white font-semibold mb-4 text-xs tracking-widest uppercase">Discover India</h3>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link href="/explore/india" className="hover:text-blue-400 transition-colors">
                                        All India
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/explore/india/goa" className="hover:text-blue-400 transition-colors">
                                        Goa
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/explore/india/rajasthan/jaipur" className="hover:text-blue-400 transition-colors">
                                        Jaipur
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/explore/india/kerala" className="hover:text-blue-400 transition-colors">
                                        Kerala
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Discover World */}
                        <div>
                            <h3 className="text-white font-semibold mb-4 text-xs tracking-widest uppercase">Discover World</h3>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link href="/explore/europe" className="hover:text-blue-400 transition-colors">
                                        Europe
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/explore/asia/thailand" className="hover:text-blue-400 transition-colors">
                                        Thailand
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/explore/asia/japan" className="hover:text-blue-400 transition-colors">
                                        Japan
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/explore/asia/indonesia/bali" className="hover:text-blue-400 transition-colors">
                                        Bali
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/explore/asia/uae/dubai" className="hover:text-blue-400 transition-colors">
                                        Dubai
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h3 className="text-white font-semibold mb-4">Support</h3>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link href="/about" className="hover:text-white transition-colors">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contact" className="hover:text-white transition-colors">
                                        Contact
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/faq" className="hover:text-white transition-colors">
                                        FAQ
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h3 className="text-white font-semibold mb-4">Legal</h3>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link href="/terms" className="hover:text-white transition-colors">
                                        Terms & Conditions
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/privacy" className="hover:text-white transition-colors">
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/cookie-policy" className="hover:text-white transition-colors">
                                        Cookie Policy
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <p>&copy; {new Date().getFullYear()} Weekend Travellers. All rights reserved.</p>
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
