import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if the request is for the admin section
    if (pathname.startsWith('/admin')) {
        const token = request.cookies.get('adminToken')?.value;
        const isLoginPage = pathname === '/admin/login';

        // 1. If trying to access admin pages (except login) without a token, redirect to login
        if (!token && !isLoginPage) {
            const url = request.nextUrl.clone();
            url.pathname = '/admin/login';
            return NextResponse.redirect(url);
        }

        // 2. If trying to access login page WITH a token, redirect to admin dashboard
        if (token && isLoginPage) {
            const url = request.nextUrl.clone();
            url.pathname = '/admin'; // Redirect to dashboard
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    // Match /admin/* including nested routes, but exclude static assets
    matcher: ['/admin/:path*'],
};
