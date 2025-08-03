import { AUTH_CONFIG } from '@/constants/authConstants';
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
    }
  }

  if (isEvents && !isLoggedIn) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // If user is accessing /events and is logged in, refresh calendar cookies
  if (isEvents && isLoggedIn && req.auth?.user?.email) {
    const response = NextResponse.next();
    const userSpecificKey = `calendar_token_${req.auth.user.email.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const refreshKey = `${userSpecificKey}_refresh`;
    
    const accessToken = req.cookies.get(userSpecificKey)?.value;
    const refreshToken = req.cookies.get(refreshKey)?.value;
    
    if (accessToken) {
      response.cookies.set(userSpecificKey, accessToken, {
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
