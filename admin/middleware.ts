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

    // 2. Rewrite to login if no token is found
    if (!token) {
        if (pathname === '/') {
            return NextResponse.rewrite(new URL('/login', request.url));
        }
        // For other protected paths, we might still want to redirect or rewrite
        // Let's redirect them to root, which will render login
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
