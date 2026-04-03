'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import AnimatedLogo from '@/components/AnimatedLogo';
import TypewriterText from '@/components/TypewriterText';
import DateRangePicker from '@/components/DateRangePicker';
import { format } from 'date-fns';
import { EXLPORE_DESTINATIONS } from '@/lib/destinations';
import { API_URL } from '@/lib/config';
import CinematicLoader from '@/components/CinematicLoader';

const AuthModal = dynamic(() => import('@/components/AuthModal'));
const CategoryBanner = dynamic(() => import('@/components/CategoryBanner'));
const VisitorCounter = dynamic(() => import('@/components/VisitorCounter'), { ssr: false });
const FloatingDestinations = dynamic(() => import('@/components/FloatingDestinations'), { ssr: false });
const LocationAssistant = dynamic(() => import('@/components/LocationAssistant'), { ssr: false });
const RightMenu = dynamic(() => import('@/components/RightMenu'));

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function HomeClient({ initialBlogPosts }: { initialBlogPosts: any[] }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoCredit, setVideoCredit] = useState<{ name: string, url: string } | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState<string>('');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [user, setUser] = useState<{ name: string, email: string } | null>(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

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
    try {
      const res = await fetch(`/api/suggestions?location=${encodeURIComponent(location)}`);
      if (!res.ok) throw new Error('Failed to fetch suggestions');
      const data = await res.json();
      const parsedSuggestions = data.map((item: string | { name: string }) => typeof item === 'string' ? item : item.name);
      setSuggestions(parsedSuggestions);
    } catch (err) {
      console.error('Failed to load suggestions', err);
      setSuggestions(prev => prev.length > 0 ? prev : ['Paris', 'Tokyo', 'Bali', 'New York', 'Santorini']);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, []);

  const handleLocationFound = useCallback((location: string) => {
    setUserLocation(prev => prev === location ? prev : location);
  }, []);

  useEffect(() => {
    fetch(`/api/background-video`)
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

    if (!userLocation) {
      fetch('https://ipapi.co/json/')
        .then(async res => {
            if (!res.ok) throw new Error('ipapi rate limit or error');
            return res.json();
        })
        .then(data => {
          const location = data.city ? `${data.city}, ${data.country_name}` : data.country_name || 'Global';
          setUserLocation(prev => prev || location);
        })
        .catch(err => {
          console.warn("Geolocation failed on Home:", err);
          if (!userLocation) {
             setUserLocation('Global'); // Trigger suggestion fetch with 'Global'
          }
        });
    }
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchDynamicSuggestions(userLocation);
    }
  }, [userLocation, fetchDynamicSuggestions]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    const originParam = userLocation ? `&origin=${encodeURIComponent(userLocation)}` : '';
    const startParam = startDate ? `&startDate=${format(startDate, 'yyyy-MM-dd')}` : '';
    const endParam = endDate ? `&endDate=${format(endDate, 'yyyy-MM-dd')}` : '';
    router.push(`/search?destination=${encodeURIComponent(searchQuery)}${originParam}${startParam}${endParam}`);
  };

  const handleSuggestionClick = (suggestion: string) => {
    const originParam = userLocation ? `&origin=${encodeURIComponent(userLocation)}` : '';
    const startParam = startDate ? `&startDate=${format(startDate, 'yyyy-MM-dd')}` : '';
    const endParam = endDate ? `&endDate=${format(endDate, 'yyyy-MM-dd')}` : '';
    router.push(`/search?destination=${encodeURIComponent(suggestion)}${originParam}${startParam}${endParam}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.dispatchEvent(new Event('storage'));
  };

  useEffect(() => {
    const delay = window.innerWidth < 768 ? 800 : 2500;
    const timer = setTimeout(() => setIsLoading(false), delay);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} initialMode={authMode} />
      <AnimatePresence mode="wait">
        {isLoading && <CinematicLoader key="loader" />}
      </AnimatePresence>

      <div className="fixed inset-0 bg-[#0f172a] -z-30" />

      {videoUrl && (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isVideoReady ? 1 : 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 w-full h-full -z-10 will-change-transform"
        >
            <div className="absolute inset-0 bg-black/80 z-10" />
            <video
                autoPlay
                loop
                muted
                playsInline
                onLoadedData={() => setIsVideoReady(true)}
                className="w-full h-full object-cover"
                poster="/video-poster.png"
                title="Destination background"
            >
                <source src={videoUrl} type="video/mp4" />
            </video>
            {videoCredit && (
                <div className="absolute bottom-4 right-4 z-20 text-[10px] text-slate-400 bg-black/40 px-2 py-1 rounded backdrop-blur-sm pointer-events-auto">
                    Video by <a href={videoCredit.url} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-blue-400 underline decoration-dashed">{videoCredit.name}</a> on Pexels
                </div>
            )}
        </motion.div>
      )}

      <FloatingDestinations />
      <LocationAssistant onLocationFound={handleLocationFound} />

      <header className="w-full py-4 px-6 flex justify-between items-center z-50">
        <div className="flex items-center gap-2">
          <RightMenu />
          <Link href="/" className="flex items-center gap-2 hover:opacity-100 group/logo transition-all">
            <AnimatedLogo className="w-8 h-8 md:w-10 md:h-10 text-blue-400 group-hover/logo:scale-110 transition-transform" />
            <div className="text-2xl md:text-3xl text-white drop-shadow-md font-cursive group-hover/logo:text-blue-400 transition-colors">
              weekendtravellers.com
            </div>
          </Link>
        </div>
        <nav className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-slate-800/50 border border-slate-700/50 hover:bg-blue-500/10 hover:border-blue-500/50 transition-all">
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
                <DropdownMenuItem asChild className="focus:bg-slate-800 focus:text-white cursor-pointer"><Link href="/profile">My Profile</Link></DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-slate-800 focus:text-white cursor-pointer"><Link href="/trips">My Trips</Link></DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-800" />
                <DropdownMenuItem onClick={handleLogout} className="text-red-400 focus:text-red-300 cursor-pointer">Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link href="/blog" className="text-slate-200 hover:text-blue-400 px-4 py-2 rounded-lg font-medium text-sm transition-colors">Blog</Link>
              <Button onClick={() => {setAuthMode('login'); setIsAuthOpen(true);}} variant="ghost" className="text-slate-200">Login</Button>
              <Button onClick={() => {setAuthMode('signup'); setIsAuthOpen(true);}} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl px-6">Sign Up</Button>
            </div>
          )}
        </nav>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center px-4 py-20 pb-32 relative z-30">
        <div className="text-center max-w-4xl z-10 w-full">
          <div className="flex justify-center mb-6 min-h-[40px]">
            <VisitorCounter />
          </div>
          <h1 className="text-3xl md:text-7xl font-extrabold text-white tracking-tight mb-6 drop-shadow-2xl">
            Discover Your Perfect <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200">Weekend Getaway</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-100 mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-md font-medium">
            Just tell us where you want to go, or let us surprise you.
          </p>

          <div className="relative w-full max-w-3xl mx-auto p-[1px] rounded-2xl z-50">
            <form onSubmit={handleSearch} className="relative w-full glass-panel p-3 rounded-2xl flex flex-col md:flex-row gap-3 border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
              <label className="relative flex-[2] flex items-center px-4 py-3 glass-input rounded-xl cursor-text" htmlFor="destination-input">
                <MapPin className="w-5 h-5 text-slate-300 mr-3 shrink-0" />
                <input
                  id="destination-input"
                  type="text"
                  autoComplete="off"
                  placeholder="Where to? (e.g. Paris)"
                  className="bg-transparent w-full outline-none text-white placeholder:text-slate-400 font-medium text-base"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setShowAutocomplete(true); }}
                  onFocus={() => setShowAutocomplete(true)}
                  onBlur={() => setTimeout(() => setShowAutocomplete(false), 200)}
                />
                {searchQuery.length >= 3 && showAutocomplete && (
                  <div className="absolute top-[110%] left-0 right-0 mt-1 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-[100] max-h-60 overflow-y-auto">
                    {EXLPORE_DESTINATIONS.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.country.toLowerCase().includes(searchQuery.toLowerCase())).map(place => (
                      <div key={place.id} className="px-4 py-3 hover:bg-blue-500/10 cursor-pointer flex items-center gap-3 transition-colors text-left border-b border-white/5 last:border-0" onClick={() => { setSearchQuery(place.name); setShowAutocomplete(false); }}>
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                        <div>
                          <div className="text-white font-medium text-sm">{place.name}</div>
                          <div className="text-slate-400 text-[10px]">{place.country}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </label>

              <DateRangePicker
                className="flex-1"
                initialStart={startDate}
                initialEnd={endDate}
                onRangeSelect={(start, end) => { setStartDate(start); setEndDate(end); }}
              />

              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl px-8 py-3 h-auto text-lg shadow-lg">
                <Search className="w-5 h-5 mr-2" /> Search
              </Button>
            </form>
          </div>

          <div className="min-h-[100px] mt-8">
            <div className="flex flex-wrap justify-center gap-3">
              <span className="text-slate-300 text-sm font-medium mr-2 self-center">
                {isLoadingSuggestions ? 'Finding best trips for you...' : (userLocation ? `Popular in ${userLocation}:` : 'Trending:')}
              </span>
              {isLoadingSuggestions ? (
                <div className="flex gap-2">
                  {[1, 2, 3].map(i => <div key={i} className="h-8 w-24 bg-white/10 rounded-full animate-pulse" />)}
                </div>
              ) : (
                <div className="flex flex-wrap justify-center gap-3">
                  {suggestions.slice(0, 5).map((suggestion) => (
                    <button key={suggestion} onClick={() => handleSuggestionClick(suggestion)} className="px-6 py-2.5 rounded-2xl bg-slate-900/30 backdrop-blur-md border border-white/5 hover:border-blue-500/50 hover:bg-blue-500/10 text-slate-300 hover:text-blue-300 transition-all text-sm font-medium">
                      {suggestion}
                    </button>
                  ))}
                  <Link href="/explore/all" className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm flex items-center gap-2">
                    More Weekend Destinations <MapPin size={14} />
                  </Link>
                </div>
              )}
            </div>
          </div>
          <CategoryBanner userLocation={userLocation} />

          {/* AdSense Optimization: High-Value Content Section */}
          <div className="mt-32 text-left bg-slate-900/40 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden max-w-5xl mx-auto">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight flex items-center gap-3">
                <span className="w-8 h-1 bg-blue-500 rounded-full"></span>
                How Our AI Travel Engine Works
              </h2>
              <div className="space-y-6 text-slate-300 leading-relaxed text-lg">
                <p>
                  Planning a vacation should be the start of your relaxation, not an administrative chore. At <strong>Weekend Travellers</strong>, our proprietary AI itinerary generator revolutionizes short-term travel by transforming the chaotic web of flight schedules, hotel availability, and local attraction reviews into a single, cohesive weekend plan in under sixty seconds.
                </p>
                <div className="grid md:grid-cols-2 gap-8 my-8">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-blue-400">1. Data Aggregation & Contextualization</h3>
                    <p className="text-sm">
                        While traditional travel agencies rely on static databases, our machine learning models constantly analyze millions of data points across global events, local weather patterns, transit delays, and real-time crowd densities. This ensures that every 48-hour or 72-hour micro-vacation we recommend is structurally sound and seasonally appropriate.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-purple-400">2. The &ldquo;Micro-Vacation&rdquo; Philosophy</h3>
                    <p className="text-sm">
                        As remote work and digital nomadism blur the lines between leisure and labor, the concept of the two-week annual holiday is becoming obsolete. We specialize exclusively in the <em>Weekend Getaway</em> methodology. By minimizing transit times and maximizing high-impact cultural experiences, we help travelers reset their mental health without draining their PTO reserves.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-pink-400">3. Algorithmic Personalization</h3>
                    <p className="text-sm">
                        No two travelers are identical. Whether you are a solo backpacker searching for underground speakeasies in Tokyo or a family needing stroller-friendly paths in Rome, our generative AI scales its recommendations dynamically. The tool cross-references your inputted preferences against verified, hyper-local editorial content rather than generic tourist traps.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-indigo-400">4. Commitment to Sustainability</h3>
                    <p className="text-sm">
                        Overtourism is a critical issue in 2026. Therefore, our engine actively penalizes overcrowded districts in favor of sustainable, secondary markets. By distributing tourist density and promoting verified eco-friendly vendors, Weekend Travellers acts not just as a planner, but as a responsible steward of global communities.
                    </p>
                  </div>
                </div>
                <p>
                  By synthesizing this vast logistical complexity into actionable, readable itineraries, we bridge the gap between spontaneous wanderlust and organized execution. Stop spending hours juggling browser tabs and navigating conflicting TripAdvisor reviews. Welcome to the future of the smart weekend getaway. Explore responsibly, travel smartly, and make every hour of your weekend count.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
