'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AuthModal from '@/components/AuthModal';

interface ExploreItineraryButtonProps {
    destinationName: string;
}

export default function ExploreItineraryButton({ destinationName }: ExploreItineraryButtonProps) {
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            setIsLoggedIn(!!token);
        };

        checkAuth();
        window.addEventListener('storage', checkAuth);
        return () => window.removeEventListener('storage', checkAuth);
    }, []);

    const handleClick = () => {
        if (isLoggedIn) {
            router.push(`/search?destination=${encodeURIComponent(destinationName)}`);
        } else {
            setIsAuthOpen(true);
        }
    };

    return (
        <>
            <AuthModal
                isOpen={isAuthOpen}
                onClose={() => setIsAuthOpen(false)}
                initialMode="login"
            />
            <button
                onClick={handleClick}
                className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl shadow-blue-900/40 hover:scale-105 active:scale-95 cursor-pointer"
            >
                <Search className="w-5 h-5 text-blue-200" />
                Generate Custom Itinerary
            </button>
        </>
    );
}
