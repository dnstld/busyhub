import { describe, expect, it, vi } from 'vitest';
import { login } from './index';

// Mock auth - use the correct import path
vi.mock('@/auth/next', () => ({
  signIn: vi.fn()
}));

const { signIn } = await import('@/auth/next');

describe('login', () => {
  it('should call signIn with google provider', async () => {
    vi.mocked(signIn).mockResolvedValue(undefined);

    await login();

    expect(signIn).toHaveBeenCalledWith('google');
  });

  it('should propagate errors from signIn', async () => {
    const error = new Error('Sign in failed');
    vi.mocked(signIn).mockRejectedValue(error);

    await expect(login()).rejects.toThrow('Sign in failed');
  });
});
