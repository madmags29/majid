'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';
import { API_URL } from '@/lib/config';
import { Button } from '@/components/ui/button';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  metaDescription: string;
  heroImage: string;
  author: string;
  publishedDate: string;
  keyword: string;
}

export default function BlogListingPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/blog`)
      .then(res => res.json())
      .then(data => {
        setPosts(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch blog posts', err);
        setIsLoading(false);
      });
  }, []);

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.keyword.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-white selection:bg-blue-500/30">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent -z-10" />
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-6"
          >
            Travel Insights & <span className="text-blue-400">Guides</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto mb-10"
          >
            Expert advice, hidden gems, and comprehensive guides for your next weekend escape.
          </motion.p>

          <div className="max-w-md mx-auto relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
            <input 
              type="text"
              placeholder="Search travel guides..."
              className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-[450px] bg-white/5 rounded-3xl animate-pulse border border-white/10" />
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, idx) => (
              <motion.article
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group flex flex-col bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden hover:border-blue-500/30 transition-all hover:shadow-2xl hover:shadow-blue-500/5"
              >
                <Link href={`/blog/${post.slug}`} className="relative h-64 overflow-hidden">
                  <Image 
                    src={post.heroImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                </Link>
                
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                    <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full text-blue-400 font-semibold uppercase tracking-wider">
                      {post.keyword.split(' ')[0]}
                    </span>
                    <span className="flex items-center gap-1.5"><Calendar size={14}/> {new Date(post.publishedDate).toLocaleDateString()}</span>
                  </div>

                  <h2 className="text-2xl font-bold tracking-tight text-white mb-3 group-hover:text-blue-400 transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  
                  <p className="text-slate-400 text-sm line-clamp-3 mb-6 flex-1">
                    {post.metaDescription}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex items-center gap-2">
                       <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs uppercase">
                        {post.author.charAt(0)}
                       </div>
                       <span className="text-xs font-medium text-slate-300">{post.author}</span>
                    </div>
                    <Link href={`/blog/${post.slug}`} className="flex items-center gap-1 text-sm font-bold text-white group-hover:text-blue-400 transition-colors uppercase italic tracking-tighter">
                      Read More <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-slate-400">No blog posts found matching your search.</h3>
            <Button 
              variant="outline" 
              className="mt-6 border-white/10 hover:bg-white/5"
              onClick={() => setSearchTerm('')}
            >
              View All Posts
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
