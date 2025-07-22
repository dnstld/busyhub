import { CalendarEvent } from '@/app/actions/getEvents';
import { FilterType } from '@/ui/history-filter';
import { useMemo } from 'react';

export interface MonthData {
  events: CalendarEvent[];
  days: { [dayKey: string]: CalendarEvent[] };
}

export interface GroupedEvents {
  [monthKey: string]: MonthData;
}

export const useHistory = (events: CalendarEvent[], filter: FilterType) => {
  const monthlyEvents = useMemo(
    () => groupEventsByMonth(events, filter),
    [events, filter]
  );

  const sortedMonths = useMemo(
    () =>
      Object.keys(monthlyEvents).sort(
        (a, b) => new Date(b).getTime() - new Date(a).getTime()
      ),
    [monthlyEvents]
  );

  return {
    monthlyEvents,
    sortedMonths,
  };
};

const parseEventDate = (event: CalendarEvent): Date | null => {
    const dateStr = event.start?.dateTime;
    return dateStr ? new Date(dateStr) : null;
};

const groupEventsByMonth = (
  events: CalendarEvent[],
  filter: FilterType
): GroupedEvents => {
  const grouped: GroupedEvents = {};
  const now = new Date();

  const filteredEvents = events.filter((event) => {
    const eventDate = parseEventDate(event);
    if (!eventDate) return false;

    switch (filter) {
      case 'past':
        return eventDate < now;
      case 'upcoming':
        return eventDate >= now;
      case 'all':
        return true;
    }
  });

  filteredEvents.forEach((event) => {
    const eventDate = parseEventDate(event);
    if (!eventDate) return;

    const monthKey = eventDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });

    if (!grouped[monthKey]) {
      grouped[monthKey] = { events: [], days: {} };
    }

    grouped[monthKey].events.push(event);

    const dayKey = eventDate.toDateString();
    if (!grouped[monthKey].days[dayKey]) {
      grouped[monthKey].days[dayKey] = [];
    }
    grouped[monthKey].days[dayKey].push(event);
  });

  return grouped;
};