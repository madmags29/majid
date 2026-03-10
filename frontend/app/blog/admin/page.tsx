'use client';

import { useState, useEffect } from 'react';
import { API_URL } from '@/lib/config';
import { BlogPost, BlogKeyword } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit, Play, RefreshCw, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [keywords, setKeywords] = useState<BlogKeyword[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [postsRes, keywordsRes] = await Promise.all([
        fetch(`${API_URL}/api/blog`),
        fetch(`${API_URL}/api/admin/blog/keywords`, { headers })
      ]);

      const postsData = await postsRes.json();
      const keywordsData = await keywordsRes.json();

      setPosts(postsData);
      setKeywords(keywordsData);
    } catch (error) {
      console.error('Failed to fetch admin data', error);
      toast.error('Failed to load admin data. Are you logged in as admin?');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddKeyword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/admin/blog/keywords`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ keyword: newKeyword })
      });

      if (res.ok) {
        setNewKeyword('');
        fetchData();
        toast.success('Keyword added to queue');
      }
    } catch (error) {
      toast.error('Failed to add keyword');
    }
  };

  const handleGenerateManual = async (keyword: string) => {
    setIsGenerating(true);
    toast.info(`Generating blog for: ${keyword}... This may take a minute.`);
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/admin/blog/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ keyword })
      });

      if (res.ok) {
        toast.success('Blog post generated successfully!');
        fetchData();
      } else {
        const error = await res.json();
        toast.error(`Generation failed: ${error.error}`);
      }
    } catch (error) {
      toast.error('Failed to connect to generation service');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/admin/blog/posts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        toast.success('Post deleted');
        fetchData();
      }
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">Blog <span className="text-blue-400">Management</span></h1>
            <p className="text-slate-400">Control your AI-powered SEO content engine.</p>
          </div>
          <Button onClick={fetchData} variant="outline" className="border-white/10">
            <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Keyword Queue */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Clock className="text-blue-400" size={20} /> Keyword Queue
              </h2>
              
              <form onSubmit={handleAddKeyword} className="mb-6 flex gap-2">
                <input 
                  type="text" 
                  placeholder="New target keyword..."
                  className="bg-slate-800 border border-white/5 rounded-xl px-4 py-2 outline-none focus:border-blue-500/50 flex-1 text-sm"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                />
                <Button type="submit" size="icon" className="bg-blue-600 hover:bg-blue-50">
                  <Plus size={18} />
                </Button>
              </form>

              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {keywords.map((kw) => (
                  <div key={kw._id} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5 group">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{kw.keyword}</span>
                      <span className="text-[10px] text-slate-500">
                        {kw.used ? `Published ${new Date(kw.usedAt!).toLocaleDateString()}` : 'Scheduled'}
                      </span>
                    </div>
                    {kw.used ? (
                      <CheckCircle size={16} className="text-green-500" />
                    ) : (
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleGenerateManual(kw.keyword)}
                        disabled={isGenerating}
                      >
                        <Play size={14} fill="currentColor" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Published Posts */}
          <div className="lg:col-span-2">
             <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Edit className="text-blue-400" size={20} /> Published Posts
              </h2>

              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post._id} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/20 transition-all">
                    <div className="relative h-16 w-24 rounded-lg overflow-hidden shrink-0">
                      <img src={post.heroImage} className="object-cover w-full h-full" alt="" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold truncate">{post.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>{new Date(post.publishedDate).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{post.keyword}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" asChild className="h-9 w-9 text-slate-400 hover:text-white">
                        <a href={`/blog/${post.slug}`} target="_blank"><Play size={16} /></a>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        onClick={() => handleDeletePost(post._id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
                {posts.length === 0 && !isLoading && (
                  <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                    <p className="text-slate-500 italic">No posts published yet. Use the keyword queue to generate some!</p>
                  </div>
                )}
              </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
