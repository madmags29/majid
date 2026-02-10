export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'http://localhost:3000');
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '419653061982-jobcsgpdmenhfhp4rr0jekf65oc3nr4l.apps.googleusercontent.com';
