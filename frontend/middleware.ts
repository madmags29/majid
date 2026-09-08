import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname, search } = request.nextUrl;

    // Check if the request is for the admin section
    if (pathname === '/admin' || pathname === '/admin/') {
        return NextResponse.redirect(new URL(`https://admin.weekendtravellers.com${search}`));
    }

    if (pathname.startsWith('/admin/')) {
        const subPath = pathname.replace(/^\/admin/, '');
        return NextResponse.redirect(new URL(`https://admin.weekendtravellers.com${subPath}${search}`));
    }

    return NextResponse.next();
}

export const config = {
    // Match /admin and /admin/*
    matcher: ['/admin', '/admin/:path*'],
};

