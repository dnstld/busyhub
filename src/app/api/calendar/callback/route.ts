import { AUTH_CONFIG } from '@/constants/authConstants';
import { auth } from '@/lib/auth';
import { oauth2Client } from '@/lib/google';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new NextResponse('Missing code', { status: 400 });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const redirectUrl = new URL('/events', req.url);

    const response = NextResponse.redirect(redirectUrl);

    response.cookies.set('calendarAccessToken', tokens.access_token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: AUTH_CONFIG.SESSION_MAX_AGE,
      sameSite: 'lax',
    });

    return response;
  } catch (err) {
    console.error('OAuth callback error:', err);
    return new NextResponse('Authentication failed', { status: 500 });
  }
}
