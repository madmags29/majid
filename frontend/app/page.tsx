import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Search, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HomeClient from './HomeClient';
import { API_URL, IS_BUILD } from '@/lib/config';

// Revalidate homepage every hour
export const revalidate = 3600;

async function getBlogPosts() {
  // For SSR on Vercel: rewrites only apply to browser requests, NOT server-side fetch.
  // We must use the absolute backend URL here.
  const backendUrl = process.env.BACKEND_URL
    || process.env.NEXT_PUBLIC_API_URL
    || 'https://backend-flax-eight-93.vercel.app';

  if (IS_BUILD && backendUrl.includes('localhost')) {
    console.log('Skipping blog post fetch during build to prevent timeout...');
    return [];
  }

  try {
    const res = await fetch(`${backendUrl}/api/blog`, { 
      cache: 'no-store'
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.slice(0, 3) : [];
  } catch (error) {
    console.error('Failed to fetch blog posts for homepage:', error);
    return [];
  }
}

export default async function LandingPage() {
  const blogPosts = await getBlogPosts();

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Weekend Travellers",
    "url": "https://weekendtravellers.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://weekendtravellers.com/search?destination={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Weekend Travellers",
    "url": "https://weekendtravellers.com",
    "logo": "https://weekendtravellers.com/logo.png",
    "sameAs": [
      "https://facebook.com/weekendtravellers",
      "https://twitter.com/weekendtravellrs"
    ]
  };

  return (
    <div className="min-h-screen text-white flex flex-col relative overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      
      <HomeClient initialBlogPosts={blogPosts} />

      {/* Discover India - Server Rendered for SEO */}
      <section className="py-24 px-6 relative z-20 border-t border-white/5 bg-slate-900/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white mb-4 uppercase">Discover India</h2>
              <p className="text-xl text-slate-400 max-w-2xl">Uncover the magic of the subcontinent. From the spiritual Ghats of Rishikesh to the royal palaces of Jaipur.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Rishikesh', slug: 'rishikesh', image: 'https://images.pexels.com/photos/17228392/pexels-photo-17228392/free-photo-of-lakshman-jhula-bridge-in-rishikesh-india.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Yoga capital of the world and Ganga vibes.' },
              { name: 'Jaipur', slug: 'jaipur', image: 'https://images.pexels.com/photos/3581364/pexels-photo-3581364.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'The Pink City: Royal forts and vibrant bazaars.' },
              { name: 'Munnar', slug: 'munnar', image: 'https://images.pexels.com/photos/13691355/pexels-photo-13691355.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Rolling tea gardens and misty mountain peaks.' },
              { name: 'Udaipur', slug: 'udaipur', image: 'https://images.pexels.com/photos/11140939/pexels-photo-11140939.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'City of Lakes: Romantic palaces and boat rides.' },
              { name: 'Shimla', slug: 'shimla', image: 'https://images.pexels.com/photos/20349479/pexels-photo-20349479/free-photo-of-shimla-city-view-in-winter-captured-at-night.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Colonial charm in the heart of the Himalayas.' },
            ].map((city) => (
              <Link key={city.slug} href={`/explore/${city.slug}`} className="group relative h-80 rounded-3xl overflow-hidden border border-white/10 hover:border-blue-500/50 transition-all shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10" />
                <Image
                  src={city.image}
                  alt={`${city.name} Travel Guide - Weekend Travellers`}
                  fill
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute bottom-0 left-0 p-6 z-20">
                  <h3 className="text-2xl font-black text-white italic tracking-tighter mb-1">{city.name}</h3>
                  <p className="text-slate-300 text-xs mb-3 line-clamp-2">{city.description}</p>
                  <Button size="sm" className="bg-white text-slate-950 rounded-full font-bold px-4 h-8 text-xs group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    Explore
                  </Button>
                </div>
              </Link>
            ))}
            <Link
              href="/explore/all"
              className="group relative h-80 rounded-3xl overflow-hidden border-2 border-dashed border-blue-500/30 hover:border-blue-500 transition-all bg-gradient-to-br from-blue-600/10 to-purple-600/10 flex flex-col items-center justify-center text-center p-8 hover:bg-blue-500/5"
            >
              <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MapPin className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-2xl font-black text-white italic tracking-tighter mb-2 uppercase">More Weekend Trips</h3>
              <p className="text-slate-400 text-sm mb-6">Discover 50+ hand-picked destinations tailored for your perfect mini-break.</p>
              <div className="bg-blue-600 text-white rounded-full font-bold px-6 py-2 text-sm shadow-xl shadow-blue-900/40 transition-all">
                Browse All
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Stories - Server Rendered for SEO */}
      {blogPosts.length > 0 && (
        <section className="py-24 px-6 relative z-20 border-t border-white/5 bg-[#020617]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 text-center md:text-left">
              <div>
                <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white mb-4 uppercase">Latest Stories</h2>
                <p className="text-xl text-slate-400 max-w-2xl">Expert guides, weekend hacks, and travel inspiration from our AI writers.</p>
              </div>
              <Link href="/blog" className="inline-flex items-center gap-2 text-blue-400 font-bold hover:text-blue-300 transition-colors uppercase tracking-widest text-xs">
                View All Stories <Search size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {blogPosts.map((post: any) => (
                <article 
                  key={post._id}
                  className="group flex flex-col h-full bg-slate-900/30 rounded-[2rem] overflow-hidden border border-slate-800/50 hover:border-blue-500/50 transition-all shadow-xl hover:shadow-2xl hover:shadow-blue-500/5"
                >
                  <Link href={`/blog/${post.slug}`} className="block relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={post.heroImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full border border-white/10">
                        {post.keyword?.split(' ')[0] || 'Travel'}
                      </span>
                    </div>
                  </Link>
                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">
                      <span className="flex items-center gap-1.5 font-bold">
                        <Calendar size={12} className="text-blue-500" /> 
                        {post.publishedDate ? new Date(post.publishedDate).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-4 leading-snug group-hover:text-blue-400 transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h4>
                    <p className="text-slate-400 text-sm mb-8 line-clamp-3 leading-relaxed font-medium flex-1">
                      {post.metaDescription}
                    </p>
                    <Link href={`/blog/${post.slug}`} className="text-blue-500 hover:text-blue-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2 mt-auto">
                      Read Story
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Explore by Region - Server Rendered for SEO */}
      <section className="py-24 px-6 relative z-20 border-t border-white/5 bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white mb-4 uppercase">Explore the World</h2>
              <p className="text-xl text-slate-400 max-w-2xl">Dive deep into our curated guides for countries, states, and cities. 2000+ words of history, food, and secret spots.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'India', slug: 'india', image: 'https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'From the Himalayas to the backwaters of Kerala.' },
              { name: 'Europe', slug: 'europe', image: 'https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Timeless cities, art, and legendary landscapes.' },
              { name: 'Thailand', slug: 'thailand-bangkok', image: 'https://images.pexels.com/photos/2412711/pexels-photo-2412711.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Exotic beaches, street food, and golden temples.' },
              { name: 'Japan', slug: 'tokyo', image: 'https://images.pexels.com/photos/1440476/pexels-photo-1440476.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Neon cities, ancient shrines, and cherry blossoms.' },
              { name: 'Bali', slug: 'bali', image: 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Tropical paradise, spiritual retreats, and surf.' },
              { name: 'Goa', slug: 'goa', image: 'https://images.pexels.com/photos/4429334/pexels-photo-4429334.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Sun-drenched beaches and Portuguese heritage.' }
            ].map((region) => (
              <Link key={region.slug} href={`/explore/${region.slug}`} className="group relative h-96 rounded-3xl overflow-hidden border border-white/10 hover:border-blue-500/50 transition-all shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10" />
                <Image
                  src={region.image}
                  alt={`${region.name} Tourism Guide - Weekend Travellers`}
                  fill
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute bottom-0 left-0 p-8 z-20">
                  <h3 className="text-3xl font-black text-white italic tracking-tighter mb-2">{region.name}</h3>
                  <p className="text-slate-300 text-sm mb-4 line-clamp-3">{region.description}</p>
                  <Button className="bg-white text-slate-950 rounded-full font-bold px-6 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    Explore Guide
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {/* How it Works - Text Rich Section for SEO */}
      <section className="py-24 px-6 relative z-20 border-t border-white/5 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white mb-8 uppercase">How It Works</h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center shrink-0 border border-blue-500/20">
                    <span className="text-xl font-black text-blue-400 font-cursive italic">01</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Define Your Weekend</h3>
                    <p className="text-slate-400 leading-relaxed">
                      Simply enter your destination or a general region you&apos;d like to explore. Our AI analyzes your starting point to suggest local gems within a 2-4 day travel radius. Whether it&apos;s a quick mountain escape or a coastal retreat, we find the perfect spot based on seasonal trends and travel logistics.
                    </p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-purple-600/20 flex items-center justify-center shrink-0 border border-purple-500/20">
                    <span className="text-xl font-black text-purple-400 font-cursive italic">02</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Smart Itinerary Generation</h3>
                    <p className="text-slate-400 leading-relaxed">
                      Our advanced AI travel engine instantly builds a comprehensive, hour-by-hour itinerary. Unlike generic travel guides, we include hidden local secrets, the best times to visit specific attractions to avoid crowds, and curated food recommendations that reflect the authentic culture of the destination.
                    </p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-pink-600/20 flex items-center justify-center shrink-0 border border-pink-500/20">
                    <span className="text-xl font-black text-pink-400 font-cursive italic">03</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Customize & Book</h3>
                    <p className="text-slate-400 leading-relaxed">
                      Refine your plan using our interactive chat—request more adventure, better budget options, or family-friendly activities. Once satisfied, save your trip to your profile or use our integrated booking tools to secure the best-rated hotels and travel connections for your selected dates.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 p-1 rounded-[3rem] border border-white/10 shadow-2xl">
              <div className="bg-slate-900/60 backdrop-blur-3xl p-10 rounded-[2.8rem] space-y-8">
                <h3 className="text-3xl font-black italic tracking-tighter text-white uppercase">Why Choose Weekend Travellers?</h3>
                <p className="text-slate-300 leading-relaxed italic">
                  &quot;In 2026, travel shouldn&apos;t be a chore. We built Weekend Travellers to solve the &apos;planning fatigue&apos; that ruins short getaways. By leveraging real-time data and advanced LLMs, we provide value that static blogs can&apos;t: personalization, accuracy, and speed.&quot;
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="text-2xl font-black text-blue-400">50K+</div>
                    <div className="text-xs uppercase tracking-widest font-bold text-slate-500">Trips Planned</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-black text-purple-400">AI Driven</div>
                    <div className="text-xs uppercase tracking-widest font-bold text-slate-500">Real-time Data</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-black text-pink-400">2026 Ready</div>
                    <div className="text-xs uppercase tracking-widest font-bold text-slate-500">Latest Trends</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-black text-green-400">100% Free</div>
                    <div className="text-xs uppercase tracking-widest font-bold text-slate-500">No Hidden Fees</div>
                  </div>
                </div>
                <div className="pt-4">
                  <p className="text-sm text-slate-400 leading-relaxed">
                    We specialize in 2-day and 3-day itineraries, focusing on maximizing your experience without the burnout of long-distance travel. Our mission is to make every weekend feel like a full vacation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
