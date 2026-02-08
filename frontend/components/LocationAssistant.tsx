'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Info } from 'lucide-react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface LocationAssistantProps {
    onLocationFound: (location: string, coords?: { lat: number, lng: number }) => void;
}

const LocationAssistant: React.FC<LocationAssistantProps> = ({ onLocationFound }) => {
    const [status, setStatus] = useState<'idle' | 'prompting' | 'loading' | 'success' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const cached = localStorage.getItem('user_precise_location');
        if (cached) {
            const { name, coords, timestamp } = JSON.parse(cached);
            // Cache for 2 hours
            if (Date.now() - timestamp < 7200000) {
                onLocationFound(name, coords);
                setStatus('success');
                return;
            }
        }

        // Show primer after a short delay
        const timer = setTimeout(() => {
            if (status !== 'success') {
                setIsVisible(true);
            }
        }, 3000);
        return () => clearTimeout(timer);
    }, [onLocationFound, status]);

    const getPreciseLocation = () => {
        setStatus('loading');
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setStatus('error');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    // Reverse geocode to get city name
                    const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
                    const data = await res.json();
                    const city = data.city || data.locality || 'Nearby';
                    const country = data.countryName || '';
                    const fullLocation = country ? `${city}, ${country}` : city;

                    setStatus('success');
                    setIsVisible(false);
                    onLocationFound(fullLocation, { lat: latitude, lng: longitude });

                    // Store in localStorage
                    localStorage.setItem('user_precise_location', JSON.stringify({
                        name: fullLocation,
                        coords: { lat: latitude, lng: longitude },
                        timestamp: Date.now()
                    }));
                } catch (err) {
                    console.error('Reverse geocode error:', err);
                    onLocationFound(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`, { lat: latitude, lng: longitude });
                    setStatus('success');
                    setIsVisible(false);
                }
            },
            (err) => {
                console.warn('Geolocation error:', err);
                let msg = 'Location access denied';
                if (err.code === 1) msg = 'Location permission denied';
                else if (err.code === 2) msg = 'Location unavailable';
                else if (err.code === 3) msg = 'Location request timed out';

                setError(msg);
                setStatus('error');
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    if (status === 'success' || !isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4"
            >
                <div className="bg-slate-900/95 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t-white/10 flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl shadow-lg shadow-blue-500/20 text-white">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-white">Find trips near you?</h4>
                            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">We'll show you the best weekend getaways from your exact location.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                        <Button
                            onClick={getPreciseLocation}
                            size="sm"
                            disabled={status === 'loading'}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs h-9 rounded-xl shadow-lg border-0"
                        >
                            {status === 'loading' ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    Locating...
                                </span>
                            ) : 'Allow Access'}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsVisible(false)}
                            className="text-slate-400 hover:text-white hover:bg-white/5 text-xs h-9 px-4 rounded-xl"
                        >
                            Not now
                        </Button>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="flex items-start gap-2 text-red-400 text-[10px] bg-red-950/20 p-2 rounded-lg border border-red-900/20"
                        >
                            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <span>{error}. Please check your browser or system location settings.</span>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default LocationAssistant;
