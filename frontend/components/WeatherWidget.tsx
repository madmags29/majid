'use client';

import { useEffect, useState } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, Loader2, Thermometer } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WeatherWidgetProps {
    lat: number;
    lng: number;
    className?: string;
}

interface WeatherData {
    current_weather: {
        temperature: number;
        weathercode: number;
        windspeed: number;
    };
    daily?: {
        temperature_2m_max: number[];
        temperature_2m_min: number[];
    };
}

// WMO Weather interpretation codes (https://open-meteo.com/en/docs)
const getWeatherIcon = (code: number) => {
    if (code === 0 || code === 1) return <Sun className="w-5 h-5 text-yellow-400" />;
    if (code === 2 || code === 3) return <Cloud className="w-5 h-5 text-slate-400" />;
    if ([45, 48].includes(code)) return <Cloud className="w-5 h-5 text-slate-500" />; // Fog
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return <CloudRain className="w-5 h-5 text-blue-400" />;
    if ([71, 73, 75, 77, 85, 86].includes(code)) return <CloudSnow className="w-5 h-5 text-slate-200" />;
    return <Sun className="w-5 h-5 text-yellow-400" />;
};

const getWeatherDesc = (code: number) => {
    if (code === 0) return 'Clear';
    if (code === 1) return 'Mainly Clear';
    if (code === 2) return 'Partly Cloudy';
    if (code === 3) return 'Overcast';
    if (code >= 51 && code <= 67) return 'Rainy';
    if (code >= 71 && code <= 77) return 'Snowy';
    return 'Clear';
};

export default function WeatherWidget({ lat, lng, className }: WeatherWidgetProps) {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!lat || !lng) return;

        const fetchWeather = async () => {
            try {
                setLoading(true);
                const { API_URL } = await import('@/lib/config');
                const res = await fetch(`${API_URL}/api/weather?lat=${lat}&lng=${lng}`);
                if (!res.ok) throw new Error('Failed to fetch weather');
                const data = await res.json();
                setWeather(data);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, [lat, lng]);

    if (error) return null; // Hide if error

    if (loading) {
        return (
            <div className={cn("bg-slate-800/50 p-2 rounded-lg border border-slate-700 flex items-center justify-center h-16", className)}>
                <Loader2 className="w-4 h-4 text-slate-500 animate-spin" />
            </div>
        );
    }

    if (!weather) return null;

    const current = weather.current_weather;
    const tempMax = weather.daily?.temperature_2m_max?.[0];
    const tempMin = weather.daily?.temperature_2m_min?.[0];

    return (
        <div className={cn("bg-slate-800/50 p-3 rounded-lg border border-slate-700 relative group", className)}>
            <div className="flex items-center justify-between mb-1">
                <div className="text-xs text-slate-400 uppercase tracking-wider">Current Weather</div>
                <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" className="text-[9px] text-slate-600 hover:text-slate-400 no-underline">
                    open-meteo.com
                </a>
            </div>

            <div className="flex items-center flex-wrap gap-2 sm:gap-3">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-[120px]">
                    <div className="bg-slate-900/50 p-2 rounded-full border border-slate-700/50 shrink-0">
                        {getWeatherIcon(current.weathercode)}
                    </div>
                    <div>
                        <div className="text-xl font-bold text-slate-200 flex items-center">
                            {Math.round(current.temperature)}°C
                        </div>
                        <div className="text-xs text-slate-400 font-medium">
                            {getWeatherDesc(current.weathercode)}
                        </div>
                    </div>
                </div>

                {(tempMax !== undefined && tempMin !== undefined) && (
                    <div className="flex flex-row sm:flex-col items-center sm:items-end text-xs text-slate-500 border-t sm:border-t-0 sm:border-l border-slate-700/50 pt-2 sm:pt-0 sm:pl-3 w-full sm:w-auto gap-4 sm:gap-0">
                        <div className="flex items-center gap-1">
                            <Thermometer className="w-3 h-3 text-red-400" />
                            <span className="text-slate-400">H: {Math.round(tempMax)}°</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Thermometer className="w-3 h-3 text-blue-400" />
                            <span className="text-slate-400">L: {Math.round(tempMin)}°</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
