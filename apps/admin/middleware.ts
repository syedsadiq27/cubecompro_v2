import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIES } from './lib/session';

const publicPaths = ['/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIES.token)?.value;
  const isPublic = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (!token && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (token && (pathname === '/' || pathname === '/login')) {
    const url = request.nextUrl.clone();
    url.pathname = '/organizations';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
