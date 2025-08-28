import { AUTH_CONFIG } from '@/constants/auth-constants';
import { JWT } from 'next-auth/jwt';

export function isTokenExpired(tokenExpiresAt?: number): boolean {
  if (!tokenExpiresAt || tokenExpiresAt <= 0) {
    return true;
  }
  return tokenExpiresAt <= Date.now() + AUTH_CONFIG.TOKEN_REFRESH_BUFFER;
}

export async function refreshAccessToken(token: JWT): Promise<JWT> {
  if (!token.refreshToken) {
    console.error('No refresh token available');
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }

  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        client_id: process.env.AUTH_GOOGLE_ID!,
        client_secret: process.env.AUTH_GOOGLE_SECRET!,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      console.error('Token refresh failed:', {
        status: response.status,
        statusText: response.statusText,
        error: refreshedTokens
      });
      throw new Error(`Token refresh failed: ${refreshedTokens.error_description || refreshedTokens.error}`);
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + (refreshedTokens.expires_in * 1000),
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      error: undefined,
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}
