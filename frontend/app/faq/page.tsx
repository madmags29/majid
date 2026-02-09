import React from 'react';
import AdBanner from '@/components/AdBanner';

export default function FAQ() {
    return (
        <div className="container mx-auto px-4 py-20 min-h-screen">
            <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>
            <div className="space-y-6 max-w-3xl">
                <div>
                    <h3 className="text-xl font-semibold">What is Weekend Travellers?</h3>
                    <p className="text-muted-foreground mt-2">Weekend Travellers is an AI-powered assistant that helps you plan perfect 2-day getaways.</p>
                </div>
                <div>
                    <h3 className="text-xl font-semibold">Is it free to use?</h3>
                    <p className="text-muted-foreground mt-2">Yes, our basic trip planning features are free for all users.</p>
                </div>
            </div>

            {/* Ad Banner */}
            <AdBanner dataAdSlot="4444555566" />
        </div>
    );
}
