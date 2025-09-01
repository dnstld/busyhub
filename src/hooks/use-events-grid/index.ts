import { useMemo } from 'react';
import { SanitizedEvent } from '../use-events/useEventsSanitization';

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
export const useEventsGrid = (dailyEvents: Map<string, SanitizedEvent[]>, year: number) => {
  return useMemo(() => {
    // Inline getDateKey function to ensure memoization stability
    const getDateKey = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Get the first day of the year (can be any weekday)
    const firstOfYear = new Date(year, 0, 1);
    
    // Find the first Sunday on or before the first day of the year
    const firstSunday = new Date(firstOfYear);
    firstSunday.setDate(firstOfYear.getDate() - firstOfYear.getDay());

    const weeks: GridCell[][] = [];
    const cursor = new Date(firstSunday);

    // Keep adding weeks until we've covered the entire year plus any extra days
    // to fill the last week
    while (weeks.length === 0 || (weeks.length < 53 && 
           (cursor.getFullYear() === year || weeks[weeks.length - 1].some(cell => cell.isCurrentYear)))) {
      const week: GridCell[] = [];
      
      for (let day = 0; day < 7; day++) {
        const dateCopy = new Date(cursor);
        const key = getDateKey(dateCopy);
        const events   = dailyEvents.get(key) ?? [];

        week.push({
          date: dateCopy,
          dateKey: key,
          events,
          eventCount: events.length,
          isCurrentYear: dateCopy.getFullYear() === year, // Use the target year parameter
        });

        cursor.setDate(cursor.getDate() + 1);
      }

      weeks.push(week);
    }

    return weeks;
  }, [dailyEvents, year]);
};
