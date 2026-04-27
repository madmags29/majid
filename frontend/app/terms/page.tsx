import React from 'react';
import { Metadata } from 'next';
import { SUPPORT_EMAIL } from '@/lib/config';

export const metadata: Metadata = {
    title: 'Terms & Conditions | Weekend Travellers AI Trip Planner',
    description: 'Rules and guidelines for using our AI travel planning services and website.',
    keywords: ['terms of service', 'weekend travellers terms', 'user agreement', 'travel planner terms', 'AI itinerary planner rules'],
    openGraph: {
        title: 'Terms & Conditions | Weekend Travellers AI Trip Planner',
        description: 'Rules and guidelines for using our AI travel planning services and website.',
        type: 'website',
    },
    alternates: {
        canonical: '/terms',
    },
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-20 px-6">
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-8 font-cursive bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Terms & Conditions
                </h1>

                <p className="text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">1. Agreement to Terms</h2>
                    <p className="text-slate-300 leading-relaxed">
                        These Terms of Use constitute a legally binding agreement made between you, whether personally or on behalf of an entity (&ldquo;you&rdquo;) and Weekend Travellers (&quot;we,&quot; &quot;us&quot; or &quot;our&quot;), concerning your access to and use of the weekendtravellers.com website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the &ldquo;Site&rdquo;).
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">2. User Representations</h2>
                    <p className="text-slate-300 leading-relaxed">
                        By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Terms of Use; (4) you are not a minor in the jurisdiction in which you reside.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">3. Intellectual Property Rights</h2>
                    <p className="text-slate-300 leading-relaxed">
                        Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the &ldquo;Content&rdquo;) and the trademarks, service marks, and logos contained therein (the &ldquo;Marks&rdquo;) are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws and various other intellectual property rights and unfair competition laws. 
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                        The Content and Marks are provided on the Site &ldquo;AS IS&rdquo; for your information and personal use only. Except as expressly provided in these Terms of Use, no part of the Site and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">4. User Generated Content</h2>
                    <p className="text-slate-300 leading-relaxed">
                        The Site may invite you to chat, contribute to, or participate in blogs, message boards, online forums, and other functionality, and may provide you with the opportunity to create, submit, post, display, transmit, perform, publish, distribute, or broadcast content and materials to us or on the Site, including but not limited to text, writings, video, audio, photographs, graphics, comments, suggestions, or personal information or other material (collectively, &quot;Contributions&quot;). 
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                        When you create or make available any Contributions, you thereby represent and warrant that the creation, distribution, transmission, public display, or performance, and the accessing, downloading, or copying of your Contributions do not and will not infringe the proprietary rights, including but not limited to the copyright, patent, trademark, trade secret, or moral rights of any third party.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">5. User Registration</h2>
                    <p className="text-slate-300 leading-relaxed">
                        You may be required to register with the Site. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">6. Prohibited Activities</h2>
                    <p className="text-slate-300 leading-relaxed">
                        You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us. Prohibited activity includes, but is not limited to: 
                    </p>
                    <ul className="list-disc pl-6 text-slate-300 space-y-2">
                        <li>Circumventing, disabling, or otherwise interfering with security-related features of the Site.</li>
                        <li>Tricking, defrauding, or misleading us and other users.</li>
                        <li>Using any information obtained from the Site in order to harass, abuse, or harm another person.</li>
                        <li>Attempting to impersonate another user or person.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">7. Limitation of Liability</h2>
                    <p className="text-slate-300 leading-relaxed">
                        In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the site, even if we have been advised of the possibility of such damages. 
                    </p>
                    <p className="text-slate-300 leading-relaxed font-bold">
                        The AI-generated itineraries provided by Weekend Travellers are for informational purposes only. We do not guarantee the accuracy, availability, or safety of any suggested routes, hotels, or attractions.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">8. Contact Us</h2>
                    <p className="text-slate-300 leading-relaxed">
                        In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at: {SUPPORT_EMAIL}.
                    </p>
                </section>
            </div>
        </div>
    );
}
