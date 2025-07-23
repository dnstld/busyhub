import { filterEventsByDateRange, getEventsForDate } from '@/utils';
import { useMemo } from 'react';
import { SanitizedEvent } from './useEventsSanitization';

export const useEventsUtils = (
  confirmedEvents: SanitizedEvent[],
  dailyEvents: Map<string, SanitizedEvent[]>
) => {
  // Memoize the date range function since it depends on confirmedEvents
  const getEventsByDateRange = useMemo(() => {
    return (startDate: string, endDate: string) => {
      return filterEventsByDateRange(confirmedEvents, startDate, endDate);
    };
  }, [confirmedEvents]);

  // For the daily events lookup, we don't need to memoize the function itself
  // since Map.get() is already very fast and the function is simple
  const getEventsForDateFn = (date: string) => {
    return getEventsForDate(dailyEvents, date);
  };

  return {
    getEventsByDateRange,
    getEventsForDate: getEventsForDateFn,
  };
};
