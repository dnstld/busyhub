import { useMemo } from 'react';
import { SanitizedEvent } from '../useEvents/useEventsSanitization';

export interface GridCell {
  date: Date;
  dateKey: string;
  events: SanitizedEvent[];
  eventCount: number;
  isCurrentYear: boolean;
}

/**
 * Build the full contribution-style calendar grid (weeks × days)
 * for a given `year` and a map of daily events.
 *
 * @param dailyEvents Map keyed by "YYYY-MM-DD" → array of events
 * @param year        Target calendar year (local time)
 */
export const useEventsGrid = (
  dailyEvents: Map<string, SanitizedEvent[]>,
  year: number,
) => {
  return useMemo(() => {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    // Grid must start on Sunday and end on Saturday.
    const firstSunday = new Date(startDate);
    firstSunday.setDate(startDate.getDate() - startDate.getDay());

    const lastSaturday = new Date(endDate);
    lastSaturday.setDate(endDate.getDate() + (6 - endDate.getDay()));

    const weeks: GridCell[][] = [];
    const cursor = new Date(firstSunday);

    const getDateKey = (d: Date): string => {
      const y  = d.getFullYear();
      const m  = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${dd}`;
    };

    while (cursor <= lastSaturday) {
      const week: GridCell[] = [];

      for (let i = 0; i < 7; i++) {
        const dateCopy = new Date(cursor);
        const key      = getDateKey(dateCopy);
        const events   = dailyEvents.get(key) ?? [];

        week.push({
          date: dateCopy,
          dateKey: key,
          events,
          eventCount: events.length,
          isCurrentYear: dateCopy.getFullYear() === year,
        });

        cursor.setDate(cursor.getDate() + 1);
      }

      weeks.push(week);
    }

    return weeks;
  }, [dailyEvents, year]);
};
