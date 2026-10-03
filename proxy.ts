import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const encodedKey = new TextEncoder().encode(process.env.SESSION_SECRET);

const protectedPaths = ['/dashboard'];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Handle login page — redirect logged-in users away
    if (pathname.startsWith('/login')) {
        const session = request.cookies.get('session')?.value;
        if (session) {
            try {
                await jwtVerify(session, encodedKey, {
                    algorithms: ['HS256'],
                });
                return NextResponse.redirect(
                    new URL('/dashboard', request.url)
                );
            } catch {
                // Invalid session, let them see login
            }
        }
        return NextResponse.next();
    }

    // Only protect specific paths
    const isProtected = protectedPaths.some((path) =>
        pathname.startsWith(path)
    );
    if (!isProtected) {
        return NextResponse.next();
    }

    // Check session for protected routes
    const session = request.cookies.get('session')?.value;

    if (!session) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        await jwtVerify(session, encodedKey, { algorithms: ['HS256'] });
        return NextResponse.next();
    } catch {
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
