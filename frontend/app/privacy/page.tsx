import { Metadata } from 'next';
import { SUPPORT_EMAIL } from '@/lib/config';

export const metadata: Metadata = {
    title: 'Privacy Policy | Weekend Travellers',
    description: 'Our commitment to protecting your privacy and data. Learn how Weekend Travellers handles account information, cookies, and advertising.',
    openGraph: {
        title: 'Privacy Policy | Weekend Travellers',
        description: 'Our commitment to protecting your privacy and data. Learn how Weekend Travellers handles your information.',
        type: 'website',
    },
    alternates: {
        canonical: '/privacy',
    },
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-20 px-6">
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-8 font-cursive bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Privacy Policy
                </h1>

                <p className="text-slate-400">Last updated: November 27, 2026</p>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">1. Introduction</h2>
                    <p className="text-slate-300 leading-relaxed">
                        Welcome to Weekend Travellers. We respect your privacy and are committed to protecting your personal data.
                        This privacy policy will inform you as to how we look after your personal data when you visit our website
                        and tell you about your privacy rights and how the law protects you.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">2. Data We Collect &amp; Browser Storage</h2>
                    <p className="text-slate-300 leading-relaxed">
                        We collect only the information needed to operate your account, respond to messages, and keep planning features working:
                    </p>
                    <ul className="list-disc pl-6 text-slate-300 space-y-2">
                        <li><strong>Account &amp; Contact Data:</strong> Name and email address when you register an account, post a comment, or submit our contact form (phone number is optional).</li>
                        <li><strong>Saved Trips &amp; Browser Local Storage:</strong> If you sign in, saved trips are stored in our database. Unauthenticated recent searches and temporary trip drafts are stored locally in your browser&apos;s <code>localStorage</code> and can be cleared anytime from your browser settings.</li>
                        <li><strong>Technical &amp; Usage Data:</strong> Standard request logs (IP address, browser type, device viewport) and analytics cookies used to monitor uptime and page performance.</li>
                        <li><strong>Third-Party APIs &amp; Embeds:</strong> Destination weather forecasts are fetched from Open-Meteo, interactive maps load OpenStreetMap tiles via Leaflet, and optional accommodation links connect to third-party booking partners (such as Agoda, Hotellook, or Travelpayouts).</li>
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
                    <h2 className="text-2xl font-semibold text-white">4. Third-Party Advertising</h2>
                    <p className="text-slate-300 leading-relaxed">
                        We use third-party advertising companies to serve ads when you visit our website. These companies may use information (not including your name, address, email address, or telephone number) about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                        Specifically, <strong>Google AdSense</strong> uses cookies to serve ads on our site. Google&apos;s use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet. Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Ads Settings</a>.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">5. Data Security</h2>
                    <p className="text-slate-300 leading-relaxed">
                        We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">6. Your Legal Rights</h2>
                    <p className="text-slate-300 leading-relaxed">
                        Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and (where the lawful ground of processing is consent) to withdraw consent.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">7. Contact Us</h2>
                    <p className="text-slate-300 leading-relaxed">
                        If you have any questions about this privacy policy or our privacy practices, please contact us at: {SUPPORT_EMAIL}.
                    </p>
                </section>

            </div>
        </div>
    );
}
