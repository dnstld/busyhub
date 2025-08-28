'use server';

import { auth } from '@/auth/next';
import { AUTH_CONFIG } from '@/constants/auth-constants';
import { createKey } from '@/utils/create-key';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { accessToken, refreshToken, userEmail } = await request.json();

    if (!accessToken || !userEmail || userEmail !== session.user.email) {
      return new NextResponse('Invalid request', { status: 400 });
    }

    const response = NextResponse.json({ success: true });
    const { userKey, refreshKey } = createKey(userEmail);

    // Store the new access token
    response.cookies.set(userKey, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: AUTH_CONFIG.SESSION_MAX_AGE,
      sameSite: 'lax',
    });

    // Store the refresh token if provided
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
    console.error('Error storing refreshed calendar token:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
