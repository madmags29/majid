"use client";

import { useState, useEffect } from 'react';
import {
  Users, Activity, Brain, BarChart3,
  TrendingUp, DollarSign, Clock, MousePointer2
} from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import api from '@/lib/api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';

export default function OverviewPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/stats/overview');
        setStats(res.data.data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Placeholder data for charts
  const dauData = [
    { name: 'Feb 12', value: 400 },
    { name: 'Feb 13', value: 300 },
    { name: 'Feb 14', value: 600 },
    { name: 'Feb 15', value: 800 },
    { name: 'Feb 16', value: 500 },
    { name: 'Feb 17', value: 900 },
    { name: 'Feb 18', value: 1200 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard Overview</h1>
        <p className="text-zinc-400">Real-time performance metrics and user engagement.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={stats?.users?.total || 0}
          icon={Users}
          subtext="All registered travellers"
          loading={loading}
        />
        <StatsCard
          title="Active Users"
          value={stats?.users?.activeNow || 0}
          icon={Activity}
          subtext="Online in last 5 mins"
          trend={{ value: 12, isPositive: true }}
          loading={loading}
        />
        <StatsCard
          title="AI Trip Searches"
          value={stats?.ai?.totalSearches30d || 0}
          icon={Brain}
          subtext="Last 30 days"
          loading={loading}
        />
        <StatsCard
          title="Revenue (30d)"
          value={`$${stats?.revenue?.total30d || 0}`}
          icon={DollarSign}
          subtext="Affiliate & Ad earnings"
          trend={{ value: 8.2, isPositive: true }}
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Activity Chart */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold">Daily Active Users</h3>
            <div className="flex gap-2">
              <div className="px-3 py-1 bg-zinc-800 rounded-md text-xs text-zinc-400">30 Days</div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dauData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
            <h3 className="font-bold mb-4">Engagement</h3>
            <div className="space-y-4">
              <SmallStat label="Conversion Rate" value="3.2%" icon={TrendingUp} color="text-blue-400" />
              <SmallStat label="Bounce Rate" value="42%" icon={MousePointer2} color="text-rose-400" />
              <SmallStat label="Avg. Session" value="4m 12s" icon={Clock} color="text-emerald-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SmallStat({ label, value, icon: Icon, color }: { label: string, value: string, icon: any, color: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={cn("p-1.5 bg-zinc-800 rounded-lg", color)}>
          <Icon size={14} />
        </div>
        <span className="text-sm text-zinc-400">{label}</span>
      </div>
      <span className="font-bold">{value}</span>
    </div>
  );
}

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
