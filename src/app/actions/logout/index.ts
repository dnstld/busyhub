'use server';

import { signOut } from '@/auth/next';

export const logout = async () => {
  await signOut();
};
