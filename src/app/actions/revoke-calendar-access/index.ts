'use server';

import { auth } from '@/auth/next';
import { createKey } from '@/utils/create-key';
import { cookies } from 'next/headers';

export async function revokeCalendarAccess() {
  const session = await auth();
  
  if (!session?.user?.email) {
    throw new Error('User not authenticated');
  }

  const cookieStore = await cookies();
  const { userKey, refreshKey } = createKey(session.user.email);

  cookieStore.delete(userKey);
  cookieStore.delete(refreshKey);
  
  return { success: true };
}
