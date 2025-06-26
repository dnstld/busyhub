import { auth } from '@/auth';
import { redirect } from 'next/navigation';

interface CalendarEvent {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
}

async function getCalendarEvents(
  accessToken: string
): Promise<CalendarEvent[]> {
  const year = new Date().getFullYear();
  const timeMin = new Date(Date.UTC(year, 0, 1, 0, 0, 0)).toISOString();
  const timeMax = new Date(Date.UTC(year + 1, 0, 1, 0, 0, 0)).toISOString();
  const url = new URL(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events'
  );

  url.searchParams.set('singleEvents', 'true');
  url.searchParams.set('orderBy', 'startTime');
  url.searchParams.set('timeMin', timeMin);
  url.searchParams.set('timeMax', timeMax);

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message ?? `HTTP ${res.status}`);
  }

  const data: { items: CalendarEvent[] } = await res.json();
  return data.items ?? [];
}

export default async function Dashboard() {
  const session = await auth();
  if (!session) redirect('/');

  let events: CalendarEvent[] = [];
  let error: string | null = null;

  try {
    events = await getCalendarEvents(session.accessToken!);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Unknown error';
  }

  return (
    <main>
      <h1>Dashboard</h1>

      <div>
        {error ? (
          <p>{error}</p>
        ) : events.length === 0 ? (
          <p>No upcoming events.</p>
        ) : (
          <ul>
            {events.map((e) => (
              <li key={e.id}>
                <p>{e.summary ?? 'No title'}</p>
                <p>
                  {new Date(
                    e.start.dateTime ?? e.start.date ?? ''
                  ).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
