import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  const isEvents = pathname.startsWith('/events');
  const isHome = pathname === '/';

  if (isHome) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/events', req.url));
    } else {
      return NextResponse.next();
    }
  }

  if (isEvents && !isLoggedIn) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
});
