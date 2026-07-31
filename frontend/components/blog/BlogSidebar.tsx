'use client';

import React, { useState } from 'react';
import { Share2, Facebook, Twitter, Linkedin, Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface BlogSidebarProps {
    author?: string;
    title: string;
    slug: string;
}

export default function BlogSidebar({ author, title, slug }: BlogSidebarProps) {
    const [copied, setCopied] = useState(false);

    const getArticleUrl = () => {
        if (typeof window !== 'undefined') {
            return window.location.href;
        }
        return `https://weekendtravellers.com/blog/${slug}`;
    };

    const handleShareFacebook = () => {
        const url = getArticleUrl();
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            '_blank',
            'noopener,noreferrer'
        );
    };

    const handleShareTwitter = () => {
        const url = getArticleUrl();
        const text = `Check out this guide on Weekend Travellers: "${title}"`;
        window.open(
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
            '_blank',
            'noopener,noreferrer'
        );
    };

    const handleShareLinkedin = () => {
        const url = getArticleUrl();
        window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            '_blank',
            'noopener,noreferrer'
        );
    };

    const handleCopyLink = async () => {
        const url = getArticleUrl();
        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(url);
            } else {
                const textarea = document.createElement('textarea');
                textarea.value = url;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            }
            setCopied(true);
            toast.success('Article link copied to clipboard!');
            setTimeout(() => setCopied(false), 2500);
        } catch (err) {
            console.error('Failed to copy link:', err);
            toast.error('Failed to copy link');
        }
    };

    return (
        <aside className="lg:w-1/3">
            <div className="sticky top-32 space-y-12">
                {/* Author Card */}
                <div className="p-8 bg-slate-900/50 rounded-3xl border border-slate-800 text-center shadow-xl backdrop-blur-sm">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mx-auto mb-6 flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-blue-500/20">
                        {author ? author.charAt(0).toUpperCase() : 'W'}
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">{author || 'Editorial'}</h4>
                    <p className="text-slate-400 text-sm mb-6">Expert Travel Writer & AI Specialist at Weekend Travellers.</p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={handleShareFacebook}
                            className="p-3 bg-slate-800/80 rounded-xl hover:bg-blue-600 hover:text-white transition-all text-slate-300 hover:scale-110 active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
                            aria-label="Share on Facebook"
                            title="Share on Facebook"
                        >
                            <Facebook size={20} />
                        </button>
                        <button
                            onClick={handleShareTwitter}
                            className="p-3 bg-slate-800/80 rounded-xl hover:bg-sky-500 hover:text-white transition-all text-slate-300 hover:scale-110 active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
                            aria-label="Share on Twitter"
                            title="Share on Twitter"
                        >
                            <Twitter size={20} />
                        </button>
                        <button
                            onClick={handleShareLinkedin}
                            className="p-3 bg-slate-800/80 rounded-xl hover:bg-blue-700 hover:text-white transition-all text-slate-300 hover:scale-110 active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
                            aria-label="Share on LinkedIn"
                            title="Share on LinkedIn"
                        >
                            <Linkedin size={20} />
                        </button>
                    </div>
                </div>

                {/* Share Card */}
                <div className="p-8 bg-gradient-to-br from-blue-600/10 via-slate-900/60 to-indigo-600/10 rounded-3xl border border-blue-500/20 shadow-xl backdrop-blur-sm">
                    <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Share2 size={20} className="text-blue-500" /> Share this Guide
                    </h4>
                    <p className="text-slate-400 text-sm mb-6 leading-relaxed">Help your friends plan their next getaway by sharing this expert guide.</p>
                    <Button
                        onClick={handleCopyLink}
                        className={`w-full font-bold rounded-2xl py-6 transition-all duration-300 shadow-xl flex items-center justify-center gap-2 cursor-pointer ${
                            copied
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                : 'bg-white text-slate-950 hover:bg-blue-600 hover:text-white'
                        }`}
                    >
                        {copied ? (
                            <>
                                <Check size={18} className="text-white animate-in zoom-in-50" />
                                Link Copied!
                            </>
                        ) : (
                            <>
                                <Copy size={18} />
                                Copy Article Link
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </aside>
    );
}
