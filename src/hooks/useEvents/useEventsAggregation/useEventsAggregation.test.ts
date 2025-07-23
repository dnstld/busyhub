import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SanitizedEvent } from '../useEventsSanitization';
import { useEventsAggregation } from './index';

// Helper to create mock sanitized events
const createMockSanitizedEvent = (id: string, date: string): SanitizedEvent => ({
  id,
  status: 'confirmed',
  start: {
    dateTime: `${date}T10:00:00Z`,
    timeZone: 'UTC',
  },
  end: {
    dateTime: `${date}T11:00:00Z`,
    timeZone: 'UTC',
  },
  attendees: [],
  eventType: 'work',
});

describe('useEventsAggregation', () => {
  describe('Basic Aggregation', () => {
    it('should aggregate events into daily, weekly, and monthly stats', () => {
      const events = [
        createMockSanitizedEvent('event-1', '2024-01-01'),
        createMockSanitizedEvent('event-2', '2024-01-01'),
        createMockSanitizedEvent('event-3', '2024-01-02'),
      ];
      
      const { result } = renderHook(() => useEventsAggregation(events));
      
      expect(result.current.dailyStats).toBeDefined();
      expect(result.current.weeklyStats).toBeDefined();
      expect(result.current.monthlyStats).toBeDefined();
      expect(Array.isArray(result.current.dailyStats)).toBe(true);
    });

    it('should handle empty events array', () => {
      const { result } = renderHook(() => useEventsAggregation([]));
      
      expect(result.current.dailyStats).toEqual([]);
      expect(result.current.weeklyStats).toEqual([]);
      expect(result.current.monthlyStats).toEqual([]);
    });

    it('should sort stats by date', () => {
      const events = [
        createMockSanitizedEvent('event-1', '2024-01-03'),
        createMockSanitizedEvent('event-2', '2024-01-01'),
        createMockSanitizedEvent('event-3', '2024-01-02'),
      ];
      
      const { result } = renderHook(() => useEventsAggregation(events));
      
      const { dailyStats } = result.current;
      
      // Should be sorted by date
      if (dailyStats.length > 1) {
        expect(dailyStats[0].date <= dailyStats[1].date).toBe(true);
      }
    });

    it('should group events correctly by date', () => {
      const events = [
        createMockSanitizedEvent('event-1', '2024-01-01'),
        createMockSanitizedEvent('event-2', '2024-01-01'),
        createMockSanitizedEvent('event-3', '2024-01-02'),
      ];
      
      const { result } = renderHook(() => useEventsAggregation(events));
      
      const { dailyStats } = result.current;
      
      // Find the stats for 2024-01-01
      const jan1Stats = dailyStats.find(stat => stat.date === '2024-01-01');
      expect(jan1Stats?.count).toBe(2);
      expect(jan1Stats?.events).toHaveLength(2);
      
      // Find the stats for 2024-01-02
      const jan2Stats = dailyStats.find(stat => stat.date === '2024-01-02');
      expect(jan2Stats?.count).toBe(1);
      expect(jan2Stats?.events).toHaveLength(1);
    });
  });

  describe('Event Processing', () => {
    it('should handle events with invalid dates gracefully', () => {
      const validEvent = createMockSanitizedEvent('valid-event', '2024-01-01');
      const invalidEvent: SanitizedEvent = {
        ...validEvent,
        id: 'invalid-event',
        start: { dateTime: 'invalid-date', timeZone: 'UTC' },
      };
      
      const events = [validEvent, invalidEvent];
      
      const { result } = renderHook(() => useEventsAggregation(events));
      
      // Should not crash and should process valid events
      expect(result.current.dailyStats).toBeDefined();
      expect(Array.isArray(result.current.dailyStats)).toBe(true);
    });

    it('should handle events with null dateTime', () => {
      const validEvent = createMockSanitizedEvent('valid-event', '2024-01-01');
      const nullDateEvent: SanitizedEvent = {
        ...validEvent,
        id: 'null-date-event',
        start: { dateTime: null, timeZone: 'UTC' },
      };
      
      const events = [validEvent, nullDateEvent];
      
      const { result } = renderHook(() => useEventsAggregation(events));
      
      // Should process without errors
      expect(result.current.dailyStats).toBeDefined();
    });
  });

  describe('Memoization', () => {
    it('should memoize results when events stay the same', () => {
      const events = [createMockSanitizedEvent('event-1', '2024-01-01')];
      
      const { result, rerender } = renderHook(
        ({ events }) => useEventsAggregation(events),
        { initialProps: { events } }
      );
      
      const firstResult = result.current.dailyStats;
      
      rerender({ events });
      
      expect(result.current.dailyStats).toBe(firstResult);
    });

    it('should recalculate when events change', () => {
      const initialEvents = [createMockSanitizedEvent('event-1', '2024-01-01')];
      
      const { result, rerender } = renderHook(
        ({ events }) => useEventsAggregation(events),
        { initialProps: { events: initialEvents } }
      );
      
      const firstResult = result.current.dailyStats;
      
      const newEvents = [
        createMockSanitizedEvent('event-1', '2024-01-01'),
        createMockSanitizedEvent('event-2', '2024-01-02'),
      ];
      
      rerender({ events: newEvents });
      
      expect(result.current.dailyStats).not.toBe(firstResult);
      expect(result.current.dailyStats.length).toBeGreaterThan(firstResult.length);
    });
  });
});
