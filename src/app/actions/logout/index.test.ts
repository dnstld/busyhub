import { describe, expect, it, vi } from 'vitest';
import { logout } from './index';

// Mock auth - use the correct import path
vi.mock('@/auth/next', () => ({
  signOut: vi.fn()
}));

const { signOut } = await import('@/auth/next');

describe('logout', () => {
  it('should call signOut', async () => {
    vi.mocked(signOut).mockResolvedValue(undefined);

    await logout();

    expect(signOut).toHaveBeenCalledWith();
  });

  it('should propagate errors from signOut', async () => {
    const error = new Error('Sign out failed');
    vi.mocked(signOut).mockRejectedValue(error);

    await expect(logout()).rejects.toThrow('Sign out failed');
  });
});
