'use server';

import type { calendar_v3 } from 'googleapis';

export type CalendarEvent = calendar_v3.Schema$Event;

export async function getEvents(
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
  url.searchParams.set('maxResults', '2500');

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
