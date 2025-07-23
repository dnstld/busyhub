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
  const dailyStats = useMemo(() => {
    const byDate = new Map<string, SanitizedEvent[]>();
    
    confirmedEvents.forEach((ev) => {
      const dateTime = ev.start.dateTime;
      if (!dateTime) return;
      
      const dateObj = new Date(dateTime);
      const dateKey = dateObj.toISOString().slice(0, 10);
      
      if (!byDate.has(dateKey)) byDate.set(dateKey, []);
      byDate.get(dateKey)!.push(ev);
    });

    return Array.from(byDate.entries())
      .map(([date, events]) => ({
        date,
        count: events.length,
        events,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [confirmedEvents]);

  const weeklyStats = useMemo(() => {
    const weeklyMap = new Map<string, AggregationData>();
    
    confirmedEvents.forEach((event) => {
      const dateTime = event.start.dateTime;
      if (!dateTime) return;
      
      const date = new Date(dateTime);
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay()); // Start on Sunday
      const weekKey = startOfWeek.toISOString().slice(0, 10);
      
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
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [confirmedEvents]);

  const monthlyStats = useMemo(() => {
    const monthlyMap = new Map<string, AggregationData>();
    
    confirmedEvents.forEach((event) => {
      const dateTime = event.start.dateTime;
      if (!dateTime) return;
      
      const date = new Date(dateTime);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
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
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [confirmedEvents]);

  return {
    dailyStats,
    weeklyStats,
    monthlyStats,
  };
};
