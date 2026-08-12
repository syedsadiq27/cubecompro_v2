import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIES } from './lib/session';

const publicPaths = ['/login', '/register', '/forgot-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIES.token)?.value;
  const projectId = request.cookies.get(SESSION_COOKIES.projectId)?.value;
  const forceLogin = request.nextUrl.searchParams.get('force') === '1';
  const isPublic = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (!token && !isPublic && pathname !== '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (
    token &&
    (pathname === '/' || pathname === '/login') &&
    !(pathname === '/login' && forceLogin)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = projectId ? `/${projectId}/dashboard` : '/projects';
    return NextResponse.redirect(url);
  }

  if (pathname === '/login' && forceLogin && token) {
    const response = NextResponse.next();
    for (const key of Object.values(SESSION_COOKIES)) {
      response.cookies.delete(key);
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
