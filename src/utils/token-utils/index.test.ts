import type { JWT } from 'next-auth/jwt';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  formatTokenExpiration,
  getTokenTimeRemaining,
  isTokenExpired,
  refreshAccessToken,
  shouldRefreshToken
} from './index';

// Mock AUTH_CONFIG
vi.mock('@/constants/auth-constants', () => ({
  AUTH_CONFIG: {
    TOKEN_REFRESH_BUFFER: 5 * 60 * 1000, // 5 minutes
  },
}));

// Mock environment variables
beforeEach(() => {
  vi.stubEnv('AUTH_GOOGLE_ID', 'test-google-id');
  vi.stubEnv('AUTH_GOOGLE_SECRET', 'test-google-secret');
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe('isTokenExpired', () => {
  beforeEach(() => {
    // Mock Date.now to return a consistent time for testing
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return true for undefined tokenExpiresAt', () => {
    expect(isTokenExpired(undefined)).toBe(true);
  });

  it('should return true for null tokenExpiresAt', () => {
    expect(isTokenExpired(null as unknown as number)).toBe(true);
  });

  it('should return true for zero tokenExpiresAt', () => {
    expect(isTokenExpired(0)).toBe(true);
  });

  it('should return true for negative tokenExpiresAt', () => {
    expect(isTokenExpired(-1000)).toBe(true);
  });

  it('should return true if token expires within buffer time', () => {
    const now = Date.now();
    const expiresIn4Minutes = now + (4 * 60 * 1000); // 4 minutes from now (less than 5 minute buffer)
    expect(isTokenExpired(expiresIn4Minutes)).toBe(true);
  });

  it('should return false if token expires after buffer time', () => {
    const now = Date.now();
    const expiresIn6Minutes = now + (6 * 60 * 1000); // 6 minutes from now (more than 5 minute buffer)
    expect(isTokenExpired(expiresIn6Minutes)).toBe(false);
  });

  it('should return true if token is already expired', () => {
    const now = Date.now();
    const expiredToken = now - (10 * 60 * 1000); // 10 minutes ago
    expect(isTokenExpired(expiredToken)).toBe(true);
  });

  it('should return true if token expires exactly at buffer time', () => {
    const now = Date.now();
    const expiresExactlyAtBuffer = now + (5 * 60 * 1000); // exactly 5 minutes from now
    expect(isTokenExpired(expiresExactlyAtBuffer)).toBe(true);
  });
});

describe('refreshAccessToken', () => {
  const mockFetch = vi.fn();
  
  beforeEach(() => {
    global.fetch = mockFetch;
    vi.clearAllMocks();
    // Mock console.error to avoid noise in tests
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return error when no refresh token is available', async () => {
    const token: JWT = {
      email: 'test@example.com',
      // no refreshToken
    };

    const result = await refreshAccessToken(token);

    expect(result).toEqual({
      ...token,
      error: 'RefreshAccessTokenNotFoundError',
    });
    expect(console.error).toHaveBeenCalledWith('No refresh token available');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should successfully refresh token with valid response', async () => {
    const token: JWT = {
      email: 'test@example.com',
      refreshToken: 'valid-refresh-token',
      accessToken: 'old-access-token',
    };

    const mockResponse = {
      access_token: 'new-access-token',
      expires_in: 3600,
      refresh_token: 'new-refresh-token',
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    // Mock Date.now for consistent expires calculation
    const mockNow = 1642248000000; // Fixed timestamp
    vi.spyOn(Date, 'now').mockReturnValue(mockNow);

    const result = await refreshAccessToken(token);

    expect(mockFetch).toHaveBeenCalledWith('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        client_id: 'test-google-id',
        client_secret: 'test-google-secret',
        grant_type: 'refresh_token',
        refresh_token: 'valid-refresh-token',
      }),
    });

    expect(result).toEqual({
      ...token,
      accessToken: 'new-access-token',
      accessTokenExpires: mockNow + (3600 * 1000),
      refreshToken: 'new-refresh-token',
      error: undefined,
    });
  });

  it('should keep old refresh token if new one is not provided', async () => {
    const token: JWT = {
      email: 'test@example.com',
      refreshToken: 'old-refresh-token',
    };

    const mockResponse = {
      access_token: 'new-access-token',
      expires_in: 3600,
      // no refresh_token in response
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const mockNow = 1642248000000;
    vi.spyOn(Date, 'now').mockReturnValue(mockNow);

    const result = await refreshAccessToken(token);

    expect(result.refreshToken).toBe('old-refresh-token');
  });

  it('should handle failed token refresh with error response', async () => {
    const token: JWT = {
      email: 'test@example.com',
      refreshToken: 'invalid-refresh-token',
    };

    const mockErrorResponse = {
      error: 'invalid_grant',
      error_description: 'Invalid refresh token',
    };

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: () => Promise.resolve(mockErrorResponse),
    });

    const result = await refreshAccessToken(token);

    expect(result).toEqual({
      ...token,
      error: 'TokenExpiredError',
    });
    expect(console.error).toHaveBeenCalledWith('Token refresh failed:', {
      status: 400,
      statusText: 'Bad Request',
      error: mockErrorResponse,
    });
  });

  it('should handle network errors', async () => {
    const token: JWT = {
      email: 'test@example.com',
      refreshToken: 'valid-refresh-token',
    };

    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await refreshAccessToken(token);

    expect(result).toEqual({
      ...token,
      error: 'RefreshAccessTokenError',
    });
    expect(console.error).toHaveBeenCalledWith('Error refreshing access token:', expect.any(Error));
  });

  it('should handle malformed JSON response', async () => {
    const token: JWT = {
      email: 'test@example.com',
      refreshToken: 'valid-refresh-token',
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.reject(new Error('Invalid JSON')),
    });

    const result = await refreshAccessToken(token);

    expect(result).toEqual({
      ...token,
      error: 'RefreshAccessTokenError',
    });
  });
});

