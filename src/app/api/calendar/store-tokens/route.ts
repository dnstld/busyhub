'use server';

import { AUTH_CONFIG } from '@/constants/authConstants';
import { auth } from '@/lib/auth';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const cookieStore = await cookies();
  const tempAccessToken = cookieStore.get('temp_calendar_access_token')?.value;
  const tempRefreshToken = cookieStore.get('temp_calendar_refresh_token')?.value;

  if (!tempAccessToken) {
    return new NextResponse('No calendar access token found', { status: 400 });
  }

  try {
    const response = NextResponse.json({ success: true });

    const userSpecificKey = `calendar_token_${session.user.email?.replace(/[^a-zA-Z0-9]/g, '_')}`;
    
    response.cookies.set(userSpecificKey, tempAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: AUTH_CONFIG.SESSION_MAX_AGE,
      sameSite: 'lax',
    });

    if (tempRefreshToken) {
      response.cookies.set(`${userSpecificKey}_refresh`, tempRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: AUTH_CONFIG.SESSION_MAX_AGE,
        sameSite: 'lax',
      });
    }

    // Clean up temporary cookies
    response.cookies.delete('temp_calendar_access_token');
    response.cookies.delete('temp_calendar_refresh_token');

    return response;
  } catch (error) {
    console.error('Error storing calendar tokens:', error);
    return new NextResponse('Failed to store calendar tokens', { status: 500 });
  }
}
