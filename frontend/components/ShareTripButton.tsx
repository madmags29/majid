'use client';

import { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ShareTripButtonProps {
    destination: string;
    variant?: 'primary' | 'header' | 'outline';
    className?: string;
}

export default function ShareTripButton({ destination, variant = 'header', className }: ShareTripButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const url = typeof window !== 'undefined' ? window.location.href : '';
        const title = `${destination} Weekend Trip | Weekend Travellers`;
        const text = `Check out this complete AI-curated weekend itinerary for ${destination}!`;

        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({ title, text, url });
                return;
            } catch (err) {
                // Ignore AbortError when user cancels native share
                if ((err as Error).name !== 'AbortError') {
                    console.error('Share failed', err);
                }
            }
        }

        // Fallback to clipboard copy
        try {
            if (typeof navigator !== 'undefined' && navigator.clipboard) {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                toast.success('Trip link copied to clipboard!');
                setTimeout(() => setCopied(false), 2500);
            }
        } catch {
            toast.error('Failed to copy link');
        }
    };

    if (variant === 'primary') {
        return (
            <button
                type="button"
                onClick={handleShare}
                className={cn(
                    "flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-sm font-bold shadow-lg shadow-blue-500/25 active:scale-95 transition-all cursor-pointer",
                    className
                )}
            >
                {copied ? <Check className="w-4 h-4 text-white" /> : <Share2 className="w-4 h-4" />}
                <span>{copied ? 'Copied Link!' : 'Share Itinerary'}</span>
            </button>
        );
    }

    if (variant === 'outline') {
        return (
            <button
                type="button"
                onClick={handleShare}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 hover:border-blue-500/50 rounded-full text-xs font-semibold backdrop-blur-md active:scale-95 transition-all shadow-md cursor-pointer",
                    className
                )}
            >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-blue-400" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={handleShare}
            className={cn(
                "flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded-full text-xs sm:text-sm font-bold active:scale-95 transition-all cursor-pointer",
                className
            )}
            title="Share this trip"
        >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? 'Link Copied' : 'Share Trip'}</span>
        </button>
    );
}
