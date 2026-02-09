import React from 'react';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const AdBanner = dynamic(() => import('@/components/AdBanner'), { ssr: false });

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'Our commitment to protecting your privacy and data.',
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-20 px-6">
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-8 font-cursive bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Privacy Policy
                </h1>

                <p className="text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">1. Introduction</h2>
                    <p className="text-slate-300 leading-relaxed">
                        Welcome to Weekend Travellers. We respect your privacy and are committed to protecting your personal data.
                        This privacy policy will inform you as to how we look after your personal data when you visit our website
                        and tell you about your privacy rights and how the law protects you.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">2. Data We Collect</h2>
                    <p className="text-slate-300 leading-relaxed">
                        We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                    </p>
                    <ul className="list-disc pl-6 text-slate-300 space-y-2">
                        <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                        <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
                        <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
                        <li><strong>Usage Data:</strong> includes information about how you use our website and services.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">3. How We Use Your Data</h2>
                    <p className="text-slate-300 leading-relaxed">
                        We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                    </p>
                    <ul className="list-disc pl-6 text-slate-300 space-y-2">
                        <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                        <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                        <li>Where we need to comply with a legal or regulatory obligation.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">4. Data Security</h2>
                    <p className="text-slate-300 leading-relaxed">
                        We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">5. Your Legal Rights</h2>
                    <p className="text-slate-300 leading-relaxed">
                        Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and (where the lawful ground of processing is consent) to withdraw consent.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">6. Contact Us</h2>
                    <p className="text-slate-300 leading-relaxed">
                        If you have any questions about this privacy policy or our privacy practices, please contact us at: privacy@weekendtravellers.com.
                    </p>
                </section>

                {/* Ad Banner */}
                <AdBanner dataAdSlot="7777888899" />
            </div>
        </div>
    );
}
