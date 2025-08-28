'use server';

import { auth } from '@/auth/next';
import { AUTH_CONFIG } from '@/constants/authConstants';
import { createKey } from '@/utils/create-key';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const session = await auth();
  
  if (!session?.user?.email) {
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

    const { userKey, refreshKey } = createKey(session.user.email);
    response.cookies.set(userKey, tempAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: AUTH_CONFIG.SESSION_MAX_AGE,
      sameSite: 'lax',
    });

    if (tempRefreshToken) {
      response.cookies.set(refreshKey, tempRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: AUTH_CONFIG.SESSION_MAX_AGE,
        sameSite: 'lax',
      });
    }

    response.cookies.delete('temp_calendar_access_token');
    response.cookies.delete('temp_calendar_refresh_token');

    return response;
  } catch (error) {
    console.error('Error storing calendar tokens:', error);
    return new NextResponse('Failed to store calendar tokens', { status: 500 });
  }
}
