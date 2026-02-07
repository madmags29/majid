'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';

const AnimatedLogo = dynamic(() => import('@/components/AnimatedLogo'), { ssr: false });
const AuthModal = dynamic(() => import('@/components/AuthModal'), { ssr: false });
const TypewriterText = dynamic(() => import('@/components/TypewriterText'), { ssr: false });

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState<string>('');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [user, setUser] = useState<{ name: string, email: string } | null>(null);

  useEffect(() => {
    // Check for logged in user
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

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    // Fetch background video
    fetch(`${API_URL}/api/background-video`)
      .then(res => res.json())
      .then(data => {
        if (data.url) setVideoUrl(data.url);
      })
      .catch(err => console.error('Failed to fetch video', err));

    // Fetch User Location and set suggestions
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        const country = data.country_name;
        setUserLocation(country);

        // Suggest destinations based on location
        if (country === 'India') {
          setSuggestions(['Goa', 'Jaipur', 'Kerala', 'Manali', 'Rishikesh']);
        } else if (['United States', 'Canada'].includes(country)) {
          setSuggestions(['New York', 'Las Vegas', 'Hawaii', 'Miami', 'Banff']);
        } else if (['United Kingdom', 'Ireland'].includes(country)) {
          setSuggestions(['London', 'Edinburgh', 'Cornwall', 'Dublin', 'Lake District']);
        } else {
          setSuggestions(['Paris', 'Tokyo', 'Bali', 'New York', 'Santorini']);
        }
      })
      .catch(() => {
        // Fallback if location fetch fails
        setSuggestions(['Paris', 'Tokyo', 'Bali', 'New York', 'Santorini']);
      });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;

    // Navigate to search page with destination as query param
    window.location.href = `/search?destination=${encodeURIComponent(searchQuery)}`;
  };

  const handleSuggestionClick = (suggestion: string) => {
    window.location.href = `/search?destination=${encodeURIComponent(suggestion)}`;
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

  return (
    <div className="h-screen text-white flex flex-col relative overflow-hidden">
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} initialMode={authMode} />

      {/* Base Background Color (Always present, sits behind video) */}
      <div className="fixed inset-0 bg-[#0f172a] -z-30" />

      {/* Video Background */}
      {videoUrl && (
        <div className="fixed inset-0 w-full h-full -z-10">
          <div className="absolute inset-0 bg-black/80 z-10" /> {/* Overlay for text readability */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            key={videoUrl}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        </div>
      )}

      {/* Fallback Background Gradients (only if no video) */}
      {!videoUrl && (
        <div className="fixed inset-0 pointer-events-none -z-20">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[120px]"></div>
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[120px]"></div>
        </div>
      )}

      {/* Header */}
      <header className="w-full py-6 px-8 flex justify-between items-center z-50">
        <div className="flex items-center gap-2">
          <AnimatedLogo className="w-10 h-10 text-blue-400" />
          <h1 className="text-3xl md:text-4xl text-white drop-shadow-md">
            <TypewriterText text="weekendtravellers.com" className="font-cursive text-4xl md:text-5xl" delay={500} />
          </h1>
        </div>
        <nav className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-200">Hi, {user.name}</span>
              <Button onClick={handleLogout} variant="ghost" className="text-white hover:bg-white/10 text-sm">Logout</Button>
            </div>
          ) : (
            <>
              <Button variant="ghost" onClick={() => openAuth('login')} className="text-white hover:bg-white/10">Login</Button>
              <Button onClick={() => openAuth('signup')} className="bg-blue-600/80 hover:bg-blue-700 backdrop-blur-sm text-white ml-4 border border-blue-400/30">Sign Up</Button>
            </>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl z-10 w-full"
        >
          <h2 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 drop-shadow-2xl">
            Discover Your Perfect <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200">Weekend Getaway</span>
          </h2>
          <p className="text-xl text-slate-100 mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-md font-medium">
            Just tell us where you want to go, or let us surprise you.
          </p>

          {/* Glass Search Bar */}
          <form onSubmit={handleSearch} className="w-full max-w-3xl mx-auto glass-panel p-3 rounded-2xl flex flex-col md:flex-row gap-3 transition-all duration-500 ease-in-out">
            <div className="flex-1 flex items-center px-4 py-3 glass-input rounded-xl">
              <MapPin className="w-5 h-5 text-slate-300 mr-3" />
              <input
                type="text"
                placeholder="Where to? (e.g., Paris)"
                className="bg-transparent w-full outline-none text-white placeholder:text-slate-400 font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-8 py-3 h-auto text-lg shadow-lg shadow-blue-900/50 min-w-[140px] border border-white/10">
              <Search className="w-5 h-5 mr-2" /> Search
            </Button>
          </form>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="mt-8 flex flex-wrap justify-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <span className="text-slate-300 text-sm font-medium mr-2 self-center">
                {userLocation ? `Popular in ${userLocation}:` : 'Trending:'}
              </span>
              {suggestions.map((place) => (
                <button
                  key={place}
                  onClick={() => handleSuggestionClick(place)}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 text-sm text-slate-100 transition-all hover:scale-105"
                >
                  {place}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </section>


    </div>
  );
}
