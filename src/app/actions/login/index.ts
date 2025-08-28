'use server';

import { signIn } from '@/auth/next';

export const login = async () => {
  await signIn('google');
};
