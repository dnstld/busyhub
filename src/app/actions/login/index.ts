'use server';

import { signIn } from '@/lib/auth';

export const login = async () => {
  await signIn('google');
};
