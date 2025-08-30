import { getCalendarAccessToken } from '@/app/actions/get-calendar-token';
import { CalendarEvent, getEvents } from '@/app/actions/get-events';
import { auth } from '@/auth/next';
import Events from '@/components/containers/events';
import { EventsProvider, UserProvider } from '@/providers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EventsPage() {
  const session = await auth();
  const calendarToken = await getCalendarAccessToken();

  let events: CalendarEvent[] = [];

  if (session?.user?.email && calendarToken) {
    events = await getEvents(calendarToken, session.user.email);
  }

  return (
    <UserProvider
      user={{
        email: session?.user?.email || undefined,
        name: session?.user?.name || undefined,
        image: session?.user?.image || undefined,
      }}
    >
      <EventsProvider events={events}>
        <Events hasCalendarToken={!!calendarToken} />
      </EventsProvider>
    </UserProvider>
  );
}
