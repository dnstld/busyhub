import { CalendarEvent } from '@/app/actions/getEvents';
import { useMemo } from 'react';

export interface MonthData {
  events: CalendarEvent[];
  days: { [dayKey: string]: CalendarEvent[] };
}

export interface GroupedEvents {
  [monthKey: string]: MonthData;
}

export type FilterType = 'past' | 'upcoming' | 'all';

// Helper function to parse event date
const parseEventDate = (event: CalendarEvent): Date | null => {
  try {
    const dateStr = event.start?.dateTime;
    return dateStr ? new Date(dateStr) : null;
  } catch (error) {
    console.warn('Invalid date format:', event.start?.dateTime);
    return null;
  }
};

// Filter events by timeframe
const filterEventsByTimeframe = (
  events: CalendarEvent[], 
  filter: FilterType
): CalendarEvent[] => {
  const now = new Date();
  
  return events.filter((event) => {
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
};

// Group events by month
const groupEventsByMonth = (events: CalendarEvent[], filter: FilterType): GroupedEvents => {
  const grouped: GroupedEvents = {};
  const filteredEvents = filterEventsByTimeframe(events, filter);

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

export const useEventsFiltering = (rawEvents: CalendarEvent[]) => {
  const getHistoryData = useMemo(() => {
    return (filter: FilterType) => {
      const monthlyEvents = groupEventsByMonth(rawEvents, filter);
      const months = Object.keys(monthlyEvents);
      
      const sortedMonths = filter === 'past'
        ? months.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
        : months.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
      
      return { monthlyEvents, sortedMonths };
    };
  }, [rawEvents]);

  return {
    getHistoryData,
    filterEventsByTimeframe,
    parseEventDate,
  };
};