describe('getTokenTimeRemaining', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return 0 for undefined tokenExpiresAt', () => {
    expect(getTokenTimeRemaining(undefined)).toBe(0);
  });

  it('should return 0 for expired token', () => {
    const pastTime = Date.now() - 10000;
    expect(getTokenTimeRemaining(pastTime)).toBe(0);
  });

  it('should return correct remaining time for valid token', () => {
    const futureTime = Date.now() + 300000; // 5 minutes
    expect(getTokenTimeRemaining(futureTime)).toBe(300000);
  });
});

describe('shouldRefreshToken', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return true for tokens that need refresh', () => {
    const soonToExpire = Date.now() + (4 * 60 * 1000); // 4 minutes (within buffer)
    expect(shouldRefreshToken(soonToExpire)).toBe(true);
  });

  it('should return false for tokens with plenty of time', () => {
    const notExpiringSoon = Date.now() + (10 * 60 * 1000); // 10 minutes
    expect(shouldRefreshToken(notExpiringSoon)).toBe(false);
  });
});

describe('formatTokenExpiration', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should format invalid tokens', () => {
    expect(formatTokenExpiration(undefined)).toBe('Invalid/No expiration');
    expect(formatTokenExpiration(0)).toBe('Invalid/No expiration');
  });

  it('should format expired tokens', () => {
    const expired = Date.now() - (5 * 60 * 1000); // 5 minutes ago
    const result = formatTokenExpiration(expired);
    expect(result).toContain('Expired 5.0 minutes ago');
  });

  it('should format future expiration', () => {
    const future = Date.now() + (10 * 60 * 1000); // 10 minutes from now
    const result = formatTokenExpiration(future);
    expect(result).toContain('Expires in 10 minutes');
    expect(result).toContain('2024-01-15T12:10:00.000Z');
  });
});
