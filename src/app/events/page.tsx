import { getEvents } from '@/app/actions/get-events';
import Events from '@/components/containers/events';
import { auth } from '@/lib/auth';
import { EventsProvider, UserProvider } from '@/providers';

export default async function EventsPage() {
  const session = await auth();
  const events = await getEvents(session!.accessToken!);

  return (
    <UserProvider
      user={{
        email: session?.user?.email || undefined,
        name: session?.user?.name || undefined,
        image: session?.user?.image || undefined,
      }}
    >
      <EventsProvider events={events}>
        <Events />
      </EventsProvider>
    </UserProvider>
  );
}
