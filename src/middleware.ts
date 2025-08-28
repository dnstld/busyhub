import { auth } from '@/auth/next';
import { AUTH_CONFIG } from '@/constants/authConstants';
import { createKey } from '@/utils/create-key';
import { NextResponse } from 'next/server';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  const isEvents = pathname.startsWith('/events');
  const isHome = pathname === '/';

  if (isHome && isLoggedIn) {
    return NextResponse.redirect(new URL('/events', req.url));
  }

  if (isEvents && !isLoggedIn) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (isEvents && isLoggedIn && req.auth?.user?.email) {
    const response = NextResponse.next();
    const { userKey, refreshKey } = createKey(req.auth.user.email);
    
    const accessToken = req.cookies.get(userKey)?.value;
    const refreshToken = req.cookies.get(refreshKey)?.value;

    if (accessToken) {
      response.cookies.set(userKey, accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: AUTH_CONFIG.SESSION_MAX_AGE,
        sameSite: 'lax',
      });
      
      if (refreshToken) {
        response.cookies.set(refreshKey, refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge: AUTH_CONFIG.SESSION_MAX_AGE,
          sameSite: 'lax',
        });
      }
    }
    
    return response;
  }

  return NextResponse.next();
});
