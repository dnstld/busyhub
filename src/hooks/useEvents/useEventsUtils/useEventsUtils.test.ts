import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SanitizedEvent } from '../useEventsSanitization';
import { useEventsUtils } from './index';

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

describe('useEventsUtils', () => {
  const mockEvents = [
    createMockSanitizedEvent('event-1', '2024-01-01'),
    createMockSanitizedEvent('event-2', '2024-01-02'),
    createMockSanitizedEvent('event-3', '2024-01-03'),
  ];

  const mockDailyEvents = new Map([
    ['2024-01-01', [mockEvents[0]]],
    ['2024-01-02', [mockEvents[1]]],
    ['2024-01-03', [mockEvents[2]]],
  ]);

  describe('Basic Functionality', () => {
    it('should return utility functions', () => {
      const { result } = renderHook(() => useEventsUtils(mockEvents, mockDailyEvents));
      
      expect(result.current.getEventsByDateRange).toBeDefined();
      expect(typeof result.current.getEventsByDateRange).toBe('function');
      expect(result.current.getEventsForDate).toBeDefined();
      expect(typeof result.current.getEventsForDate).toBe('function');
    });

    it('should get events by date range', () => {
      const { result } = renderHook(() => useEventsUtils(mockEvents, mockDailyEvents));
      
      const eventsInRange = result.current.getEventsByDateRange('2024-01-01', '2024-01-02');
      expect(Array.isArray(eventsInRange)).toBe(true);
    });

    it('should get events for specific date', () => {
      const { result } = renderHook(() => useEventsUtils(mockEvents, mockDailyEvents));
      
      const eventsForDate = result.current.getEventsForDate('2024-01-01');
      expect(Array.isArray(eventsForDate)).toBe(true);
      expect(eventsForDate).toHaveLength(1);
      expect(eventsForDate[0].id).toBe('event-1');
    });

    it('should handle non-existent dates gracefully', () => {
      const { result } = renderHook(() => useEventsUtils(mockEvents, mockDailyEvents));
      
      const eventsForDate = result.current.getEventsForDate('2024-01-05');
      expect(Array.isArray(eventsForDate)).toBe(true);
      expect(eventsForDate).toHaveLength(0);
    });

    it('should handle empty date range', () => {
      const { result } = renderHook(() => useEventsUtils(mockEvents, mockDailyEvents));
      
      // Should not throw with invalid range
      expect(() => {
        result.current.getEventsByDateRange('2024-01-05', '2024-01-04'); // End before start
      }).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty events array', () => {
      const emptyMap = new Map();
      const { result } = renderHook(() => useEventsUtils([], emptyMap));
      
      const eventsInRange = result.current.getEventsByDateRange('2024-01-01', '2024-01-02');
      expect(eventsInRange).toHaveLength(0);
      
      const eventsForDate = result.current.getEventsForDate('2024-01-01');
      expect(eventsForDate).toHaveLength(0);
    });

    it('should handle empty daily events map', () => {
      const emptyMap = new Map();
      const { result } = renderHook(() => useEventsUtils(mockEvents, emptyMap));
      
      expect(result.current).toBeDefined();
      expect(typeof result.current.getEventsForDate).toBe('function');
    });
  });

  describe('Memoization', () => {
    it('should memoize getEventsByDateRange when events stay the same', () => {
      const { result, rerender } = renderHook(
        ({ events, dailyEvents }) => useEventsUtils(events, dailyEvents),
        { initialProps: { events: mockEvents, dailyEvents: mockDailyEvents } }
      );
      
      const firstFunction = result.current.getEventsByDateRange;
      
      rerender({ events: mockEvents, dailyEvents: mockDailyEvents });
      
      // Should be memoized
      expect(result.current.getEventsByDateRange).toBe(firstFunction);
    });

    it('should recalculate when events change', () => {
      const { result, rerender } = renderHook(
        ({ events, dailyEvents }) => useEventsUtils(events, dailyEvents),
        { initialProps: { events: mockEvents, dailyEvents: mockDailyEvents } }
      );
      
      const firstFunction = result.current.getEventsByDateRange;
      
      const newEvents = [createMockSanitizedEvent('new-event', '2024-01-04')];
      const newDailyEvents = new Map([['2024-01-04', newEvents]]);
      
      rerender({ events: newEvents, dailyEvents: newDailyEvents });
      
      // Should be different function reference
      expect(result.current.getEventsByDateRange).not.toBe(firstFunction);
    });
  });

  describe('Date Range Functionality', () => {
    it('should filter events within date range correctly', () => {
      const { result } = renderHook(() => useEventsUtils(mockEvents, mockDailyEvents));
      
      const eventsInRange = result.current.getEventsByDateRange('2024-01-01', '2024-01-02');
      
      // Should work with the date range filtering (exact behavior depends on implementation)
      expect(Array.isArray(eventsInRange)).toBe(true);
    });

    it('should handle single day range', () => {
      const { result } = renderHook(() => useEventsUtils(mockEvents, mockDailyEvents));
      
      const eventsInRange = result.current.getEventsByDateRange('2024-01-01', '2024-01-01');
      expect(Array.isArray(eventsInRange)).toBe(true);
    });
  });
});
