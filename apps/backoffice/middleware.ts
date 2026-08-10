import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIES } from './lib/session';

const publicPaths = ['/login', '/register', '/forgot-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIES.token)?.value;
  const projectId = request.cookies.get(SESSION_COOKIES.projectId)?.value;
  const isPublic = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (!token && !isPublic && pathname !== '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (token && (pathname === '/' || pathname === '/login')) {
    const url = request.nextUrl.clone();
    url.pathname = projectId ? `/${projectId}/dashboard` : '/projects';
    return NextResponse.redirect(url);
  }

  const projectMatch = pathname.match(/^\/(\d+)(\/|$)/);
  if (projectMatch && token && !projectId) {
    const url = request.nextUrl.clone();
    url.pathname = '/projects';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
