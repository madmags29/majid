'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, Mail, Phone, MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import { API_URL, SUPPORT_EMAIL } from '@/lib/config';

const AnimatedLogo = dynamic(() => import('@/components/AnimatedLogo'), { ssr: false });

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        comment: '',
        website: '', // Honeypot field
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Simple client-side validation
        if (!formData.name || !formData.email || !formData.phone || !formData.comment) {
            toast.error('Please fill in all mandatory fields.');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_URL}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                setIsSubmitted(true);
                toast.success('Message sent successfully!');
            } else {
                toast.error(data.message || 'Failed to send message. Please try again.');
            }
        } catch (error) {
            console.error('Submission error:', error);
            toast.error('Connection error. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                <div className="glass-panel p-12 rounded-3xl max-w-lg w-full text-center animate-in fade-in zoom-in duration-500">
                    <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-white mb-4">Message Sent!</h2>
                    <p className="text-slate-400 mb-8">
                        Thank you for reaching out. Our team will review your message and get back to you at <strong>{formData.email}</strong> as soon as possible.
                    </p>
                    <Link href="/">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-xl font-bold">
                            Return Home
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
            <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-6 sticky top-0 w-full z-50">
                <div className="flex items-center gap-3">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                            <ArrowLeft className="w-5 h-5 text-slate-300" />
                        </Button>
                    </Link>
                    <Link href="/" className="flex items-center gap-2 group">
                        <AnimatedLogo className="w-8 h-8 text-blue-500 group-hover:text-blue-400 transition-colors" />
                        <span className="font-cursive text-2xl text-white sm:block">weekendtravellers.com</span>
                    </Link>
                </div>
            </header>

            <main className="container mx-auto px-4 py-16 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                    {/* Left Side: Content & Info */}
                    <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
                        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8">
                            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Touch</span>
                        </h1>
                        <p className="text-white/80 max-w-2xl mx-auto text-lg">
                            Have questions about our smart travel planner? Need help with your itinerary? We're here to help you plan the perfect weekend escape.
                        </p>

                        <div className="space-y-6">
                            <div className="glass-panel p-6 rounded-2xl flex items-center gap-6 border-l-4 border-l-blue-500">
                                <div className="bg-blue-500/10 p-4 rounded-xl">
                                    <Mail className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Email Us</p>
                                    <p className="text-lg font-bold text-white">{SUPPORT_EMAIL}</p>
                                </div>
                            </div>

                            <div className="glass-panel p-6 rounded-2xl flex items-center gap-6 border-l-4 border-l-purple-500">
                                <div className="bg-purple-500/10 p-4 rounded-xl">
                                    <Phone className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Support Hours</p>
                                    <p className="text-lg font-bold text-white">Mon - Fri, 9am - 6pm IST</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 p-8 rounded-3xl bg-slate-900/40 border border-slate-800">
                            <p className="text-sm text-slate-400 italic">
                                "Our mission is to make every weekend count. If you encountered any issues or have suggestions to make the trip planner better, please dont hesitate to reach out."
                            </p>
                            <p className="text-sm font-bold text-white mt-4">— Team weekendtravellers.com</p>
                        </div>
                    </div>

                    {/* Right Side: Contact Form */}
                    <div className="animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
                        <div className="glass-panel p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
                            {/* Decorative background glow */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl opacity-50" />
                            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl opacity-50" />

                            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-300 ml-1">Name <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            placeholder="Your full name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-300 ml-1">Email <span className="text-red-500">*</span></label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            placeholder="hello@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-300 ml-1">Phone Number <span className="text-red-500">*</span></label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        placeholder="+91 00000 00000"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-300 ml-1">Comment / Message <span className="text-red-500">*</span></label>
                                    <Textarea
                                        name="comment"
                                        required
                                        rows={5}
                                        placeholder="How can we help you?"
                                        value={formData.comment}
                                        onChange={handleChange}
                                        className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                    />
                                </div>

                                {/* Honeypot Spam Protection (Hidden from users) */}
                                <div className="hidden">
                                    <input
                                        type="text"
                                        name="website"
                                        autoComplete="off"
                                        tabIndex={-1}
                                        value={formData.website}
                                        onChange={handleChange}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-6 h-auto text-lg rounded-xl shadow-lg shadow-blue-900/20 transform active:scale-95 transition-all"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Sending...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Send className="w-5 h-5" />
                                            Send Message
                                        </div>
                                    )}
                                </Button>

                                <p className="text-center text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-4">
                                    SECURE & SPAM PROTECTED
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
