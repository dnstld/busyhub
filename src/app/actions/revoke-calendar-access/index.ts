'use server';

import { auth } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function revokeCalendarAccess() {
  const session = await auth();
  
  if (!session?.user?.email) {
    throw new Error('User not authenticated');
  }

  const cookieStore = await cookies();
  const userSpecificKey = `calendar_token_${session.user.email.replace(/[^a-zA-Z0-9]/g, '_')}`;

  cookieStore.delete(userSpecificKey);
  cookieStore.delete(`${userSpecificKey}_refresh`);
  
  return { success: true };
}
