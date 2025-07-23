import { filterEventsByDateRange, getEventsForDate } from '@/utils';
import { useMemo } from 'react';
import { SanitizedEvent } from './useEventsSanitization';

export const useEventsUtils = (
  confirmedEvents: SanitizedEvent[],
  dailyEvents: Map<string, SanitizedEvent[]>
) => {
  const getEventsByDateRange = useMemo(() => {
    return (startDate: string, endDate: string) => {
      return filterEventsByDateRange(confirmedEvents, startDate, endDate);
    };
  }, [confirmedEvents]);

  const getEventsForDateFn = useMemo(() => {
    return (date: string) => {
      return getEventsForDate(dailyEvents, date);
    };
  }, [dailyEvents]);

  return {
    getEventsByDateRange,
    getEventsForDate: getEventsForDateFn,
  };
};
