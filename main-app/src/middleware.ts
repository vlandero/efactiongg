import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function isLoggedIn(req: NextRequest): boolean {
    //   return Boolean(req.cookies.get('auth_token'));
    return true
}

export function middleware(req: NextRequest) {
    console.log('middleware is runnign');
    const { pathname } = req.nextUrl;

    // Allow the home page to be accessed by everyone
    if (pathname === '/') return NextResponse.next();

    // Redirect to home page if not logged in
    if (!isLoggedIn(req)) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
