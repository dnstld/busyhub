import { auth } from '@/auth/next';
import { createKey } from '@/utils/create-key';
import { cookies } from 'next/headers';

export type CalendarToken = string | null;

export async function getCalendarAccessToken(): Promise<CalendarToken> {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return null;
    }

    const cookieStore = await cookies();
    const { userKey } = createKey(session.user.email);
    const token = cookieStore.get(userKey)?.value;
    
    if (!token || token.trim().length === 0) {
      return null;
    }
    
    // Test if the token is valid by making a simple API call
    try {
      const testResponse = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(session.user.email)}/events?maxResults=1`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!testResponse.ok) {
        return null;
      }
      
      return token;
    } catch (error) {
      console.error('Error validating calendar token:', error);
      return null;
    }
  } catch (error) {
    console.error('Error retrieving calendar access token:', error);
    return null;
  }
}