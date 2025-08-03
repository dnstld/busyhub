'use server';

import { AUTH_CONFIG } from '@/constants/authConstants';
import { auth } from '@/lib/auth';
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
    const userSpecificKey = `calendar_token_${userEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const refreshKey = `${userSpecificKey}_refresh`;

    // Store the new access token
    response.cookies.set(userSpecificKey, accessToken, {
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
