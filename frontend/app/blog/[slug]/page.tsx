import { BlogPost } from '@/types/blog';
import { API_URL } from '@/lib/config';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Calendar, User, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

async function getPost(slug: string): Promise<BlogPost | null> {
  const res = await fetch(`${API_URL}/api/blog/${slug}`, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Post Not Found' };

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      images: [post.heroImage],
      type: 'article',
      publishedTime: post.publishedDate,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.metaDescription,
      images: [post.heroImage],
    },
    alternates: {
      canonical: `https://www.weekendtravellers.com/blog/${post.slug}`,
    }
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  // JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: post.heroImage,
    datePublished: post.publishedDate,
    dateModified: post.updatedAt || post.publishedDate,
    author: {
      '@type': 'Organization',
      name: 'Weekend Travellers',
      url: 'https://www.weekendtravellers.com'
    },
    description: post.metaDescription,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.weekendtravellers.com/blog/${post.slug}`
    }
  };

  return (
    <article className="min-h-screen bg-[#0f172a] text-white selection:bg-blue-500/30 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[80vh] w-full">
        <Image 
          src={post.heroImage}
          alt={post.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent" />
        
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-4xl mx-auto px-6 pb-12 w-full">
            <Link href="/blog" className="inline-flex items-center gap-2 text-blue-400 font-bold mb-6 hover:text-blue-300 transition-colors uppercase tracking-widest text-xs">
              <ArrowLeft size={16} /> Back to Blog
            </Link>
            <h1 className="text-3xl md:text-6xl font-black italic tracking-tighter uppercase mb-6 leading-none">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300 font-medium">
              <span className="flex items-center gap-2"><User size={18} className="text-blue-400" /> {post.author}</span>
              <span className="flex items-center gap-2"><Calendar size={18} className="text-blue-400" /> {new Date(post.publishedDate).toLocaleDateString()}</span>
              <span className="flex items-center gap-2"><Clock size={18} className="text-blue-400" /> 8 min read</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-12 mt-12">
        {/* Sidebar / TOC */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24 p-6 bg-slate-900/50 border border-white/5 rounded-3xl">
            <h3 className="text-sm font-black uppercase tracking-widest text-blue-400 mb-4 italic">On this page</h3>
            <nav className="space-y-3">
              {/* This would ideally be dynamically parsed from H2 tags */}
              <div className="text-slate-400 text-sm hover:text-white transition-colors cursor-pointer">Introduction</div>
              <div className="text-slate-400 text-sm hover:text-white transition-colors cursor-pointer">Key Highlights</div>
              <div className="text-slate-400 text-sm hover:text-white transition-colors cursor-pointer">Travel Tips</div>
              <div className="text-slate-400 text-sm hover:text-white transition-colors cursor-pointer">FAQs</div>
            </nav>

            <div className="mt-12 p-6 bg-blue-600/10 rounded-2xl border border-blue-500/20">
               <h4 className="font-bold text-white mb-2">Plan your trip?</h4>
               <p className="text-xs text-slate-400 mb-4">Let our AI build you a custom itinerary in seconds.</p>
               <Link href="/" className="inline-block bg-blue-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-500 transition-colors">Start Planning</Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div 
            className="prose prose-invert prose-blue max-w-none 
              prose-h2:text-3xl prose-h2:font-black prose-h2:italic prose-h2:tracking-tighter prose-h2:uppercase prose-h2:text-white prose-h2:mt-12
              prose-h3:text-xl prose-h3:font-bold prose-h3:text-blue-400 prose-h3:mb-2
              prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-lg
              prose-li:text-slate-300 prose-strong:text-white prose-img:rounded-3xl prose-img:shadow-2xl prose-img:my-12
            "
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Related Posts Placeholder */}
          <div className="mt-20 pt-12 border-t border-white/5">
              <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-8">Related <span className="text-blue-400">Guides</span></h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Would fetch related posts based on keyword */}
                  <div className="h-40 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-center text-slate-500 italic">
                    More guides coming soon...
                  </div>
              </div>
          </div>
        </div>
      </div>
    </article>
  );
}
