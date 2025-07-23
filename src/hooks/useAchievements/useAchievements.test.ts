import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SanitizedEvent } from '../useEvents/useEventsSanitization';
import { useAchievements } from './index';

interface UseAchievementsProps {
  dailyEvents: Map<string, SanitizedEvent[]>;
  totalEvents: number;
  totalWeekdays: number;
}

// Helper function to create mock events
const createMockEvent = (id: string): SanitizedEvent => ({
  id,
  status: 'confirmed',
  start: {
    dateTime: '2024-01-01T10:00:00Z',
    timeZone: 'UTC',
  },
  end: {
    dateTime: '2024-01-01T11:00:00Z',
    timeZone: 'UTC',
  },
  attendees: [],
  eventType: 'work',
});

// Helper function to create daily events map
const createDailyEventsMap = (eventCounts: { [date: string]: number }): Map<string, SanitizedEvent[]> => {
  const map = new Map<string, SanitizedEvent[]>();
  
  Object.entries(eventCounts).forEach(([date, count]) => {
    const events = Array.from({ length: count }, (_, i) => 
      createMockEvent(`${date}-event-${i}`)
    );
    map.set(date, events);
  });
  
  return map;
};

describe('useAchievements', () => {
  describe('Achievement Logic', () => {
    it('should always return welcome achievement as true', () => {
      const dailyEvents = createDailyEventsMap({});
      
      const { result } = renderHook(() =>
        useAchievements({
          dailyEvents,
          totalEvents: 0,
          totalWeekdays: 250,
        })
      );

      expect(result.current.welcome).toBe(true);
    });

    it('should return beginner achievement when 50+ days have 2+ events', () => {
      // Create 50 days with 2 events each
      const eventCounts: { [date: string]: number } = {};
      for (let i = 1; i <= 50; i++) {
        const date = `2024-01-${String(i).padStart(2, '0')}`;
        eventCounts[date] = 2;
      }
      
      const dailyEvents = createDailyEventsMap(eventCounts);
      
      const { result } = renderHook(() =>
        useAchievements({
          dailyEvents,
          totalEvents: 100,
          totalWeekdays: 250,
        })
      );

      expect(result.current.beginner).toBe(true);
    });

    it('should not return beginner achievement when less than 50 days have 2+ events', () => {
      // Create 49 days with 2 events each
      const eventCounts: { [date: string]: number } = {};
      for (let i = 1; i <= 49; i++) {
        const date = `2024-01-${String(i).padStart(2, '0')}`;
        eventCounts[date] = 2;
      }
      
      const dailyEvents = createDailyEventsMap(eventCounts);
      
      const { result } = renderHook(() =>
        useAchievements({
          dailyEvents,
          totalEvents: 98,
          totalWeekdays: 250,
        })
      );

      expect(result.current.beginner).toBe(false);
    });

    it('should return onFire achievement when having 10+ day streak of 3+ events AND 100+ days with 2+ events', () => {
      const eventCounts: { [date: string]: number } = {};
      
      // Create 100 days with 2+ events for the base requirement
      for (let i = 1; i <= 100; i++) {
        const date = `2024-01-${String(i).padStart(2, '0')}`;
        eventCounts[date] = 2;
      }
      
      // Create a 10-day streak with 3+ events (overwriting some of the above)
      for (let i = 1; i <= 10; i++) {
        const date = `2024-01-${String(i).padStart(2, '0')}`;
        eventCounts[date] = 3;
      }
      
      const dailyEvents = createDailyEventsMap(eventCounts);
      
      const { result } = renderHook(() =>
        useAchievements({
          dailyEvents,
          totalEvents: 230,
          totalWeekdays: 250,
        })
      );

      expect(result.current.onFire).toBe(true);
    });

    it('should not return onFire achievement when having streak but not enough 2+ event days', () => {
      const eventCounts: { [date: string]: number } = {};
      
      // Create only 50 days with 2+ events (not enough for onFire)
      for (let i = 1; i <= 50; i++) {
        const date = `2024-01-${String(i).padStart(2, '0')}`;
        eventCounts[date] = 3; // 3+ events, so this also creates the streak
      }
      
      const dailyEvents = createDailyEventsMap(eventCounts);
      
      const { result } = renderHook(() =>
        useAchievements({
          dailyEvents,
          totalEvents: 150,
          totalWeekdays: 250,
        })
      );

      expect(result.current.onFire).toBe(false);
    });

    it('should not return onFire achievement when having enough 2+ days but no 10+ streak', () => {
      const eventCounts: { [date: string]: number } = {};
      
      // Create 100 days with 2+ events but break the streak
      for (let i = 1; i <= 100; i++) {
        const date = `2024-01-${String(i).padStart(2, '0')}`;
        // Break streak every 5 days by having only 1 event
        eventCounts[date] = i % 5 === 0 ? 1 : 3;
      }
      
      const dailyEvents = createDailyEventsMap(eventCounts);
      
      const { result } = renderHook(() =>
        useAchievements({
          dailyEvents,
          totalEvents: 260,
          totalWeekdays: 250,
        })
      );

      expect(result.current.onFire).toBe(false);
    });

    it('should return king achievement when having 200+ days with 2+ events AND 50+ days with 4+ events', () => {
      const eventCounts: { [date: string]: number } = {};
      
      // Create 200 days with 2+ events
      for (let i = 1; i <= 200; i++) {
        const date = `2024-${String(Math.ceil(i / 31)).padStart(2, '0')}-${String((i % 31) + 1).padStart(2, '0')}`;
        eventCounts[date] = 2;
      }
      
      // Create 50 days with 4+ events (overwriting some of the above)
      for (let i = 1; i <= 50; i++) {
        const date = `2024-${String(Math.ceil(i / 31)).padStart(2, '0')}-${String((i % 31) + 1).padStart(2, '0')}`;
        eventCounts[date] = 4;
      }
      
      const dailyEvents = createDailyEventsMap(eventCounts);
      
      const { result } = renderHook(() =>
        useAchievements({
          dailyEvents,
          totalEvents: 500,
          totalWeekdays: 250,
        })
      );

      expect(result.current.king).toBe(true);
    });

    it('should not return king achievement when not meeting both requirements', () => {
      const eventCounts: { [date: string]: number } = {};
      
      // Create only 100 days with 2+ events (not enough for king)
      for (let i = 1; i <= 100; i++) {
        const date = `2024-01-${String(i).padStart(2, '0')}`;
        eventCounts[date] = 4; // Even with 4+ events, still not enough days
      }
      
      const dailyEvents = createDailyEventsMap(eventCounts);
      
      const { result } = renderHook(() =>
        useAchievements({
          dailyEvents,
          totalEvents: 400,
          totalWeekdays: 250,
        })
      );

      expect(result.current.king).toBe(false);
    });
  });

  describe('Streak Detection', () => {
    it('should detect consecutive streaks correctly', () => {
      const eventCounts: { [date: string]: number } = {};
      
      // Create a 15-day consecutive streak
      for (let i = 1; i <= 15; i++) {
        const date = `2024-01-${String(i).padStart(2, '0')}`;
        eventCounts[date] = 3;
      }
      
      // Add some days with fewer events to ensure streak is broken
      eventCounts['2024-01-16'] = 1;
      eventCounts['2024-01-17'] = 1;
      
      // Add more days with 2+ events to meet the 100 day requirement
      for (let i = 18; i <= 117; i++) {
        const date = `2024-01-${String(i).padStart(2, '0')}`;
        eventCounts[date] = 2;
      }
      
      const dailyEvents = createDailyEventsMap(eventCounts);
      
      const { result } = renderHook(() =>
        useAchievements({
          dailyEvents,
          totalEvents: 245,
          totalWeekdays: 250,
        })
      );

      expect(result.current.onFire).toBe(true);
    });

    it('should reset streak when encountering insufficient events', () => {
      const eventCounts: { [date: string]: number } = {};
      
      // Create pattern: 5 days with 3+ events, 1 day with 1 event, repeat
      for (let cycle = 0; cycle < 20; cycle++) {
        for (let day = 0; day < 5; day++) {
          const dayNum = cycle * 6 + day + 1;
          if (dayNum <= 120) {
            const date = `2024-${String(Math.ceil(dayNum / 31)).padStart(2, '0')}-${String((dayNum % 31) + 1).padStart(2, '0')}`;
            eventCounts[date] = 3;
          }
        }
        // Break streak with low event day
        const breakDay = cycle * 6 + 6;
        if (breakDay <= 120) {
          const date = `2024-${String(Math.ceil(breakDay / 31)).padStart(2, '0')}-${String((breakDay % 31) + 1).padStart(2, '0')}`;
          eventCounts[date] = 1;
        }
      }
      
      const dailyEvents = createDailyEventsMap(eventCounts);
      
      const { result } = renderHook(() =>
        useAchievements({
          dailyEvents,
          totalEvents: 300,
          totalWeekdays: 250,
        })
      );

      // Should not get onFire because maximum streak is only 5 days
      expect(result.current.onFire).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty daily events map', () => {
      const dailyEvents = new Map<string, SanitizedEvent[]>();
      
      const { result } = renderHook(() =>
        useAchievements({
          dailyEvents,
          totalEvents: 0,
          totalWeekdays: 250,
        })
      );

      expect(result.current).toEqual({
        welcome: true,
        beginner: false,
        onFire: false,
        king: false,
      });
    });

    it('should handle days with exactly the threshold number of events', () => {
      const eventCounts: { [date: string]: number } = {};
      
      // Create exactly 50 days with exactly 2 events
      for (let i = 1; i <= 50; i++) {
        const date = `2024-01-${String(i).padStart(2, '0')}`;
        eventCounts[date] = 2;
      }
      
      const dailyEvents = createDailyEventsMap(eventCounts);
      
      const { result } = renderHook(() =>
        useAchievements({
          dailyEvents,
          totalEvents: 100,
          totalWeekdays: 250,
        })
      );

      expect(result.current.beginner).toBe(true);
    });

    it('should handle unsorted date keys correctly', () => {
      // Create dates in random order to test sorting
      const eventCounts: { [date: string]: number } = {
        '2024-01-15': 3,
        '2024-01-01': 3,
        '2024-01-10': 3,
        '2024-01-05': 3,
        '2024-01-20': 3,
      };
      
      // Add more days to meet requirements
      for (let i = 2; i <= 4; i++) {
        eventCounts[`2024-01-${String(i).padStart(2, '0')}`] = 3;
      }
      for (let i = 6; i <= 9; i++) {
        eventCounts[`2024-01-${String(i).padStart(2, '0')}`] = 3;
      }
      for (let i = 11; i <= 14; i++) {
        eventCounts[`2024-01-${String(i).padStart(2, '0')}`] = 3;
      }
      for (let i = 16; i <= 19; i++) {
        eventCounts[`2024-01-${String(i).padStart(2, '0')}`] = 3;
      }
      
      // Add more days with 2+ events to meet the 100 day requirement
      for (let i = 21; i <= 120; i++) {
        const date = `2024-${String(Math.ceil(i / 31)).padStart(2, '0')}-${String((i % 31) + 1).padStart(2, '0')}`;
        eventCounts[date] = 2;
      }
      
      const dailyEvents = createDailyEventsMap(eventCounts);
      
      const { result } = renderHook(() =>
        useAchievements({
          dailyEvents,
          totalEvents: 280,
          totalWeekdays: 250,
        })
      );

      // Should detect the 20-day streak (Jan 1-20) despite unsorted input
      expect(result.current.onFire).toBe(true);
    });
  });

  describe('Memoization', () => {
    it('should memoize results when dailyEvents reference stays the same', () => {
      const dailyEvents = createDailyEventsMap({
        '2024-01-01': 2,
        '2024-01-02': 2,
      });
      
      const { result, rerender } = renderHook((props: UseAchievementsProps) =>
        useAchievements(props), {
        initialProps: {
          dailyEvents,
          totalEvents: 4,
          totalWeekdays: 250,
        }
      });

      const firstResult = result.current;
      
      // Rerender with same props
      rerender({
        dailyEvents,
        totalEvents: 4,
        totalWeekdays: 250,
      });

      // Should be the same object reference due to memoization
      expect(result.current).toBe(firstResult);
    });

    it('should recalculate when dailyEvents changes', () => {
      const initialDailyEvents = createDailyEventsMap({
        '2024-01-01': 1,
      });
      
      const { result, rerender } = renderHook((props: UseAchievementsProps) =>
        useAchievements(props), {
        initialProps: {
          dailyEvents: initialDailyEvents,
          totalEvents: 1,
          totalWeekdays: 250,
        }
      });

      expect(result.current.beginner).toBe(false);
      
      // Create new map with enough events for beginner achievement
      const eventCounts: { [date: string]: number } = {};
      for (let i = 1; i <= 50; i++) {
        const date = `2024-01-${String(i).padStart(2, '0')}`;
        eventCounts[date] = 2;
      }
      const newDailyEvents = createDailyEventsMap(eventCounts);
      
      rerender({
        dailyEvents: newDailyEvents,
        totalEvents: 100,
        totalWeekdays: 250,
      });

      expect(result.current.beginner).toBe(true);
    });
  });
});
