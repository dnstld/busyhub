import { useDate } from '@/hooks/use-date';
import { SanitizedEvent } from '@/hooks/use-events/useEventsSanitization';
import { createSafeDate, isNonEmptyString, isValidDate } from '@/utils';
import { useMemo } from 'react';

export interface WeekdayStats {
  dayName: string;
  dayIndex: number;
  count: number;
  events: SanitizedEvent[];
}

/**
 * Aggregates events by weekday (Monday through Sunday)
 * Filters events to current year only
 */
export const useWeekdayStats = (confirmedEvents: SanitizedEvent[]) => {
  const { isCurrentYear } = useDate();

  return useMemo(() => {
    const weekdayMap = new Map<number, SanitizedEvent[]>();
    
    // Initialize all weekdays
    for (let i = 0; i < 7; i++) {
      weekdayMap.set(i, []);
    }

    // Process events for current year only
    confirmedEvents.forEach((event) => {
      const dateTime = event.start.dateTime;
      if (!isNonEmptyString(dateTime)) return;
      
      const date = createSafeDate(dateTime);
      if (!isValidDate(date)) return;
      
      // Filter to current year only
      if (!isCurrentYear(date)) return;
      
      const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const events = weekdayMap.get(dayOfWeek);
      if (events) {
        events.push(event);
      }
    });

    // Convert to array with proper day names
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    return Array.from(weekdayMap.entries())
      .map(([dayIndex, events]) => ({
        dayName: dayNames[dayIndex],
        dayIndex,
        count: events.length,
        events,
      }))
      .sort((a, b) => {
        // Sort Monday first (1), then Tuesday (2), ..., Sunday (0) last
        const aSort = a.dayIndex === 0 ? 7 : a.dayIndex;
        const bSort = b.dayIndex === 0 ? 7 : b.dayIndex;
        return aSort - bSort;
      });
  }, [confirmedEvents, isCurrentYear]);
};
