import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms & Conditions',
    description: 'Terms of use for Weekend Travellers.',
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
                        Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the “Content”) and the trademarks, service marks, and logos contained therein (the “Marks”) are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">4. User Registration</h2>
                    <p className="text-slate-300 leading-relaxed">
                        You may be required to register with the Site. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">5. Prohibited Activities</h2>
                    <p className="text-slate-300 leading-relaxed">
                        You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">6. Limitation of Liability</h2>
                    <p className="text-slate-300 leading-relaxed">
                        In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the site, even if we have been advised of the possibility of such damages.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">7. Contact Us</h2>
                    <p className="text-slate-300 leading-relaxed">
                        In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at: legal@weekendtravellers.com.
                    </p>
                </section>
            </div>
        </div>
    );
}
