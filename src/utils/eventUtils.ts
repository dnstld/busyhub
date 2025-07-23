import { CalendarEvent } from '@/app/actions/getEvents';
import { SanitizedEvent } from '@/hooks/useEventsSanitization';
import { parseEventDate } from './dateUtils';
import { EVENT_STATUS, FILTER_TYPES } from './eventConstants';

export type FilterType = typeof FILTER_TYPES[keyof typeof FILTER_TYPES];

/**
 * Check if an event has a valid date
 */
export const hasValidDate = (event: CalendarEvent | SanitizedEvent): boolean => {
  return !!(event.start?.dateTime);
};

/**
 * Check if an event is confirmed
 */
export const isConfirmedEvent = (event: CalendarEvent | SanitizedEvent): boolean => {
  return event.status === EVENT_STATUS.CONFIRMED;
};

/**
 * Check if an event is confirmed and has a valid date
 */
export const isValidConfirmedEvent = (event: CalendarEvent | SanitizedEvent): boolean => {
  return isConfirmedEvent(event) && hasValidDate(event);
};

/**
 * Filter events by timeframe
 */
export const filterEventsByTimeframe = (
  events: CalendarEvent[], 
  filter: FilterType
): CalendarEvent[] => {
  const now = new Date();
  
  return events.filter((event) => {
    const eventDate = parseEventDate(event);
    if (!eventDate) return false;

    switch (filter) {
      case FILTER_TYPES.PAST:
        return eventDate < now;
      case FILTER_TYPES.UPCOMING:
        return eventDate >= now;
      case FILTER_TYPES.ALL:
        return true;
      default:
        return true;
    }
  });
};

/**
 * Filter events by date range
 */
export const filterEventsByDateRange = (
  events: SanitizedEvent[],
  startDate: string,
  endDate: string
): SanitizedEvent[] => {
  return events.filter((event) => {
    const dateTime = event.start.dateTime;
    if (!dateTime) return false;
    
    const eventDate = dateTime.slice(0, 10);
    return eventDate >= startDate && eventDate <= endDate;
  });
};

/**
 * Get events for a specific date
 */
export const getEventsForDate = (
  eventsMap: Map<string, SanitizedEvent[]>,
  date: string
): SanitizedEvent[] => {
  return eventsMap.get(date) || [];
};

/**
 * Sort events by date ascending
 */
export const sortEventsByDateAsc = (events: CalendarEvent[]): CalendarEvent[] => {
  return [...events].sort((a, b) => {
    const dateA = parseEventDate(a);
    const dateB = parseEventDate(b);
    
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;
    
    return dateA.getTime() - dateB.getTime();
  });
};

/**
 * Sort events by date descending
 */
export const sortEventsByDateDesc = (events: CalendarEvent[]): CalendarEvent[] => {
  return [...events].sort((a, b) => {
    const dateA = parseEventDate(a);
    const dateB = parseEventDate(b);
    
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;
    
    return dateB.getTime() - dateA.getTime();
  });
};
