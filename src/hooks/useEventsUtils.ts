import { useMemo } from 'react';
import { SanitizedEvent } from './useEventsSanitization';

export const useEventsUtils = (
  confirmedEvents: SanitizedEvent[],
  dailyEvents: Map<string, SanitizedEvent[]>
) => {
  const getEventsByDateRange = useMemo(() => {
    return (startDate: string, endDate: string) => {
      return confirmedEvents.filter((event) => {
        const dateTime = event.start.dateTime;
        if (!dateTime) return false;
        
        const eventDate = dateTime.slice(0, 10);
        return eventDate >= startDate && eventDate <= endDate;
      });
    };
  }, [confirmedEvents]);

  const getEventsForDate = useMemo(() => {
    return (date: string) => {
      return dailyEvents.get(date) || [];
    };
  }, [dailyEvents]);

  return {
    getEventsByDateRange,
    getEventsForDate,
  };
};
