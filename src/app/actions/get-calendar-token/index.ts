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
      console.log('No calendar access token found in cookies');
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
        console.log('Calendar token appears to be invalid or expired');
        return null;
      }
      
      console.log('Calendar token is valid');
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