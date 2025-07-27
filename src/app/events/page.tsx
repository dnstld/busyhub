import { getEvents } from '@/app/actions/get-events';
import Events from '@/components/containers/events';
import { auth } from '@/lib/auth';
import EventsProvider from '@/providers/events-provider';

export default async function EventsPage() {
  const session = await auth();
  const events = await getEvents(session!.accessToken!);

  return (
    <EventsProvider events={events}>
      <Events />
    </EventsProvider>
  );
}
