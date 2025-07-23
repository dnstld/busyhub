import { compareDateStrings, getDateKey, getMonthKey, getWeekKey } from '@/utils';
import { useMemo } from 'react';
import { SanitizedEvent } from './useEventsSanitization';

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
        if (!dateTime) return null;
        
        const date = new Date(dateTime);
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
      if (!byDate.has(dateKey)) byDate.set(dateKey, []);
      byDate.get(dateKey)!.push(event);
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
      if (!weeklyMap.has(weekKey)) {
        weeklyMap.set(weekKey, { count: 0, events: [] });
      }
      
      const week = weeklyMap.get(weekKey)!;
      week.count++;
      week.events.push(event);
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
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { count: 0, events: [] });
      }
      
      const month = monthlyMap.get(monthKey)!;
      month.count++;
      month.events.push(event);
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
