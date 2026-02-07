import Link from 'next/link';
import { Instagram, Youtube } from 'lucide-react';
import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-slate-950 text-slate-300 py-12 border-t border-slate-800 mt-auto">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="md:w-1/3">
                        <Link href="/" className="inline-block mb-4">
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-cursive">
                                weekendtravellers.com
                            </span>
                        </Link>
                        <p className="text-sm text-slate-400 mb-4">
                            Discover your perfect weekend getaway. Plan, save, and share your adventures with ease.
                        </p>
                        <div className="flex space-x-4">
                            <Link href="#" className="hover:text-pink-500 transition-colors">
                                <Instagram size={24} />
                            </Link>
                            <Link href="#" className="hover:text-red-500 transition-colors">
                                <Youtube size={24} />
                            </Link>
                        </div>
                    </div>

                    {/* Links Section */}
                    <div className="flex gap-16 md:gap-24">
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
                    <p>&copy; {new Date().getFullYear()} Weekend Travellers. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link href="/privacy" className="hover:text-slate-300">Privacy</Link>
                        <Link href="/terms" className="hover:text-slate-300">Terms</Link>
                        <Link href="/sitemap" className="hover:text-slate-300">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
