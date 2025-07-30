import { getCalendarAccessToken } from '@/app/actions/get-calendar-token';
import { CalendarEvent, getEvents } from '@/app/actions/get-events';
import Events from '@/components/containers/events';
import { auth } from '@/lib/auth';
import { EventsProvider, UserProvider } from '@/providers';
import SessionProvider from '@/providers/session-provider';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EventsPage() {
  const session = await auth();
  const calendarToken = await getCalendarAccessToken();

  let events: CalendarEvent[] = [];

  if (session?.user && calendarToken) {
    try {
      events = await getEvents(calendarToken);
    } catch (e) {
      console.error('Failed to fetch calendar events:', e);
      events = [];
    }
  }

  return (
    <UserProvider
      user={{
        email: session?.user?.email || undefined,
        name: session?.user?.name || undefined,
        image: session?.user?.image || undefined,
      }}
    >
      <SessionProvider>
        <EventsProvider events={events}>
          <Events />
        </EventsProvider>
      </SessionProvider>
    </UserProvider>
  );
}
