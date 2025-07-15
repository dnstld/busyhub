import { getEvents } from '@/app/actions/getEvents';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import EventsProvider from './events-provider-client';

export default async function EventsProviderServer({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect('/');

  const events = getEvents(session.accessToken!);

  return <EventsProvider events={events}>{children}</EventsProvider>;
}
