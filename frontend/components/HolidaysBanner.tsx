'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Sparkles, MapPin, ArrowRight, Compass } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { INDIA_HOLIDAYS, WORLD_HOLIDAYS, HolidayItem } from '@/lib/holidays';

export default function HolidaysBanner() {
  const [activeTab, setActiveTab] = useState<'all' | 'india' | 'world'>('india');
  const router = useRouter();

  const now = new Date();
  const getFilteredHolidays = () => {
    let source: HolidayItem[] = [];
    if (activeTab === 'india') source = INDIA_HOLIDAYS;
    else if (activeTab === 'world') source = WORLD_HOLIDAYS;
    else source = [...INDIA_HOLIDAYS, ...WORLD_HOLIDAYS].sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    return source.filter((h) => new Date(h.endDate) >= now).slice(0, 6);
  };

  const holidays = getFilteredHolidays();

  const handlePlanHoliday = (holiday: HolidayItem) => {
    router.push(
      `/search?destination=${encodeURIComponent(holiday.searchQuery)}&start=${holiday.startDate}&end=${holiday.endDate}`
    );
  };

  const handleDestinationClick = (e: React.MouseEvent, dest: string) => {
    e.stopPropagation();
    router.push(`/search?destination=${encodeURIComponent(dest)}`);
  };

  const formatDateDisplay = (startStr: string, endStr: string) => {
    const start = new Date(startStr);
    const end = new Date(endStr);
    const startFormatted = start.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    const endFormatted = end.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    return `${startFormatted} – ${endFormatted}`;
  };

  return (
    <div className="w-full mt-16 max-w-6xl mx-auto px-4 z-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 text-left">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>2026 – 2027 Holiday & Long Weekend Calendar</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            Upcoming Holidays & Long Weekends
            <Sparkles className="w-5 h-5 text-amber-400" />
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Turn public holidays into scenic 3 to 5-day micro-vacations with zero leave stress.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/10 shrink-0 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('india')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'india'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🇮🇳</span> India (12)
          </button>
          <button
            onClick={() => setActiveTab('world')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'world'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🌍</span> World & Global (14)
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>
        </div>
      </div>

      {/* Holiday Cards Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {holidays.map((item) => (
            <div
              key={item.id}
              onClick={() => handlePlanHoliday(item)}
              className="group relative bg-slate-900/50 hover:bg-slate-900/80 backdrop-blur-md border border-white/10 hover:border-blue-500/50 rounded-3xl p-6 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col justify-between cursor-pointer text-left"
            >
              <div>
                {/* Header row: Days tag + Dates */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{item.flag}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${item.badgeColor}`}>
                      {item.days} Days Break
                    </span>
                  </div>
                  <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-blue-400" />
                    {formatDateDisplay(item.startDate, item.endDate)}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1 mb-1.5">
                  {item.title}
                </h3>

                {/* Country/Category subtitle */}
                <div className="text-xs font-semibold text-slate-400 mb-3 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-blue-400" />
                  <span>{item.country}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-amber-400/90">{item.tag}</span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300/90 leading-relaxed mb-4 line-clamp-2">
                  {item.description}
                </p>
              </div>

              {/* Bottom recommendations & Action */}
              <div className="pt-3 border-t border-white/5 flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 mr-1 flex items-center gap-0.5">
                    <MapPin className="w-3 h-3" /> Top:
                  </span>
                  {item.recommendedDestinations.map((dest) => (
                    <button
                      key={dest}
                      onClick={(e) => handleDestinationClick(e, dest)}
                      className="px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-white/5 hover:bg-blue-500/20 text-slate-300 hover:text-blue-300 border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer"
                    >
                      {dest}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-blue-400 group-hover:text-blue-300 pt-1">
                  <span>Plan this getaway</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

