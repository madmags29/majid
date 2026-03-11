'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, User, Calendar, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Comment {
    _id: string;
    userName: string;
    content: string;
    createdAt: string;
}

interface CommentSectionProps {
    postSlug: string;
    apiUrl: string;
}

export default function CommentSection({ postSlug, apiUrl }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [userName, setUserName] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const fetchComments = async () => {
        try {
            const res = await fetch(`${apiUrl}/api/blog/${postSlug}/comments`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setComments(data);
            }
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postSlug]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userName || !content) return;

        setSubmitting(true);
        try {
            const res = await fetch(`${apiUrl}/api/blog/${postSlug}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName, content })
            });

            if (res.ok) {
                toast.success('Comment submitted for moderation!');
                setUserName('');
                setContent('');
            } else {
                toast.error('Failed to submit comment');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="mt-16 pt-16 border-t border-slate-800">
            <div className="flex items-center gap-3 mb-10">
                <MessageSquare className="text-blue-500 w-8 h-8" />
                <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">Discussion</h3>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="bg-slate-900/30 rounded-3xl p-8 border border-slate-800 mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Your Name</label>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Wanderer Name"
                            required
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3 text-white focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                </div>
                <div className="space-y-2 mb-8">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Your Thoughts</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Share your experience or ask a question..."
                        required
                        rows={4}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all resize-none"
                    />
                </div>
                <Button 
                    type="submit" 
                    disabled={submitting}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl px-8 py-6 h-auto shadow-xl shadow-blue-900/40 transform active:scale-95 transition-all"
                >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Send className="w-5 h-5 mr-2" />}
                    Post Comment
                </Button>
            </form>

            {/* Comments List */}
            <div className="space-y-8">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                    </div>
                ) : comments.length === 0 ? (
                    <p className="text-slate-500 text-center py-10 italic">No comments yet. Be the first to start the conversation!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment._id} className="flex gap-4 group">
                            <div className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/20 flex items-center justify-center">
                                <User className="text-blue-400 w-6 h-6" />
                            </div>
                            <div className="flex-1 bg-slate-900/20 rounded-3xl p-6 border border-slate-800 group-hover:border-slate-700 transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-bold text-white text-lg">{comment.userName}</h4>
                                    <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        <Calendar size={12} className="text-blue-500" />
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-slate-300 leading-relaxed">{comment.content}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
