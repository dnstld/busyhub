import { auth } from '@/auth/next';
import { createKey } from '@/utils/create-key';
import { cookies } from 'next/headers';

export async function getCalendarAccessToken() {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return null;
    }

    const cookieStore = await cookies();
    const { userKey, refreshKey } = createKey(session.user.email);
    
    const accessToken = cookieStore.get(userKey)?.value;
    const refreshToken = cookieStore.get(refreshKey)?.value;
    
    // If no access token but we have a refresh token, try to refresh
    if ((!accessToken || accessToken.trim().length === 0) && refreshToken) {
      try {
        const refreshedToken = await refreshCalendarToken(refreshToken);
        if (refreshedToken) {
          // Store the new token in a cookie (this requires an API call since we can't set cookies from server components)
          await fetch('/api/calendar/store-refreshed-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              accessToken: refreshedToken.access_token,
              refreshToken: refreshedToken.refresh_token || refreshToken,
              userEmail: session.user.email 
            }),
          });
          
          return refreshedToken.access_token;
        }
      } catch (error) {
        console.error('Failed to refresh calendar token:', error);
      }
    }
    
    if (!accessToken || accessToken.trim().length === 0) {
      return null;
    }
    
    return accessToken;
  } catch (error) {
    console.error('Error retrieving calendar access token:', error);
    return null;
  }
}

async function refreshCalendarToken(refreshToken: string) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
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

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Token refresh failed: ${error.error_description || error.error}`);
  }

  return await response.json();
}
