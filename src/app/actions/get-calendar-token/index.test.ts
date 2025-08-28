import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getCalendarAccessToken } from './index';

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

describe('getCalendarAccessToken', () => {
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

  it('should return null when no token is found in cookies', async () => {
    mockCookieStore.get.mockReturnValue(undefined);

    const result = await getCalendarAccessToken();

    expect(result).toBeNull();
    expect(mockCookieStore.get).toHaveBeenCalledWith('busyhub_calendar_token_test_example_com');
    expect(console.log).toHaveBeenCalledWith('No calendar access token found in cookies');
  });

  it('should return null when token is empty', async () => {
    mockCookieStore.get.mockReturnValue({ value: '   ' });

    const result = await getCalendarAccessToken();

    expect(result).toBeNull();
    expect(console.log).toHaveBeenCalledWith('No calendar access token found in cookies');
  });

  it('should return token when valid token is found and validated successfully', async () => {
    const mockToken = 'valid-access-token';
    mockCookieStore.get.mockReturnValue({ value: mockToken });
    
    mockFetch.mockResolvedValueOnce({
      ok: true
    });

    const result = await getCalendarAccessToken();

    expect(result).toBe(mockToken);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://www.googleapis.com/calendar/v3/calendars/test%40example.com/events?maxResults=1',
      {
        headers: {
          Authorization: `Bearer ${mockToken}`
        }
      }
    );
    expect(console.log).toHaveBeenCalledWith('Calendar token is valid');
  });

  it('should return null when token validation fails', async () => {
    const mockToken = 'invalid-access-token';
    mockCookieStore.get.mockReturnValue({ value: mockToken });
    
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401
    });

    const result = await getCalendarAccessToken();

    expect(result).toBeNull();
    expect(console.log).toHaveBeenCalledWith('Calendar token appears to be invalid or expired');
  });

  it('should return null when token validation throws an error', async () => {
    const mockToken = 'error-token';
    mockCookieStore.get.mockReturnValue({ value: mockToken });
    
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await getCalendarAccessToken();

    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalledWith('Error validating calendar token:', expect.any(Error));
  });

  it('should handle errors gracefully and return null', async () => {
    vi.mocked(auth).mockRejectedValueOnce(new Error('Auth error'));

    const result = await getCalendarAccessToken();

    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalledWith('Error retrieving calendar access token:', expect.any(Error));
  });

  it('should create correct user-specific cookie key', async () => {
    const mockSession = {
      user: {
        email: 'user+test@example-domain.com'
      }
    };
    vi.mocked(auth).mockResolvedValue(mockSession as never);
    mockCookieStore.get.mockReturnValue(undefined);

    await getCalendarAccessToken();

    expect(mockCookieStore.get).toHaveBeenCalledWith('busyhub_calendar_token_test_example_com');
  });
});
