import { getEvents } from '@/app/actions/getEvents';
import { auth } from '@/lib/auth';
import EventsProvider from '@/providers/events-provider';
import DashboardContent from '@/ui/dashboard';

export default async function DashboardPage() {
  const session = await auth();
  const events = await getEvents(session!.accessToken!);

  return (
    <EventsProvider events={events}>
      <DashboardContent />
    </EventsProvider>
  );
}
