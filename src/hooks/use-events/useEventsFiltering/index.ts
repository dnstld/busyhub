import { CalendarEvent } from '@/app/actions/get-events';
import { compareDatesAscending, compareDatesDescending, filterEventsByTimeframe, FilterType, getDayKey, getMonthDisplayKey, isValidDate, MemoCache, parseEventDate } from '@/utils';
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

// Group events by month with type safety
const groupEventsByMonth = (events: CalendarEvent[], filter: FilterType): GroupedEvents => {
  const grouped: GroupedEvents = {};
  const filteredEvents = filterEventsByTimeframe(events, filter);

  filteredEvents.forEach((event) => {
    const eventDate = parseEventDate(event);
    if (!isValidDate(eventDate)) return;

    const monthKey = getMonthDisplayKey(eventDate);

    // Type-safe object property initialization
    if (!(monthKey in grouped)) {
      grouped[monthKey] = { events: [], days: {} };
    }

    grouped[monthKey].events.push(event);

    const dayKey = getDayKey(eventDate);
    if (!(dayKey in grouped[monthKey].days)) {
      grouped[monthKey].days[dayKey] = [];
    }
    grouped[monthKey].days[dayKey].push(event);
  });

  return grouped;
};

export const useEventsFiltering = (rawEvents: CalendarEvent[]) => {
  // Create a memoization cache for expensive grouping operations
  const cache = useMemo(() => new MemoCache<{ events: CalendarEvent[], filter: FilterType }, { monthlyEvents: GroupedEvents; sortedMonths: string[] }>(), []);
  
  // Memoize the getHistoryData function to avoid recreating it on every render
  const getHistoryData = useMemo(() => {
    return (filter: FilterType) => {
      // Use the memoization cache to avoid recomputing the same filter result
      return cache.get({ events: rawEvents, filter }, () => {
        const monthlyEvents = groupEventsByMonth(rawEvents, filter);
        const months = Object.keys(monthlyEvents);
        
        const sortedMonths = filter === 'past'
          ? months.sort(compareDatesDescending)
          : months.sort(compareDatesAscending);
        
        return { monthlyEvents, sortedMonths };
      });
    };
  }, [rawEvents, cache]);

  return {
    getHistoryData,
    // Export utility functions for external use
    filterEventsByTimeframe,
    parseEventDate,
  };
};
