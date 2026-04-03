export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
export const SITE_URL = 'https://weekendtravellers.com';

// Helpful for skipping background tasks/fetches during the Next.js build phase
export const IS_BUILD = process.env.NEXT_PHASE === 'phase-production-build';

const getGoogleClientId = () => {
    const envId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!envId) {
        console.warn('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not defined, using fallback. This may cause authentication issues in production.');
    }
    return envId || '419653061982-jobcsgpdmenhfhp4rr0jekf65oc3nr4l.apps.googleusercontent.com';
};

export const GOOGLE_CLIENT_ID = getGoogleClientId();
export const SUPPORT_EMAIL = 'trip@weekendtravellers.com';
