import React from 'react';
import { SUPPORT_EMAIL } from '@/lib/config';

export default function Contact() {
    return (
        <div className="container mx-auto px-4 py-20 min-h-screen text-center">
            <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
            <p className="text-xl text-muted-foreground mb-8">Have questions or feedback? We'd love to hear from you!</p>
            <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90"
            >
                Email Support
            </a>
        </div>
    );
}
