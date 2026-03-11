'use client';

import React, { useState, useEffect } from 'react';
import { 
    Plus, 
    Search, 
    Filter, 
    MoreVertical, 
    Edit, 
    Trash2, 
    ExternalLink, 
    Loader2, 
    CheckCircle2, 
    XCircle,
    BrainCircuit,
    Image as ImageIcon,
    Calendar,
    Eye,
    MessageSquare,
    Check,
    X,
    Save,
    ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function BlogAdminPage() {
    const [activeTab, setActiveTab] = useState<'posts' | 'comments'>('posts');
    const [posts, setPosts] = useState<any[]>([]);
    const [comments, setComments] = useState<any[]>([]);
    const [keywords, setKeywords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [newKeyword, setNewKeyword] = useState('');
    
    // Edit/Add Mode
    const [isEditing, setIsEditing] = useState(false);
    const [editPost, setEditPost] = useState<any>(null);

    const fetchPosts = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_BASE}/api/admin/blog`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) setPosts(data);
        } catch (error) {
            toast.error('Failed to fetch blog posts');
        }
    };

    const fetchKeywords = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_BASE}/api/admin/blog/keywords`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) setKeywords(data);
        } catch (error) {
            toast.error('Failed to fetch keywords');
        }
    };

    const fetchComments = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_BASE}/api/admin/comments`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) setComments(data);
        } catch (error) {
            toast.error('Failed to fetch comments');
        }
    };

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            await Promise.all([fetchPosts(), fetchKeywords(), fetchComments()]);
            setLoading(false);
        };
        init();
    }, []);

    const handleGenerate = async (kw?: string) => {
        const keywordToUse = kw || newKeyword;
        if (!keywordToUse) {
            toast.error('Please enter or select a keyword');
            return;
        }

        setGenerating(true);
        toast.info(`Generating AI blog for: ${keywordToUse}. This may take a minute...`);
        
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_BASE}/api/admin/blog/generate`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ keyword: keywordToUse })
            });
            
            if (res.ok) {
                toast.success('Blog generated successfully!');
                fetchPosts();
                fetchKeywords();
                setNewKeyword('');
            } else {
                throw new Error('Generation failed');
            }
        } catch (error) {
            toast.error('Failed to generate blog');
        } finally {
            setGenerating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            const token = localStorage.getItem('adminToken');
            await fetch(`${API_BASE}/api/admin/blog/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            toast.success('Post deleted');
            fetchPosts();
        } catch (error) {
            toast.error('Failed to delete post');
        }
    };

    const handleSavePost = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        const method = editPost._id ? 'PUT' : 'POST';
        const url = editPost._id ? `${API_BASE}/api/admin/blog/${editPost._id}` : `${API_BASE}/api/admin/blog`;

        try {
            const res = await fetch(url, {
                method,
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editPost)
            });

            if (res.ok) {
                toast.success(editPost._id ? 'Post updated' : 'Post created');
                setIsEditing(false);
                setEditPost(null);
                fetchPosts();
            } else {
                toast.error('Failed to save post');
            }
        } catch (error) {
            toast.error('An error occurred');
        }
    };

    const handleModerateComment = async (id: string, isApproved: boolean) => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_BASE}/api/admin/comments/${id}`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isApproved })
            });

            if (res.ok) {
                toast.success(isApproved ? 'Comment approved' : 'Comment rejected');
                fetchComments();
            }
        } catch (error) {
            toast.error('Failed to moderate comment');
        }
    };

    const handleDeleteComment = async (id: string) => {
        if (!confirm('Delete this comment?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            await fetch(`${API_BASE}/api/admin/comments/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            toast.success('Comment deleted');
            fetchComments();
        } catch (error) {
            toast.error('Failed to delete comment');
        }
    };

    if (isEditing) {
        return (
            <div className="p-8 max-w-5xl mx-auto space-y-10">
                <div className="flex items-center justify-between">
                    <Button onClick={() => { setIsEditing(false); setEditPost(null); }} variant="ghost" className="text-slate-400">
                        <ArrowLeft className="mr-2" /> Back to Dashboard
                    </Button>
                    <h1 className="text-3xl font-black text-white">{editPost._id ? 'Edit Post' : 'Add New Post'}</h1>
                </div>

                <form onSubmit={handleSavePost} className="bg-zinc-900/50 rounded-3xl p-8 border border-white/5 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Title</label>
                            <input 
                                value={editPost.title}
                                onChange={e => setEditPost({...editPost, title: e.target.value})}
                                required
                                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Slug (optional)</label>
                            <input 
                                value={editPost.slug}
                                onChange={e => setEditPost({...editPost, slug: e.target.value})}
                                placeholder="auto-generated-if-empty"
                                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Keyword</label>
                            <input 
                                value={editPost.keyword}
                                onChange={e => setEditPost({...editPost, keyword: e.target.value})}
                                required
                                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Hero Image URL</label>
                            <input 
                                value={editPost.heroImage}
                                onChange={e => setEditPost({...editPost, heroImage: e.target.value})}
                                required
                                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Content (JSON stringified for AI structure or plain HTML/Markdown)</label>
                        <textarea 
                            value={editPost.content}
                            onChange={e => setEditPost({...editPost, content: e.target.value})}
                            required
                            rows={15}
                            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none font-mono text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Meta Title</label>
                            <input 
                                value={editPost.metaTitle}
                                onChange={e => setEditPost({...editPost, metaTitle: e.target.value})}
                                required
                                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Meta Description</label>
                            <input 
                                value={editPost.metaDescription}
                                onChange={e => setEditPost({...editPost, metaDescription: e.target.value})}
                                required
                                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button type="button" onClick={() => setIsEditing(false)} variant="secondary">Cancel</Button>
                        <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8">
                            <Save className="mr-2" /> Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        );
    }

    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.keyword.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Blog Admin</h1>
                    <p className="text-slate-500 font-medium mt-1 text-lg">Manage posts, AI generation, and comments</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button 
                        onClick={() => {
                            setEditPost({ title: '', keyword: '', content: '', heroImage: '', metaTitle: '', metaDescription: '', slug: '', isPublished: true });
                            setIsEditing(true);
                        }}
                        className="bg-white text-black hover:bg-slate-200 font-bold rounded-xl px-6 py-6"
                    >
                        <Plus className="w-5 h-5 mr-2" /> Add Manual Post
                    </Button>
                    <Button 
                        onClick={() => handleGenerate()}
                        disabled={generating}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl px-6 py-6"
                    >
                        {generating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <BrainCircuit className="w-5 h-5 mr-2" />}
                        Quick AI Generate
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/5 gap-8">
                <button 
                    onClick={() => setActiveTab('posts')}
                    className={`pb-4 text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'posts' ? 'text-indigo-500 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Blog Posts
                </button>
                <button 
                    onClick={() => setActiveTab('comments')}
                    className={`pb-4 text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'comments' ? 'text-indigo-500 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Comments {comments.filter(c => !c.isApproved).length > 0 && <span className="ml-2 bg-indigo-500 text-white px-2 py-0.5 rounded-full text-[10px]">{comments.filter(c => !c.isApproved).length}</span>}
                </button>
            </div>

            {activeTab === 'posts' ? (
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 bg-zinc-900/50 rounded-3xl p-8 border border-white/5 space-y-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Plus className="text-indigo-500" /> Add Keywords
                        </h3>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={newKeyword}
                                onChange={(e) => setNewKeyword(e.target.value)}
                                placeholder="Enter travel keyword..."
                                className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
                            />
                        </div>
                        <Button 
                            onClick={() => handleGenerate()}
                            disabled={generating || !newKeyword}
                            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl"
                        >
                            Create AI Post Now
                        </Button>

                        <div className="pt-6 border-t border-white/5">
                            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Upcoming Keywords</h4>
                            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                {keywords.filter(k => !k.used).map((k, i) => (
                                    <button 
                                        key={i}
                                        onClick={() => handleGenerate(k.keyword)}
                                        disabled={generating}
                                        className="px-3 py-1.5 bg-zinc-800/50 hover:bg-indigo-600/20 hover:text-indigo-400 rounded-lg text-xs font-medium text-slate-400 border border-white/5 transition-all"
                                    >
                                        {k.keyword}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 bg-zinc-900/50 rounded-3xl border border-white/5 overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                                <input 
                                    type="text" 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search blog posts..."
                                    className="w-full bg-black border border-white/10 rounded-xl pl-12 pr-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-zinc-900/80 text-slate-500 text-xs font-black uppercase tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4">Title</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-20 text-center">
                                                <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto" />
                                            </td>
                                        </tr>
                                    ) : filteredPosts.map((post) => (
                                        <tr key={post._id} className="hover:bg-white/5 group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={post.heroImage} className="w-10 h-10 rounded-lg object-cover" alt="" />
                                                    <div className="min-w-0">
                                                        <p className="text-white font-bold text-sm truncate max-w-[200px]">{post.title}</p>
                                                        <p className="text-xs text-slate-500">{post.keyword}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-bold text-emerald-500">Published</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button onClick={() => { setEditPost(post); setIsEditing(true); }} size="icon" variant="ghost"><Edit size={18} /></Button>
                                                    <Button onClick={() => handleDelete(post._id)} size="icon" variant="ghost" className="text-red-500"><Trash2 size={18} /></Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            ) : (
                <div className="bg-zinc-900/50 rounded-3xl border border-white/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-900/80 text-slate-500 text-xs font-black uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Author</th>
                                    <th className="px-6 py-4">Comment</th>
                                    <th className="px-6 py-4">Post</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr><td colSpan={4} className="px-6 py-20 text-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto" /></td></tr>
                                ) : comments.length === 0 ? (
                                    <tr><td colSpan={4} className="px-6 py-20 text-center text-slate-500 font-bold uppercase tracking-widest">No comments yet</td></tr>
                                ) : comments.map((comment) => (
                                    <tr key={comment._id} className="hover:bg-white/5 group">
                                        <td className="px-6 py-4 text-white font-bold text-sm">{comment.userName}</td>
                                        <td className="px-6 py-4 text-slate-400 text-sm max-w-md truncate">{comment.content}</td>
                                        <td className="px-6 py-4 text-xs text-indigo-400 font-medium">{(comment.postId as any)?.title || 'Deleted Post'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {!comment.isApproved && (
                                                    <Button onClick={() => handleModerateComment(comment._id, true)} size="icon" variant="ghost" className="text-emerald-500 hover:bg-emerald-500/10"><Check size={18} /></Button>
                                                )}
                                                <Button onClick={() => handleDeleteComment(comment._id)} size="icon" variant="ghost" className="text-red-500 hover:bg-red-500/10"><Trash2 size={18} /></Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
