'use server';

import { AUTH_CONFIG } from '@/constants/authConstants';
import { auth } from '@/lib/auth';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const cookieStore = await cookies();
    const userSpecificKey = `calendar_token_${session.user.email.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const refreshKey = `${userSpecificKey}_refresh`;
    
    const accessToken = cookieStore.get(userSpecificKey)?.value;
    const refreshToken = cookieStore.get(refreshKey)?.value;

    if (!accessToken) {
      return new NextResponse('No calendar token found', { status: 404 });
    }

    const response = NextResponse.json({ success: true });

    // Re-set the cookies with fresh expiration times
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

    return response;
  } catch (error) {
    console.error('Error refreshing calendar token cookies:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
