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
    
    const refreshToken = cookieStore.get(refreshKey)?.value;

    if (!refreshToken) {
      return new NextResponse('No refresh token found', { status: 404 });
    }

    // Refresh the token using Google OAuth
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.AUTH_GOOGLE_ID!,
        client_secret: process.env.AUTH_GOOGLE_SECRET!,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json();
      console.error('Token refresh failed:', error);
      return new NextResponse('Token refresh failed', { status: 400 });
    }

    const tokens = await tokenResponse.json();
    const response = NextResponse.json({ success: true });

    // Store the new access token
    response.cookies.set(userSpecificKey, tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: AUTH_CONFIG.SESSION_MAX_AGE,
      sameSite: 'lax',
    });

    // Update refresh token if a new one was provided
    if (tokens.refresh_token) {
      response.cookies.set(refreshKey, tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: AUTH_CONFIG.SESSION_MAX_AGE,
        sameSite: 'lax',
      });
    }

    return response;
  } catch (error) {
    console.error('Error refreshing calendar tokens:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
