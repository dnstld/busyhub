import { auth } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function getCalendarAccessToken() {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return null;
    }

    const cookieStore = await cookies();
    
    const userSpecificKey = `calendar_token_${session.user.email.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const token = cookieStore.get(userSpecificKey)?.value;
    
    if (!token || token.trim().length === 0) {
      return null;
    }
    
    return token;
  } catch (error) {
    console.error('Error retrieving calendar access token:', error);
    return null;
  }
}