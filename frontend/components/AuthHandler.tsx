'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function AuthHandler() {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const token = searchParams.get('token');
        const userJson = searchParams.get('user');

        if (token && userJson) {
            try {
                const user = JSON.parse(decodeURIComponent(userJson));

                // Save to local storage
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));

                // Dispatch event to notify other components (like Header)
                window.dispatchEvent(new Event('storage'));

                // Toast success
                toast.success(`Welcome back, ${user.name}!`);

                // Clear query parameters from URL
                const newUrl = window.location.pathname;
                router.replace(newUrl);
            } catch (err) {
                console.error('Failed to parse user data from URL', err);
            }
        }
    }, [searchParams, router]);

    return null;
}
