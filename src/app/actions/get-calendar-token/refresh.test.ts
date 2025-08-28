import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getCalendarAccessToken } from './refresh';

// Mock next/headers
vi.mock('next/headers', () => ({
  cookies: vi.fn()
}));

// Mock auth - use the correct import path
vi.mock('@/auth/next', () => ({
  auth: vi.fn()
}));

// Mock the create-key utility
vi.mock('@/utils/create-key', () => ({
  createKey: vi.fn()
}));

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

const { cookies } = await import('next/headers');
const { auth } = await import('@/auth/next');
const { createKey } = await import('@/utils/create-key');

describe('getCalendarAccessToken (refresh)', () => {
  const mockCookieStore = {
    get: vi.fn(),
    getAll: vi.fn(),
    has: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
    [Symbol.iterator]: vi.fn(),
    size: 0
  };
  
  const mockSession = {
    user: {
      email: 'test@example.com'
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(cookies).mockResolvedValue(mockCookieStore as never);
    vi.mocked(auth).mockResolvedValue(mockSession as never);
    vi.mocked(createKey).mockReturnValue({
      userKey: 'busyhub_calendar_token_test_example_com',
      refreshKey: 'busyhub_calendar_token_test_example_com_refresh'
    });
    console.log = vi.fn();
    console.error = vi.fn();
    
    // Mock environment variables
    process.env.AUTH_GOOGLE_ID = 'test-client-id';
    process.env.AUTH_GOOGLE_SECRET = 'test-client-secret';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return null when user is not authenticated', async () => {
    vi.mocked(auth).mockResolvedValue(null as never);

    const result = await getCalendarAccessToken();

    expect(result).toBeNull();
  });

  it('should return null when user has no email', async () => {
    vi.mocked(auth).mockResolvedValue({ user: {} } as never);

    const result = await getCalendarAccessToken();

    expect(result).toBeNull();
  });

  it('should return access token when it exists and is valid', async () => {
    const mockAccessToken = 'valid-access-token';
    mockCookieStore.get.mockImplementation((key: string) => {
      if (key === 'busyhub_calendar_token_test_example_com') {
        return { value: mockAccessToken };
      }
      return undefined;
    });

    const result = await getCalendarAccessToken();

    expect(result).toBe(mockAccessToken);
    expect(mockCookieStore.get).toHaveBeenCalledWith('busyhub_calendar_token_test_example_com');
  });

  it('should refresh token when access token is missing but refresh token exists', async () => {
    const mockRefreshToken = 'valid-refresh-token';
    const mockNewAccessToken = 'new-access-token';
    const mockNewRefreshToken = 'new-refresh-token';

    mockCookieStore.get.mockImplementation((key: string) => {
      if (key === 'busyhub_calendar_token_test_example_com') {
        return undefined; // No access token
      }
      if (key === 'busyhub_calendar_token_test_example_com_refresh') {
        return { value: mockRefreshToken }; // Has refresh token
      }
      return undefined;
    });

    // Mock the token refresh API call
    mockFetch.mockImplementation((url: string) => {
      if (url === 'https://oauth2.googleapis.com/token') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            access_token: mockNewAccessToken,
            refresh_token: mockNewRefreshToken
          })
        });
      }
      // Mock the API call to store refreshed token
      if (url === '/api/calendar/store-refreshed-token') {
        return Promise.resolve({
          ok: true
        });
      }
      return Promise.reject(new Error('Unexpected URL'));
    });

    const result = await getCalendarAccessToken();

    expect(result).toBe(mockNewAccessToken);
    
    // Verify token refresh API call
    expect(mockFetch).toHaveBeenCalledWith('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: 'test-client-id',
        client_secret: 'test-client-secret',
        refresh_token: mockRefreshToken,
        grant_type: 'refresh_token',
      }),
    });

    // Verify store refreshed token API call
    expect(mockFetch).toHaveBeenCalledWith('/api/calendar/store-refreshed-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accessToken: mockNewAccessToken,
        refreshToken: mockNewRefreshToken,
        userEmail: 'test@example.com'
      }),
    });
  });

  it('should use existing refresh token when new refresh token is not provided', async () => {
    const mockRefreshToken = 'valid-refresh-token';
    const mockNewAccessToken = 'new-access-token';

    mockCookieStore.get.mockImplementation((key: string) => {
      if (key === 'busyhub_calendar_token_test_example_com') {
        return undefined; // No access token
      }
      if (key === 'busyhub_calendar_token_test_example_com_refresh') {
        return { value: mockRefreshToken }; // Has refresh token
      }
      return undefined;
    });

    // Mock the token refresh API call without new refresh token
    mockFetch.mockImplementation((url: string) => {
      if (url === 'https://oauth2.googleapis.com/token') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            access_token: mockNewAccessToken
            // No refresh_token in response
          })
        });
      }
      if (url === '/api/calendar/store-refreshed-token') {
        return Promise.resolve({
          ok: true
        });
      }
      return Promise.reject(new Error('Unexpected URL'));
    });

    await getCalendarAccessToken();

    // Verify store refreshed token API call uses existing refresh token
    expect(mockFetch).toHaveBeenCalledWith('/api/calendar/store-refreshed-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accessToken: mockNewAccessToken,
        refreshToken: mockRefreshToken,
        userEmail: 'test@example.com'
      }),
    });
  });

  it('should return null when token refresh fails', async () => {
    const mockRefreshToken = 'invalid-refresh-token';

    mockCookieStore.get.mockImplementation((key: string) => {
      if (key === 'busyhub_calendar_token_test_example_com') {
        return undefined; // No access token
      }
      if (key === 'busyhub_calendar_token_test_example_com_refresh') {
        return { value: mockRefreshToken }; // Has refresh token
      }
      return undefined;
    });

    // Mock failed token refresh
    mockFetch.mockImplementation((url: string) => {
      if (url === 'https://oauth2.googleapis.com/token') {
        return Promise.resolve({
          ok: false,
          json: () => Promise.resolve({
            error: 'invalid_grant',
            error_description: 'Invalid refresh token'
          })
        });
      }
      return Promise.reject(new Error('Unexpected URL'));
    });

    const result = await getCalendarAccessToken();

    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalledWith('Failed to refresh calendar token:', expect.any(Error));
  });

  it('should return null when no tokens are available', async () => {
    mockCookieStore.get.mockReturnValue(undefined);

    const result = await getCalendarAccessToken();

    expect(result).toBeNull();
  });

  it('should return null when access token is empty', async () => {
    mockCookieStore.get.mockImplementation((key: string) => {
      if (key === 'busyhub_calendar_token_test_example_com') {
        return { value: '   ' }; // Empty access token
      }
      return undefined;
    });

    const result = await getCalendarAccessToken();

    expect(result).toBeNull();
  });

  it('should handle errors gracefully and return null', async () => {
    vi.mocked(auth).mockRejectedValueOnce(new Error('Auth error'));

    const result = await getCalendarAccessToken();

    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalledWith('Error retrieving calendar access token:', expect.any(Error));
  });

  it('should handle token refresh network errors', async () => {
    const mockRefreshToken = 'valid-refresh-token';

    mockCookieStore.get.mockImplementation((key: string) => {
      if (key === 'busyhub_calendar_token_test_example_com') {
        return undefined;
      }
      if (key === 'busyhub_calendar_token_test_example_com_refresh') {
        return { value: mockRefreshToken };
      }
      return undefined;
    });

    mockFetch.mockImplementation((url: string) => {
      if (url === 'https://oauth2.googleapis.com/token') {
        return Promise.reject(new Error('Network error'));
      }
      return Promise.reject(new Error('Unexpected URL'));
    });

    const result = await getCalendarAccessToken();

    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalledWith('Failed to refresh calendar token:', expect.any(Error));
  });
});
