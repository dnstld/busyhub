import { oauth2Client } from '@/lib/google';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new NextResponse('Missing code', { status: 400 });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Store the calendar tokens temporarily in cookies to be picked up by the JWT callback
    const cookieStore = await cookies();
    cookieStore.set('temp_calendar_access_token', tokens.access_token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 300,
      sameSite: 'lax',
    });

    if (tokens.refresh_token) {
      cookieStore.set('temp_calendar_refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 300,
        sameSite: 'lax',
      });
    }

    const redirectUrl = new URL('/auth/calendar-success', req.url);
    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    console.error('OAuth callback error:', err);
    return new NextResponse('Authentication failed', { status: 500 });
  }
}
