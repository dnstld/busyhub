import { CalendarEvent } from '@/app/actions/getEvents';
import { compareDatesAscending, compareDatesDescending, filterEventsByTimeframe, FilterType, getDayKey, getMonthDisplayKey, parseEventDate } from '@/utils';
import { useMemo } from 'react';

export interface MonthData {
  events: CalendarEvent[];
  days: { [dayKey: string]: CalendarEvent[] };
}

export interface GroupedEvents {
  [monthKey: string]: MonthData;
}

// Re-export FilterType for backward compatibility
export type { FilterType };

// Group events by month
const groupEventsByMonth = (events: CalendarEvent[], filter: FilterType): GroupedEvents => {
  const grouped: GroupedEvents = {};
  const filteredEvents = filterEventsByTimeframe(events, filter);

  filteredEvents.forEach((event) => {
    const eventDate = parseEventDate(event);
    if (!eventDate) return;

    const monthKey = getMonthDisplayKey(eventDate);

    if (!grouped[monthKey]) {
      grouped[monthKey] = { events: [], days: {} };
    }

    grouped[monthKey].events.push(event);

    const dayKey = getDayKey(eventDate);
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
        ? months.sort(compareDatesDescending)
        : months.sort(compareDatesAscending);
      
      return { monthlyEvents, sortedMonths };
    };
  }, [rawEvents]);

  return {
    getHistoryData,
    filterEventsByTimeframe,
    parseEventDate,
  };
};
