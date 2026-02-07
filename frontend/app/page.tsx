'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Briefcase, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Define types for itinerary
interface Activity {
  time: string;
  description: string;
  location: string;
}

interface Day {
  day: number;
  title: string;
  activities: Activity[];
}

interface Itinerary {
  destination: string;
  summary: string;
  days: Day[];
}

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [videoUrl, setVideoUrl] = useState<string>('');

  useEffect(() => {
    // Fetch background video
    fetch('http://localhost:5001/api/background-video')
      .then(res => res.json())
      .then(data => {
        if (data.url) setVideoUrl(data.url);
      })
      .catch(err => console.error('Failed to fetch video', err));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;

    // Navigate to search page with destination as query param
    window.location.href = `/search?destination=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <div className="min-h-screen text-white flex flex-col relative overflow-x-hidden">
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
          <Briefcase className="w-8 h-8 text-blue-400" />
          <h1 className="text-2xl font-bold text-white drop-shadow-md">
            WeekendTravellers
          </h1>
        </div>
        <nav>
          <Button variant="ghost" className="text-white hover:bg-white/10">Login</Button>
          <Button className="bg-blue-600/80 hover:bg-blue-700 backdrop-blur-sm text-white ml-4 border border-blue-400/30">Sign Up</Button>
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
            <div className="flex-1 flex items-center px-4 py-3 glass-input rounded-xl">
              <Calendar className="w-5 h-5 text-slate-300 mr-3" />
              <input
                type="text"
                placeholder="Add dates"
                className="bg-transparent w-full outline-none text-white placeholder:text-slate-400 font-medium"
              />
            </div>
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-8 py-3 h-auto text-lg shadow-lg shadow-blue-900/50 min-w-[140px] border border-white/10">
              <Search className="w-5 h-5 mr-2" /> Search
            </Button>
          </form>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-slate-400 text-sm relative z-10 border-t border-white/5">
        © 2026 WeekendTravellers. All rights reserved.
      </footer>
    </div>
  );
}
