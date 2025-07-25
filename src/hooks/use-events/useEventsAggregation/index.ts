import { compareDateStrings, createSafeDate, getDateKey, getMonthKey, getOrSetMapValue, getWeekKey, isNonEmptyString, isValidDate } from '@/utils';
import { useMemo } from 'react';
import { SanitizedEvent } from '../useEventsSanitization';

export interface DailyEventStats {
  date: string; // YYYY-MM-DD format
  count: number;
  events: SanitizedEvent[];
}

interface AggregationData {
  count: number;
  events: SanitizedEvent[];
}

export const useEventsAggregation = (confirmedEvents: SanitizedEvent[]) => {
  // Pre-process events with dates to avoid repeated parsing
  const eventsWithDates = useMemo(() => {
    return confirmedEvents
      .map((event) => {
        const dateTime = event.start.dateTime;
        if (!isNonEmptyString(dateTime)) return null;
        
        const date = createSafeDate(dateTime);
        if (!isValidDate(date)) return null;
        
        return {
          event,
          date,
          dateKey: getDateKey(date),
          weekKey: getWeekKey(date),
          monthKey: getMonthKey(date),
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [confirmedEvents]);

  const dailyStats = useMemo(() => {
    const byDate = new Map<string, SanitizedEvent[]>();
    
    eventsWithDates.forEach(({ event, dateKey }) => {
      const eventsForDate = getOrSetMapValue(byDate, dateKey, []);
      eventsForDate.push(event);
    });

    return Array.from(byDate.entries())
      .map(([date, events]) => ({
        date,
        count: events.length,
        events,
      }))
      .sort((a, b) => compareDateStrings(a.date, b.date));
  }, [eventsWithDates]);

  const weeklyStats = useMemo(() => {
    const weeklyMap = new Map<string, AggregationData>();
    
    eventsWithDates.forEach(({ event, weekKey }) => {
      const weekData = getOrSetMapValue(weeklyMap, weekKey, { count: 0, events: [] });
      weekData.count++;
      weekData.events.push(event);
    });

    return Array.from(weeklyMap.entries())
      .map(([date, data]) => ({
        date,
        count: data.count,
        events: data.events,
      }))
      .sort((a, b) => compareDateStrings(a.date, b.date));
  }, [eventsWithDates]);

  const monthlyStats = useMemo(() => {
    const monthlyMap = new Map<string, AggregationData>();
    
    eventsWithDates.forEach(({ event, monthKey }) => {
      const monthData = getOrSetMapValue(monthlyMap, monthKey, { count: 0, events: [] });
      monthData.count++;
      monthData.events.push(event);
    });

    return Array.from(monthlyMap.entries())
      .map(([date, data]) => ({
        date,
        count: data.count,
        events: data.events,
      }))
      .sort((a, b) => compareDateStrings(a.date, b.date));
  }, [eventsWithDates]);

  return {
    dailyStats,
    weeklyStats,
    monthlyStats,
  };
};
