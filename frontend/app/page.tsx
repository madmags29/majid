'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

import dynamic from 'next/dynamic';

import Link from 'next/link';
import Image from 'next/image';
import AnimatedLogo from '@/components/AnimatedLogo';
import TypewriterText from '@/components/TypewriterText';

const AuthModal = dynamic(() => import('@/components/AuthModal'));
const CategoryBanner = dynamic(() => import('@/components/CategoryBanner'));
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const VisitorCounter = dynamic(() => import('@/components/VisitorCounter'), { ssr: false });
const FloatingDestinations = dynamic(() => import('@/components/FloatingDestinations'), { ssr: false });
const LocationAssistant = dynamic(() => import('@/components/LocationAssistant'), { ssr: false });

import { API_URL } from '@/lib/config';

import CinematicLoader from '@/components/CinematicLoader';

export default function LandingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoCredit, setVideoCredit] = useState<{ name: string, url: string } | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState<string>('');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [user, setUser] = useState<{ name: string, email: string } | null>(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [lastFetchedLocation, setLastFetchedLocation] = useState<string>('');

  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    checkUser();
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  const fetchDynamicSuggestions = useCallback(async (location: string) => {
    if (!location) return;

    setIsLoadingSuggestions(true);
    setLastFetchedLocation(location);
    try {
      const res = await fetch(`${API_URL}/api/suggestions?location=${encodeURIComponent(location)}`);
      if (!res.ok) throw new Error('Failed to fetch suggestions');
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error('Failed to load suggestions', err);
      // Fallback only if no suggestions already exist
      setSuggestions(prev => prev.length > 0 ? prev : ['Paris', 'Tokyo', 'Bali', 'New York', 'Santorini']);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, []); // Remove dependencies to prevent loop

  const handleLocationFound = useCallback((location: string) => {
    setUserLocation(prev => {
      if (prev === location) return prev;
      return location;
    });
  }, []);

  // 2. Fetch background video and other one-time data
  useEffect(() => {
    fetch(`${API_URL}/api/background-video`)
      .then(res => res.json())
      .then(data => {
        if (data.url) {
          setVideoUrl(data.url);
          if (data.photographer) {
            setVideoCredit({ name: data.photographer, url: data.photographer_url });
          }
        }
      })
      .catch(err => console.error("Failed to load video", err));

    // Initial coarse location for suggestions if not already set
    if (!userLocation) {
      fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
          const location = data.city ? `${data.city}, ${data.country_name}` : data.country_name;
          setUserLocation(prev => prev || location);
        })
        .catch(() => {
          if (!userLocation) {
            setSuggestions(prev => prev.length > 0 ? prev : ['Paris', 'Tokyo', 'Bali', 'New York', 'Santorini']);
          }
        });
    }
  }, []); // Truly mount-only

  // 3. React to userLocation changes to fetch suggestions
  useEffect(() => {
    if (userLocation) {
      fetchDynamicSuggestions(userLocation);
    }
  }, [userLocation, fetchDynamicSuggestions]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;

    // Navigate to search page with destination as query param
    const originParam = userLocation ? `&origin=${encodeURIComponent(userLocation)}` : '';
    router.push(`/search?destination=${encodeURIComponent(searchQuery)}${originParam}`);
  };

  const handleSuggestionClick = (suggestion: string) => {
    const originParam = userLocation ? `&origin=${encodeURIComponent(userLocation)}` : '';
    router.push(`/search?destination=${encodeURIComponent(suggestion)}${originParam}`);
  };

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.dispatchEvent(new Event('storage')); // Notify other tabs/components
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    // Simulate minimal loading delay - significantly reduced for mobile FCP
    const delay = window.innerWidth < 768 ? 800 : 2500;
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen text-white flex flex-col relative">
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} initialMode={authMode} />

      <AnimatePresence mode="wait">
        {isLoading && <CinematicLoader key="loader" />}
      </AnimatePresence>

      {/* Base Background Color (Always present, sits behind video) */}
      <div className="fixed inset-0 bg-[#0f172a] -z-30" />

      {/* Preload critical LCP assets */}
      {videoUrl && (
        <link rel="preload" as="image" href="/video-poster.png" />
      )}

      {/* Video Background */}
      {videoUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isVideoReady ? 1 : 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 w-full h-full -z-10"
        >
          <div className="absolute inset-0 bg-black/80 z-10" />
          <video
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={() => setIsVideoReady(true)}
            className="w-full h-full object-cover"
            key={videoUrl}
            poster="/video-poster.png"
            title="Destination background"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
          {videoCredit && (
            <div className="absolute bottom-4 right-4 z-20 text-[10px] text-slate-400 bg-black/40 px-2 py-1 rounded backdrop-blur-sm pointer-events-auto">
              Video by <a href={videoCredit.url} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white underline decoration-dashed">{videoCredit.name}</a> on Pexels
            </div>
          )}
        </motion.div>
      )}

      {/* Fallback Background Gradients (only if no video) */}
      {!videoUrl && (
        <div className="fixed inset-0 pointer-events-none -z-20">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[120px]"></div>
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[120px]"></div>
        </div>
      )}

      <FloatingDestinations />
      <LocationAssistant onLocationFound={handleLocationFound} />

      {/* Header */}
      <header className="w-full py-4 px-6 flex justify-between items-center z-50">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <AnimatedLogo className="w-8 h-8 md:w-10 md:h-10 text-blue-400" />
          <div className="text-2xl md:text-3xl text-white drop-shadow-md">
            <TypewriterText
              text="weekendtravellers.com"
              className="font-cursive text-3xl md:text-4xl"
              delay={500}
            />
          </div>
        </Link>
        <nav className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-slate-900 border-slate-800 text-slate-100" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-slate-400">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-800" />
                  <DropdownMenuItem asChild className="focus:bg-slate-800 focus:text-white cursor-pointer hover:bg-slate-800">
                    <Link href="/profile">My Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-800" />
                  <DropdownMenuItem asChild className="focus:bg-slate-800 focus:text-white cursor-pointer hover:bg-slate-800">
                    <Link href="/trips">My Trips</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-800" />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-400 focus:text-red-300 focus:bg-slate-800 cursor-pointer hover:bg-slate-800">
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {/* Mobile Login | Signup */}
              <div className="flex md:hidden items-center text-sm font-bold tracking-wide">
                <button
                  onClick={() => openAuth('login')}
                  className="text-slate-200 hover:text-white transition-colors"
                >
                  LOGIN
                </button>
                <span className="mx-2 text-slate-500/50 font-light">|</span>
                <button
                  onClick={() => openAuth('signup')}
                  className="text-slate-200 hover:text-white transition-colors"
                >
                  SIGNUP
                </button>
              </div>

              {/* Desktop Login & Sign Up */}
              <div className="hidden md:flex items-center gap-4">
                <Button
                  onClick={() => openAuth('login')}
                  variant="ghost"
                  className="text-slate-200 hover:text-white hover:bg-white/10 transition-all font-medium"
                >
                  Login
                </Button>
                <Button
                  onClick={() => openAuth('signup')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 border-0 rounded-xl px-6 transition-all transform hover:scale-105 active:scale-95"
                >
                  Sign Up
                </Button>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-20 pb-32 relative z-10">
        <div className="text-center max-w-4xl z-10 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
          <div className="flex justify-center mb-6 min-h-[40px]">
            <VisitorCounter />
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 drop-shadow-2xl">
            Discover Your Perfect <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200">Weekend Getaway</span>
          </h1>
          <p className="text-xl text-slate-100 mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-md font-medium">
            Just tell us where you want to go, or let us surprise you.
          </p>

          {/* Glass Search Bar */}
          <form onSubmit={handleSearch} className="w-full max-w-3xl mx-auto glass-panel p-3 rounded-2xl flex flex-col md:flex-row gap-3 transition-all duration-500 ease-in-out">
            <div className="flex-1 flex items-center px-4 py-3 glass-input rounded-xl">
              <MapPin className="w-5 h-5 text-slate-300 mr-3" />
              <input
                type="text"
                placeholder="Where to? (e.g. Paris) or 3 days weekend trip near me?"
                className="bg-transparent w-full outline-none text-white placeholder:text-slate-400 font-medium text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-8 py-3 h-auto text-lg shadow-lg shadow-blue-900/50 min-w-[140px] border border-white/10">
              <Search className="w-5 h-5 mr-2" /> Search
            </Button>
          </form>

          {/* Suggestions */}
          <div className="min-h-[100px] mt-8">
            {(suggestions.length > 0 || isLoadingSuggestions) && (
              <div className="flex flex-wrap justify-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                <span className="text-slate-300 text-sm font-medium mr-2 self-center">
                  {isLoadingSuggestions ? 'Finding best trips for you...' : (userLocation ? `Popular in ${userLocation}:` : 'Trending:')}
                </span>
                {isLoadingSuggestions ? (
                  <div className="flex gap-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-8 w-24 bg-white/10 rounded-full animate-pulse border border-white/5" />
                    ))}
                  </div>
                ) : (
                  suggestions.map((place) => (
                    <button
                      key={place}
                      onClick={() => handleSuggestionClick(place)}
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 text-sm text-slate-100 transition-all hover:scale-105 active:scale-95"
                    >
                      {place}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          {/* Travel Categories */}
          <CategoryBanner userLocation={userLocation} />
        </div>
      </section>


      {/* Discover India */}
      <section className="py-24 px-6 relative z-20 border-t border-white/5 bg-slate-900/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white mb-4 uppercase">Discover India</h2>
              <p className="text-xl text-slate-400 max-w-2xl">Uncover the magic of the subcontinent. From the spiritual Ghats of Rishikesh to the royal palaces of Jaipur.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Rishikesh', slug: 'india/uttarakhand/rishikesh', image: 'https://images.pexels.com/photos/17228392/pexels-photo-17228392/free-photo-of-lakshman-jhula-bridge-in-rishikesh-india.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Yoga capital of the world and Ganga vibes.' },
              { name: 'Jaipur', slug: 'india/rajasthan/jaipur', image: 'https://images.pexels.com/photos/3581364/pexels-photo-3581364.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'The Pink City: Royal forts and vibrant bazaars.' },
              { name: 'Munnar', slug: 'india/kerala/munnar', image: 'https://images.pexels.com/photos/13691355/pexels-photo-13691355.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Rolling tea gardens and misty mountain peaks.' },
              { name: 'Udaipur', slug: 'india/rajasthan/udaipur', image: 'https://images.pexels.com/photos/11140939/pexels-photo-11140939.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'City of Lakes: Romantic palaces and boat rides.' },
              { name: 'Shimla', slug: 'india/himachal-pradesh/shimla', image: 'https://images.pexels.com/photos/20349479/pexels-photo-20349479/free-photo-of-shimla-city-view-in-winter-captured-at-night.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Colonial charm in the heart of the Himalayas.' },
              { name: 'Manali', slug: 'india/himachal-pradesh/manali', image: 'https://images.pexels.com/photos/20563456/pexels-photo-20563456/free-photo-of-manali-valley-himachal-pradesh.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Adventure hub and snow-capped peaks.' },
              { name: 'Golden Temple', slug: 'india/punjab/amritsar', image: 'https://images.pexels.com/photos/14840502/pexels-photo-14840502.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Spiritual tranquility at the heart of Amritsar.' },
              { name: 'Goa Beaches', slug: 'india/goa', image: 'https://images.pexels.com/photos/4429334/pexels-photo-4429334.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Sun, sand, and Portuguese heritage.' }
            ].map((city) => (
              <Link key={city.slug} href={`/explore/${city.slug}`} className="group relative h-72 rounded-3xl overflow-hidden border border-white/10 hover:border-blue-500/50 transition-all shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10" />
                <Image
                  src={city.image}
                  alt={city.name}
                  fill
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                <div className="absolute bottom-0 left-0 p-6 z-20">
                  <h3 className="text-xl font-black text-white italic tracking-tighter mb-1">{city.name}</h3>
                  <p className="text-slate-300 text-[10px] mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">{city.description}</p>
                  <Button size="sm" className="bg-white text-slate-950 rounded-full font-bold px-4 h-8 text-xs group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    Explore
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Explore by Region */}
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
              { name: 'Europe', slug: 'europe', image: 'https://images.pexels.com/photos/1530259/pexels-photo-1530259.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Timeless cities, art, and legendary landscapes.' },
              { name: 'Thailand', slug: 'asia/thailand', image: 'https://images.pexels.com/photos/2412711/pexels-photo-2412711.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Exotic beaches, street food, and golden temples.' },
              { name: 'Japan', slug: 'asia/japan', image: 'https://images.pexels.com/photos/1440476/pexels-photo-1440476.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Neon cities, ancient shrines, and cherry blossoms.' },
              { name: 'Bali', slug: 'asia/indonesia/bali', image: 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Tropical paradise, spiritual retreats, and surf.' },
              { name: 'Goa', slug: 'india/goa', image: 'https://images.pexels.com/photos/4429334/pexels-photo-4429334.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Sun-drenched beaches and Portuguese heritage.' }
            ].map((region) => (
              <Link key={region.slug} href={`/explore/${region.slug}`} className="group relative h-96 rounded-3xl overflow-hidden border border-white/10 hover:border-blue-500/50 transition-all shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10" />
                <Image
                  src={region.image}
                  alt={region.name}
                  fill
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute bottom-0 left-0 p-8 z-20">
                  <h3 className="text-3xl font-black text-white italic tracking-tighter mb-2">{region.name}</h3>
                  <p className="text-slate-300 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{region.description}</p>
                  <Button className="bg-white text-slate-950 rounded-full font-bold px-6 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    Explore Guide
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div >
  );
}

