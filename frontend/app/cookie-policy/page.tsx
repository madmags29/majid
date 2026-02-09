import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Cookie Policy',
    description: 'Learn how Weekend Travellers uses cookies to improve your experience.',
};

export default function CookiePolicy() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-20 px-6">
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-8 font-cursive bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Cookie Policy
                </h1>

                <p className="text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">1. What Are Cookies?</h2>
                    <p className="text-slate-300 leading-relaxed">
                        Cookies are small text files that are placed on your computer or mobile device by websites that you visit. They are widely used in order to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">2. How We Use Cookies</h2>
                    <p className="text-slate-300 leading-relaxed">
                        Weekend Travellers uses cookies to enhance your browsing experience, analyze our traffic, and personalize content. We use the following types of cookies:
                    </p>
                    <ul className="list-disc pl-6 text-slate-300 space-y-2">
                        <li><strong>Essential Cookies:</strong> These are necessary for the website to function and cannot be switched off in our systems. They include, for example, cookies that enable you to log into secure areas of our website.</li>
                        <li><strong>Analytical/Performance Cookies:</strong> These allow us to recognize and count the number of visitors and to see how visitors move around our website when they are using it. This helps us to improve the way our website works.</li>
                        <li><strong>Functionality Cookies:</strong> These are used to recognize you when you return to our website. This enables us to personalize our content for you and remember your preferences (for example, your choice of language or region).</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">3. Third-Party Cookies</h2>
                    <p className="text-slate-300 leading-relaxed">
                        In addition to our own cookies, we may also use various third-parties cookies to report usage statistics of the Service, deliver advertisements on and through the Service, and so on.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">4. Managing Cookies</h2>
                    <p className="text-slate-300 leading-relaxed">
                        Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set, visit <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">www.aboutcookies.org</a> or <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">www.allaboutcookies.org</a>.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">5. Changes to This Policy</h2>
                    <p className="text-slate-300 leading-relaxed">
                        We may update this Cookie Policy from time to time. We encourage you to periodically review this page for the latest information on our privacy practices.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">6. Contact Us</h2>
                    <p className="text-slate-300 leading-relaxed">
                        If you have any questions about our use of cookies, please contact us at: privacy@weekendtravellers.com.
                    </p>
                </section>
            </div>
        </div>
    );
}
