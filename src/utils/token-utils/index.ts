import { AUTH_CONFIG } from '@/constants/auth-constants';
import { JWT } from 'next-auth/jwt';

export type TokenError = 'RefreshAccessTokenError' | 'RefreshAccessTokenNotFoundError' | 'TokenExpiredError' | 'InvalidTokenError';

export interface TokenRefreshResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  token_type?: string;
  scope?: string;
  error?: string;
  error_description?: string;
}

export function isTokenExpired(tokenExpiresAt?: number): boolean {
  if (!tokenExpiresAt || tokenExpiresAt <= 0) {
    return true;
  }
  return tokenExpiresAt <= Date.now() + AUTH_CONFIG.TOKEN_REFRESH_BUFFER;
}

/**
 * Get time remaining until token expires (in milliseconds)
 * Returns 0 if token is already expired or invalid
 */
export function getTokenTimeRemaining(tokenExpiresAt?: number): number {
  if (!tokenExpiresAt || tokenExpiresAt <= 0) {
    return 0;
  }
  const remaining = tokenExpiresAt - Date.now();
  return Math.max(0, remaining);
}

/**
 * Check if token should be refreshed proactively
 * Returns true if token expires within the refresh buffer time
 */
export function shouldRefreshToken(tokenExpiresAt?: number): boolean {
  return isTokenExpired(tokenExpiresAt);
}

/**
 * Format token expiration time for logging/debugging
 */
export function formatTokenExpiration(tokenExpiresAt?: number): string {
  if (!tokenExpiresAt || tokenExpiresAt <= 0) {
    return 'Invalid/No expiration';
  }
  
  const expirationDate = new Date(tokenExpiresAt);
  const now = Date.now();
  const timeDifference = tokenExpiresAt - now;
  
  if (timeDifference <= 0) {
    const minutesAgo = Math.abs(timeDifference / 1000 / 60).toFixed(1);
    return `Expired ${minutesAgo} minutes ago`;
  }
  
  const minutesRemaining = Math.floor(timeDifference / 1000 / 60);
  return `Expires in ${minutesRemaining} minutes (${expirationDate.toISOString()})`;
}

export async function refreshAccessToken(token: JWT): Promise<JWT> {
  if (!token.refreshToken) {
    console.error('No refresh token available');
    return {
      ...token,
      error: 'RefreshAccessTokenNotFoundError' as TokenError,
    };
  }

  if (!process.env.AUTH_GOOGLE_ID || !process.env.AUTH_GOOGLE_SECRET) {
    console.error('Missing Google OAuth credentials');
    return {
      ...token,
      error: 'RefreshAccessTokenError' as TokenError,
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
        client_id: process.env.AUTH_GOOGLE_ID,
        client_secret: process.env.AUTH_GOOGLE_SECRET,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
      }),
    });

    const refreshedTokens: TokenRefreshResponse = await response.json();

    if (!response.ok) {
      const errorType = getErrorTypeFromResponse(response.status, refreshedTokens);
      console.error('Token refresh failed:', {
        status: response.status,
        statusText: response.statusText,
        error: refreshedTokens
      });
      return {
        ...token,
        error: errorType,
      };
    }

    if (!refreshedTokens.access_token || !refreshedTokens.expires_in) {
      console.error('Invalid token refresh response: missing required fields');
      return {
        ...token,
        error: 'RefreshAccessTokenError' as TokenError,
      };
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
      error: 'RefreshAccessTokenError' as TokenError,
    };
  }
}

/**
 * Determine the appropriate error type based on the HTTP response
 */
function getErrorTypeFromResponse(status: number, errorResponse: TokenRefreshResponse): TokenError {
  switch (status) {
    case 400:
      if (errorResponse?.error === 'invalid_grant') {
        return 'TokenExpiredError';
      }
      return 'InvalidTokenError';
    case 401:
      return 'InvalidTokenError';
    case 403:
      return 'InvalidTokenError';
    default:
      return 'RefreshAccessTokenError';
  }
}
