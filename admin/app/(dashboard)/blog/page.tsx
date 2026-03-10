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
    Eye
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.weekendtravellers.com';

export default function BlogAdminPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [keywords, setKeywords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [newKeyword, setNewKeyword] = useState('');

    const fetchPosts = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_BASE}/api/admin/blog`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setPosts(data);
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
            setKeywords(data);
        } catch (error) {
            toast.error('Failed to fetch keywords');
        }
    };

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            await Promise.all([fetchPosts(), fetchKeywords()]);
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

    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.keyword.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Blog Management</h1>
                    <p className="text-slate-500 font-medium mt-1 text-lg">AI-Powered Content Control Center</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button 
                        onClick={() => handleGenerate()}
                        disabled={generating}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl px-6 py-6 shadow-lg shadow-indigo-900/20"
                    >
                        {generating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <BrainCircuit className="w-5 h-5 mr-2" />}
                        Quick AI Generate
                    </Button>
                </div>
            </div>

            {/* Keyword Management Row */}
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
                            className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600"
                        />
                    </div>
                    <Button 
                        onClick={() => handleGenerate()}
                        disabled={generating || !newKeyword}
                        className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl border border-white/5"
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

                {/* Posts Table */}
                <div className="lg:col-span-2 bg-zinc-900/50 rounded-3xl border border-white/5 overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between bg-zinc-900/30">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                            <input 
                                type="text" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search blog posts..."
                                className="w-full bg-black border border-white/10 rounded-xl pl-12 pr-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-zinc-900/80 text-slate-500 text-xs font-black uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Title</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-20 text-center">
                                            <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-4" />
                                            <p className="text-slate-500">Retrieving your content...</p>
                                        </td>
                                    </tr>
                                ) : filteredPosts.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-20 text-center text-slate-500">
                                            No blog posts found matching your search.
                                        </td>
                                    </tr>
                                ) : filteredPosts.map((post) => (
                                    <tr key={post._id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-zinc-800 overflow-hidden relative shrink-0">
                                                    <img src={post.heroImage} className="object-cover w-full h-full" alt="" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-white font-bold text-sm truncate max-w-[200px]">{post.title}</p>
                                                    <p className="text-xs text-slate-500 truncate max-w-[200px]">{post.keyword}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="flex items-center gap-1.5 text-emerald-500 text-xs font-bold">
                                                <CheckCircle2 size={14} /> Published
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 text-xs font-medium">
                                            {new Date(post.publishedDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`https://weekendtravellers.com/blog/${post.slug}`} target="_blank">
                                                    <Button size="icon" variant="ghost" className="hover:bg-white/5 hover:text-indigo-400"><Eye size={18} /></Button>
                                                </Link>
                                                <Button 
                                                    onClick={() => handleDelete(post._id)}
                                                    size="icon" 
                                                    variant="ghost" 
                                                    className="hover:bg-red-950/30 hover:text-red-500"
                                                >
                                                    <Trash2 size={18} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
}
