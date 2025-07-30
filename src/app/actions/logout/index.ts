'use server';

import { signOut } from '@/lib/auth';
import { cookies } from 'next/headers';

export const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete('calendarAccessToken');
  
  await signOut();
};
