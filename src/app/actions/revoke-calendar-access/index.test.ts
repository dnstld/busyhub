import { beforeEach, describe, expect, it, vi } from 'vitest';
import { revokeCalendarAccess } from './index';

// Mock next/headers
vi.mock('next/headers', () => ({
  cookies: vi.fn()
}));

// Mock auth
vi.mock('@/lib/auth', () => ({
  auth: vi.fn()
}));

const { cookies } = await import('next/headers');
const { auth } = await import('@/lib/auth');

describe('revokeCalendarAccess', () => {
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
  });

  it('should delete calendar tokens and return success', async () => {
    const result = await revokeCalendarAccess();

    expect(result).toEqual({ success: true });
    expect(mockCookieStore.delete).toHaveBeenCalledWith('calendar_token_test_example_com');
    expect(mockCookieStore.delete).toHaveBeenCalledWith('calendar_token_test_example_com_refresh');
  });

  it('should throw error when user is not authenticated', async () => {
    vi.mocked(auth).mockResolvedValue(null as never);

    await expect(revokeCalendarAccess()).rejects.toThrow('User not authenticated');
    expect(mockCookieStore.delete).not.toHaveBeenCalled();
  });

  it('should throw error when user has no email', async () => {
    vi.mocked(auth).mockResolvedValue({ user: {} } as never);

    await expect(revokeCalendarAccess()).rejects.toThrow('User not authenticated');
    expect(mockCookieStore.delete).not.toHaveBeenCalled();
  });

  it('should handle special characters in email correctly', async () => {
    const mockSessionWithSpecialEmail = {
      user: {
        email: 'user+test@example-domain.com'
      }
    };
    vi.mocked(auth).mockResolvedValue(mockSessionWithSpecialEmail as never);

    const result = await revokeCalendarAccess();

    expect(result).toEqual({ success: true });
    expect(mockCookieStore.delete).toHaveBeenCalledWith('calendar_token_user_test_example_domain_com');
    expect(mockCookieStore.delete).toHaveBeenCalledWith('calendar_token_user_test_example_domain_com_refresh');
  });

  it('should handle auth errors gracefully', async () => {
    vi.mocked(auth).mockRejectedValue(new Error('Auth service error'));

    await expect(revokeCalendarAccess()).rejects.toThrow('Auth service error');
    expect(mockCookieStore.delete).not.toHaveBeenCalled();
  });
});
