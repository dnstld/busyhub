import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SanitizedEvent } from '../useEvents/useEventsSanitization';
import { useEventsGrid } from './index';

// Helper function to create mock events
const createMockEvent = (id: string, date?: string): SanitizedEvent => ({
  id,
  status: 'confirmed',
  start: {
    dateTime: date ? `${date}T10:00:00Z` : '2024-01-01T10:00:00Z',
    timeZone: 'UTC',
  },
  end: {
    dateTime: date ? `${date}T11:00:00Z` : '2024-01-01T11:00:00Z',
    timeZone: 'UTC',
  },
  attendees: [],
  eventType: 'work',
});

// Helper function to create daily events map
const createDailyEventsMap = (eventData: { [date: string]: number }): Map<string, SanitizedEvent[]> => {
  const map = new Map<string, SanitizedEvent[]>();
  
  Object.entries(eventData).forEach(([date, count]) => {
    const events = Array.from({ length: count }, (_, i) =>
      createMockEvent(`${date}-event-${i}`, date)
    );
    map.set(date, events);
  });
  
  return map;
};

describe('useEventsGrid', () => {
  describe('Grid Structure', () => {
    it('should create a full year grid starting from first Sunday', () => {
      const dailyEvents = new Map<string, SanitizedEvent[]>();
      
      const { result } = renderHook(() => useEventsGrid(dailyEvents, 2024));
      
      const weeks = result.current;
      
      // Should have 53 weeks for 2024 (starts on Monday, so first week includes some Dec 2023 days)
      expect(weeks).toHaveLength(53);
      
      // Each week should have exactly 7 days
      weeks.forEach(week => {
        expect(week).toHaveLength(7);
      });
      
      // First day should be a Sunday
      const firstDay = weeks[0][0];
      expect(firstDay.date.getDay()).toBe(0); // Sunday = 0
      
      // Last day should be a Saturday
      const lastWeek = weeks[weeks.length - 1];
      const lastDay = lastWeek[6];
      expect(lastDay.date.getDay()).toBe(6); // Saturday = 6
    });

    it('should correctly identify days that belong to the target year', () => {
      const dailyEvents = new Map<string, SanitizedEvent[]>();
      
      const { result } = renderHook(() => useEventsGrid(dailyEvents, 2024));
      
      const weeks = result.current;
      
      // Find cells from the target year
      const targetYearCells = weeks.flat().filter(cell => cell.isCurrentYear);
      const nonTargetYearCells = weeks.flat().filter(cell => !cell.isCurrentYear);
      
      // Should have exactly 366 days for 2024 (leap year)
      expect(targetYearCells).toHaveLength(366);
      
      // All target year cells should have year 2024
      targetYearCells.forEach(cell => {
        expect(cell.date.getFullYear()).toBe(2024);
        expect(cell.isCurrentYear).toBe(true);
      });
      
      // Non-target year cells should not be from 2024
      nonTargetYearCells.forEach(cell => {
        expect(cell.date.getFullYear()).not.toBe(2024);
        expect(cell.isCurrentYear).toBe(false);
      });
    });

    it('should handle non-leap year correctly (2023)', () => {
      const dailyEvents = new Map<string, SanitizedEvent[]>();
      
      const { result } = renderHook(() => useEventsGrid(dailyEvents, 2023));
      
      const weeks = result.current;
      const targetYearCells = weeks.flat().filter(cell => cell.isCurrentYear);
      
      // Should have exactly 365 days for 2023 (non-leap year)
      expect(targetYearCells).toHaveLength(365);
    });

    it('should format date keys correctly', () => {
      const dailyEvents = new Map<string, SanitizedEvent[]>();
      
      const { result } = renderHook(() => useEventsGrid(dailyEvents, 2024));
      
      const weeks = result.current;
      const firstTargetYearCell = weeks.flat().find(cell => cell.isCurrentYear);
      
      // Should format as YYYY-MM-DD
      expect(firstTargetYearCell?.dateKey).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(firstTargetYearCell?.dateKey).toBe('2024-01-01');
    });
  });

  describe('Event Integration', () => {
    it('should include events from dailyEvents map', () => {
      const dailyEvents = createDailyEventsMap({
        '2024-01-01': 2,
        '2024-01-15': 3,
        '2024-06-15': 1,
      });
      
      const { result } = renderHook(() => useEventsGrid(dailyEvents, 2024));
      
      const weeks = result.current;
      const allCells = weeks.flat();
      
      // Find specific cells
      const jan1Cell = allCells.find(cell => cell.dateKey === '2024-01-01');
      const jan15Cell = allCells.find(cell => cell.dateKey === '2024-01-15');
      const jun15Cell = allCells.find(cell => cell.dateKey === '2024-06-15');
      
      expect(jan1Cell?.eventCount).toBe(2);
      expect(jan1Cell?.events).toHaveLength(2);
      
      expect(jan15Cell?.eventCount).toBe(3);
      expect(jan15Cell?.events).toHaveLength(3);
      
      expect(jun15Cell?.eventCount).toBe(1);
      expect(jun15Cell?.events).toHaveLength(1);
    });

    it('should handle days with no events', () => {
      const dailyEvents = createDailyEventsMap({
        '2024-01-01': 2,
      });
      
      const { result } = renderHook(() => useEventsGrid(dailyEvents, 2024));
      
      const weeks = result.current;
      const allCells = weeks.flat();
      
      // Find a day with no events
      const jan2Cell = allCells.find(cell => cell.dateKey === '2024-01-02');
      
      expect(jan2Cell?.eventCount).toBe(0);
      expect(jan2Cell?.events).toHaveLength(0);
      expect(jan2Cell?.events).toEqual([]);
    });

    it('should preserve event data integrity', () => {
      const mockEvent = createMockEvent('test-event-1', '2024-03-15');
      const dailyEvents = new Map<string, SanitizedEvent[]>();
      dailyEvents.set('2024-03-15', [mockEvent]);
      
      const { result } = renderHook(() => useEventsGrid(dailyEvents, 2024));
      
      const weeks = result.current;
      const allCells = weeks.flat();
      const mar15Cell = allCells.find(cell => cell.dateKey === '2024-03-15');
      
      expect(mar15Cell?.events[0]).toEqual(mockEvent);
      expect(mar15Cell?.events[0].id).toBe('test-event-1');
    });
  });

  describe('Date Calculations', () => {
    it('should handle year boundaries correctly', () => {
      const dailyEvents = new Map<string, SanitizedEvent[]>();
      
      const { result } = renderHook(() => useEventsGrid(dailyEvents, 2024));
      
      const weeks = result.current;
      const allCells = weeks.flat();
      
      // Check that January 1st is included
      const jan1Cell = allCells.find(cell => cell.dateKey === '2024-01-01');
      expect(jan1Cell).toBeDefined();
      expect(jan1Cell?.isCurrentYear).toBe(true);
      
      // Check that December 31st is included
      const dec31Cell = allCells.find(cell => cell.dateKey === '2024-12-31');
      expect(dec31Cell).toBeDefined();
      expect(dec31Cell?.isCurrentYear).toBe(true);
    });

    it('should include padding days from previous/next year', () => {
      const dailyEvents = new Map<string, SanitizedEvent[]>();
      
      const { result } = renderHook(() => useEventsGrid(dailyEvents, 2024));
      
      const weeks = result.current;
      const allCells = weeks.flat();
      
      // Should include some December 2023 days at the beginning
      const dec2023Cells = allCells.filter(cell => 
        cell.date.getFullYear() === 2023 && cell.date.getMonth() === 11
      );
      expect(dec2023Cells.length).toBeGreaterThan(0);
      
      // Should include some January 2025 days at the end
      const jan2025Cells = allCells.filter(cell => 
        cell.date.getFullYear() === 2025 && cell.date.getMonth() === 0
      );
      expect(jan2025Cells.length).toBeGreaterThan(0);
    });

    it('should maintain chronological order', () => {
      const dailyEvents = new Map<string, SanitizedEvent[]>();
      
      const { result } = renderHook(() => useEventsGrid(dailyEvents, 2024));
      
      const weeks = result.current;
      const allCells = weeks.flat();
      
      // Check that dates are in ascending order
      for (let i = 1; i < allCells.length; i++) {
        const prevDate = allCells[i - 1].date;
        const currDate = allCells[i].date;
        expect(currDate.getTime()).toBeGreaterThan(prevDate.getTime());
      }
    });
  });

  describe('Memoization', () => {
    it('should memoize results when inputs stay the same', () => {
      const dailyEvents = createDailyEventsMap({
        '2024-01-01': 1,
      });
      
      const { result, rerender } = renderHook(
        ({ events, year }) => useEventsGrid(events, year),
        {
          initialProps: { events: dailyEvents, year: 2024 }
        }
      );
      
      const firstResult = result.current;
      
      // Rerender with same props
      rerender({ events: dailyEvents, year: 2024 });
      
      // Should be the same object reference due to memoization
      expect(result.current).toBe(firstResult);
    });

    it('should recalculate when dailyEvents changes', () => {
      const initialEvents = createDailyEventsMap({
        '2024-01-01': 1,
      });
      
      const { result, rerender } = renderHook(
        ({ events, year }) => useEventsGrid(events, year),
        {
          initialProps: { events: initialEvents, year: 2024 }
        }
      );
      
      const firstResult = result.current;
      const firstJan1Cell = firstResult.flat().find(cell => cell.dateKey === '2024-01-01');
      expect(firstJan1Cell?.eventCount).toBe(1);
      
      // Create new events map
      const newEvents = createDailyEventsMap({
        '2024-01-01': 3,
      });
      
      rerender({ events: newEvents, year: 2024 });
      
      // Should recalculate
      expect(result.current).not.toBe(firstResult);
      const newJan1Cell = result.current.flat().find(cell => cell.dateKey === '2024-01-01');
      expect(newJan1Cell?.eventCount).toBe(3);
    });

    it('should recalculate when year changes', () => {
      const dailyEvents = createDailyEventsMap({
        '2024-01-01': 1,
        '2023-01-01': 2,
      });
      
      const { result, rerender } = renderHook(
        ({ events, year }) => useEventsGrid(events, year),
        {
          initialProps: { events: dailyEvents, year: 2024 }
        }
      );
      
      const firstResult = result.current;
      const targetYearCells2024 = firstResult.flat().filter(cell => cell.isCurrentYear);
      expect(targetYearCells2024).toHaveLength(366); // 2024 is leap year
      
      rerender({ events: dailyEvents, year: 2023 });
      
      // Should recalculate for different year
      expect(result.current).not.toBe(firstResult);
      const targetYearCells2023 = result.current.flat().filter(cell => cell.isCurrentYear);
      expect(targetYearCells2023).toHaveLength(365); // 2023 is not leap year
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty dailyEvents map', () => {
      const dailyEvents = new Map<string, SanitizedEvent[]>();
      
      const { result } = renderHook(() => useEventsGrid(dailyEvents, 2024));
      
      const weeks = result.current;
      const allCells = weeks.flat();
      
      // All cells should have 0 events
      allCells.forEach(cell => {
        expect(cell.eventCount).toBe(0);
        expect(cell.events).toEqual([]);
      });
    });

    it('should handle leap year February correctly', () => {
      const dailyEvents = createDailyEventsMap({
        '2024-02-29': 1, // Leap day
      });
      
      const { result } = renderHook(() => useEventsGrid(dailyEvents, 2024));
      
      const weeks = result.current;
      const allCells = weeks.flat();
      
      // Should include February 29th for leap year
      const feb29Cell = allCells.find(cell => cell.dateKey === '2024-02-29');
      expect(feb29Cell).toBeDefined();
      expect(feb29Cell?.isCurrentYear).toBe(true);
      expect(feb29Cell?.eventCount).toBe(1);
    });

    it('should handle non-leap year February correctly', () => {
      const dailyEvents = new Map<string, SanitizedEvent[]>();
      
      const { result } = renderHook(() => useEventsGrid(dailyEvents, 2023));
      
      const weeks = result.current;
      const allCells = weeks.flat();
      
      // Should not include February 29th for non-leap year
      const feb29Cell = allCells.find(cell => cell.dateKey === '2023-02-29');
      expect(feb29Cell).toBeUndefined();
      
      // But should include February 28th
      const feb28Cell = allCells.find(cell => cell.dateKey === '2023-02-28');
      expect(feb28Cell).toBeDefined();
      expect(feb28Cell?.isCurrentYear).toBe(true);
    });
  });
});
