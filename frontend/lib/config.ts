export const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'http://localhost:3000');
const getGoogleClientId = () => {
    const envId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!envId) {
        console.warn('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not defined, using fallback. This may cause authentication issues in production.');
    }
    return envId || '419653061982-jobcsgpdmenhfhp4rr0jekf65oc3nr4l.apps.googleusercontent.com';
};

export const GOOGLE_CLIENT_ID = getGoogleClientId();
export const SUPPORT_EMAIL = 'trip@weekendtravellers.com';
