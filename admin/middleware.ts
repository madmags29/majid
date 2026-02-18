import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('adminToken')?.value;
    const { pathname } = request.nextUrl;

    // 1. Allow public routes (currently only login)
    // pathname here is relative to basePath if basePath is matched
    if (pathname === '/login' || pathname.startsWith('/_next') || pathname.includes('favicon')) {
        return NextResponse.next();
    }

    // 2. Redirect to login if no token is found
    if (!token) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
