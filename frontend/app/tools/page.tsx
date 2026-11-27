'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import InnerHeader from '@/components/InnerHeader';
import Breadcrumbs from '@/components/Breadcrumbs';
import { EXLPORE_DESTINATIONS, calculateDistance } from '@/lib/destinations';
import { getDestinationEditorialMeta } from '@/lib/destinationMetadata';
import { Calculator, Navigation, Compass, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DEPARTURE_HUBS = [
  { name: 'New Delhi, India', lat: 28.6139, lng: 77.2090, currency: 'INR', symbol: '₹' },
  { name: 'Mumbai, India', lat: 19.0760, lng: 72.8777, currency: 'INR', symbol: '₹' },
  { name: 'Bangalore, India', lat: 12.9716, lng: 77.5946, currency: 'INR', symbol: '₹' },
  { name: 'Hyderabad, India', lat: 17.3850, lng: 78.4867, currency: 'INR', symbol: '₹' },
  { name: 'Chennai, India', lat: 13.0827, lng: 80.2707, currency: 'INR', symbol: '₹' },
  { name: 'Kolkata, India', lat: 22.5726, lng: 88.3639, currency: 'INR', symbol: '₹' },
  { name: 'London, UK', lat: 51.5072, lng: -0.1276, currency: 'USD', symbol: '$' },
  { name: 'New York, USA', lat: 40.7128, lng: -74.0060, currency: 'USD', symbol: '$' },
  { name: 'Dubai, UAE', lat: 25.2048, lng: 55.2708, currency: 'USD', symbol: '$' },
  { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503, currency: 'USD', symbol: '$' },
];

export default function TravelToolsPage() {
  // Budget Calculator State
  const [travelers, setTravelers] = useState(2);
  const [nights, setNights] = useState(2);
  const [regionMode, setRegionMode] = useState<'INR' | 'USD'>('INR');
  const [stayTier, setStayTier] = useState<'budget' | 'moderate' | 'boutique'>('moderate');
  const [transportMode, setTransportMode] = useState<'car' | 'train' | 'flight'>('car');

  // Distance Estimator State
  const [originIndex, setOriginIndex] = useState(0);
  const [targetId, setTargetId] = useState('jaipur');

  const budgetBreakdown = useMemo(() => {
    const isInr = regionMode === 'INR';
    const stayPerNight = isInr
      ? { budget: 1600, moderate: 3800, boutique: 8500 }[stayTier]
      : { budget: 65, moderate: 145, boutique: 290 }[stayTier];
    const foodPerPersonDay = isInr
      ? { budget: 650, moderate: 1300, boutique: 2600 }[stayTier]
      : { budget: 25, moderate: 55, boutique: 110 }[stayTier];
    const activityPerPersonDay = isInr
      ? { budget: 400, moderate: 900, boutique: 1800 }[stayTier]
      : { budget: 15, moderate: 35, boutique: 75 }[stayTier];
    const transportPerPerson = isInr
      ? { car: 1800, train: 1400, flight: 6500 }[transportMode]
      : { car: 60, train: 95, flight: 260 }[transportMode];

    const roomsNeeded = Math.ceil(travelers / 2);
    const totalStay = stayPerNight * nights * roomsNeeded;
    const days = nights + 1;
    const totalFood = foodPerPersonDay * travelers * days;
    const totalActivities = activityPerPersonDay * travelers * days;
    const totalTransport = transportMode === 'car'
      ? transportPerPerson * Math.ceil(travelers / 4) * 1.5
      : transportPerPerson * travelers;

    const grandTotal = Math.round(totalStay + totalFood + totalActivities + totalTransport);
    const perPerson = Math.round(grandTotal / Math.max(1, travelers));
    const symbol = isInr ? '₹' : '$';

    return { symbol, totalStay, totalFood, totalActivities, totalTransport: Math.round(totalTransport), grandTotal, perPerson };
  }, [travelers, nights, regionMode, stayTier, transportMode]);

  const distanceResult = useMemo(() => {
    const origin = DEPARTURE_HUBS[originIndex];
    const target = EXLPORE_DESTINATIONS.find(d => d.id === targetId) || EXLPORE_DESTINATIONS[0];
    const straightKm = calculateDistance(origin.lat, origin.lng, target.lat, target.lng);
    // Road routes are typically ~1.22x straight-line distance for drivable routes
    const estRoadKm = Math.round(straightKm * 1.22);
    const estDriveHours = +(estRoadKm / 55).toFixed(1);
    const meta = getDestinationEditorialMeta(target);

    let recommendation = 'Flight Recommended';
    if (estRoadKm <= 350) recommendation = 'Ideal 2-Day Road / Rail Weekend';
    else if (estRoadKm <= 650) recommendation = 'Best for 3–4 Day Long Weekend or Overnight Train';

    return {
      origin,
      target,
      straightKm: Math.round(straightKm),
      estRoadKm,
      estDriveHours,
      recommendation,
      meta,
    };
  }, [originIndex, targetId]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <InnerHeader title="Travel Tools" subtitle="Calculators & Planners" showBack backHref="/" />
      <div className="max-w-6xl mx-auto w-full px-6 pt-6">
        <Breadcrumbs items={[{ label: 'Travel Tools', href: '/tools', active: true }]} />
      </div>

      <main className="max-w-6xl mx-auto w-full px-6 py-10 space-y-12">
        <header className="space-y-3 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
            Weekend Travel Planning Tools
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            Estimate realistic weekend trip budgets, check driving distances from major cities, and jump straight into tailored 2-to-4 day destination guides.
          </p>
        </header>

        {/* Honest Limitation Banner */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 text-sm text-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong>Planning Estimates Only:</strong> Budget figures and drive times below are heuristic planning models, not live hotel quotes, fuel prices, or real-time traffic feeds. Always confirm live rates before booking. See our{' '}
            <Link href="/disclaimer" className="underline text-white hover:text-amber-300">Travel Disclaimer</Link>.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Tool 1: Weekend Budget Calculator */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-blue-500/15 border border-blue-500/30">
                <Calculator className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Weekend Budget Estimator</h2>
                <p className="text-xs text-slate-400">Estimate stay, food, transit &amp; activities</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="budget-region" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Region / Currency
                </label>
                <select
                  id="budget-region"
                  value={regionMode}
                  onChange={(e) => setRegionMode(e.target.value as 'INR' | 'USD')}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white"
                >
                  <option value="INR">India (INR ₹)</option>
                  <option value="USD">International (USD $)</option>
                </select>
              </div>
              <div>
                <label htmlFor="budget-stay" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Comfort Tier
                </label>
                <select
                  id="budget-stay"
                  value={stayTier}
                  onChange={(e) => setStayTier(e.target.value as 'budget' | 'moderate' | 'boutique')}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white"
                >
                  <option value="budget">Budget / Hostel</option>
                  <option value="moderate">Moderate / 3-Star</option>
                  <option value="boutique">Boutique / Resort</option>
                </select>
              </div>
              <div>
                <label htmlFor="budget-travelers" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Travelers: {travelers}
                </label>
                <input
                  id="budget-travelers"
                  type="range"
                  min={1}
                  max={8}
                  value={travelers}
                  onChange={(e) => setTravelers(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>
              <div>
                <label htmlFor="budget-nights" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Nights: {nights} ({nights + 1} Days)
                </label>
                <input
                  id="budget-nights"
                  type="range"
                  min={1}
                  max={4}
                  value={nights}
                  onChange={(e) => setNights(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>
            </div>

            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Primary Transport</span>
              <div className="grid grid-cols-3 gap-2">
                {(['car', 'train', 'flight'] as const).map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setTransportMode(mode)}
                    className={`py-2 rounded-xl text-xs font-bold capitalize border transition-all cursor-pointer ${
                      transportMode === mode
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex justify-between items-baseline border-b border-slate-800 pb-3">
                <span className="text-sm text-slate-400">Estimated Total ({travelers} travelers)</span>
                <span className="text-3xl font-black text-white">
                  {budgetBreakdown.symbol}{budgetBreakdown.grandTotal.toLocaleString()}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                <div>Stay: <strong>{budgetBreakdown.symbol}{budgetBreakdown.totalStay.toLocaleString()}</strong></div>
                <div>Food: <strong>{budgetBreakdown.symbol}{budgetBreakdown.totalFood.toLocaleString()}</strong></div>
                <div>Transport: <strong>{budgetBreakdown.symbol}{budgetBreakdown.totalTransport.toLocaleString()}</strong></div>
                <div>Activities: <strong>{budgetBreakdown.symbol}{budgetBreakdown.totalActivities.toLocaleString()}</strong></div>
              </div>
              <div className="pt-2 text-xs text-blue-400 font-semibold">
                Approx. {budgetBreakdown.symbol}{budgetBreakdown.perPerson.toLocaleString()} per person
              </div>
            </div>
          </section>

          {/* Tool 2: Distance & Weekend Feasibility Calculator */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-purple-500/15 border border-purple-500/30">
                <Navigation className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Distance &amp; Feasibility Check</h2>
                <p className="text-xs text-slate-400">Check whether a destination fits a 2-day or 3-day break</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="dist-origin" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Starting City
                </label>
                <select
                  id="dist-origin"
                  value={originIndex}
                  onChange={(e) => setOriginIndex(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white"
                >
                  {DEPARTURE_HUBS.map((hub, idx) => (
                    <option key={hub.name} value={idx}>{hub.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="dist-target" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Destination
                </label>
                <select
                  id="dist-target"
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white"
                >
                  {EXLPORE_DESTINATIONS.map(dest => (
                    <option key={dest.id} value={dest.id}>{dest.name} ({dest.country})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-xs text-slate-400">Air Distance</div>
                  <div className="text-xl font-black text-white">{distanceResult.straightKm.toLocaleString()} km</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-xs text-slate-400">Est. Road</div>
                  <div className="text-xl font-black text-white">{distanceResult.estRoadKm.toLocaleString()} km</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-xs text-slate-400">Est. Drive</div>
                  <div className="text-xl font-black text-white">
                    {distanceResult.estRoadKm <= 900 ? `${distanceResult.estDriveHours} hrs` : 'Fly'}
                  </div>
                </div>
              </div>

              <div className="text-sm text-slate-300 space-y-1">
                <div><strong className="text-purple-400">Weekend Fit:</strong> {distanceResult.recommendation}</div>
                <div><strong className="text-slate-400">Best Season:</strong> {distanceResult.meta.bestTime}</div>
                <div><strong className="text-slate-400">Typical Daily Budget:</strong> {distanceResult.meta.dailyBudgetEstimate}</div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link href={`/explore/${distanceResult.target.id}`}>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold">
                    Read {distanceResult.target.name} Guide <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
                <Link href={`/search?destination=${encodeURIComponent(distanceResult.target.name)}&origin=${encodeURIComponent(distanceResult.origin.name)}`}>
                  <Button variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-800 rounded-xl text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5 mr-1 text-purple-400" /> Open in Trip Planner
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </div>

        {/* Additional Quick Links */}
        <section className="grid md:grid-cols-3 gap-6">
          <Link href="/search" className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-blue-500/50 transition-all group">
            <Compass className="w-6 h-6 text-blue-400 mb-3" />
            <h3 className="text-lg font-bold text-white group-hover:text-blue-400">Custom Trip Generator</h3>
            <p className="text-xs text-slate-400 mt-1">Build a day-by-day route with interactive map pins and weather forecast.</p>
          </Link>
          <Link href="/chat" className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-purple-500/50 transition-all group">
            <Sparkles className="w-6 h-6 text-purple-400 mb-3" />
            <h3 className="text-lg font-bold text-white group-hover:text-purple-400">Interactive Travel Assistant</h3>
            <p className="text-xs text-slate-400 mt-1">Ask follow-up questions to adjust pacing, family friendliness, or budget.</p>
          </Link>
          <Link href="/explore/all" className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-emerald-500/50 transition-all group">
            <Navigation className="w-6 h-6 text-emerald-400 mb-3" />
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-400">Filter All 68+ Destinations</h3>
            <p className="text-xs text-slate-400 mt-1">Filter destinations by region, budget tier, travel style, and suitability.</p>
          </Link>
        </section>
      </main>
    </div>
  );
}

