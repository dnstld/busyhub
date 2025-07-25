import { getEvents } from '@/app/actions/get-events';
import { auth } from '@/lib/auth';
import EventsProvider from '@/providers/events-provider';
import EventsContent from '@/ui/events';

export default async function EventsPage() {
  const session = await auth();
  const events = await getEvents(session!.accessToken!);

  return (
    <EventsProvider events={events}>
      <EventsContent />
    </EventsProvider>
  );
}
