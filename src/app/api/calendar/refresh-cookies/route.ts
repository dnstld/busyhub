'use server';

import { auth } from '@/auth/next';
import { AUTH_CONFIG } from '@/constants/auth-constants';
import { createKey } from '@/utils/create-key';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const cookieStore = await cookies();
    const { userKey, refreshKey } = createKey(session.user.email);
    
    const accessToken = cookieStore.get(userKey)?.value;
    const refreshToken = cookieStore.get(refreshKey)?.value;

    if (!accessToken) {
      return new NextResponse('No calendar token found', { status: 404 });
    }

    const response = NextResponse.json({ success: true });

    // Re-set the cookies with fresh expiration times
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

    return response;
  } catch (error) {
    console.error('Error refreshing calendar token cookies:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
