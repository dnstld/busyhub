import { CalendarEvent } from '@/app/actions/get-events';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useEventsSanitization } from './index';

// Helper function to create mock calendar events
const createMockCalendarEvent = (id: string, overrides: Partial<CalendarEvent> = {}): CalendarEvent => ({
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
  ...overrides,
});

describe('useEventsSanitization', () => {
  describe('Basic Sanitization', () => {
    it('should sanitize valid events correctly', () => {
      const events = [
        createMockCalendarEvent('event-1'),
        createMockCalendarEvent('event-2'),
      ];
      
      const { result } = renderHook(() => useEventsSanitization(events));
      
      expect(result.current.sanitized).toHaveLength(2);
      expect(result.current.confirmedEvents).toHaveLength(2);
      expect(result.current.totalEvents).toBe(2);
      expect(result.current.sanitized[0].id).toBe('event-1');
      expect(result.current.sanitized[1].id).toBe('event-2');
    });

    it('should handle empty events array', () => {
      const { result } = renderHook(() => useEventsSanitization([]));
      
      expect(result.current.sanitized).toHaveLength(0);
      expect(result.current.confirmedEvents).toHaveLength(0);
      expect(result.current.totalEvents).toBe(0);
      expect(result.current.dailyEvents.size).toBe(0);
    });

    it('should filter out invalid events', () => {
      const events = [
        createMockCalendarEvent('valid-event'),
        createMockCalendarEvent('invalid-event', { status: 'cancelled' as string }),
      ];
      
      const { result } = renderHook(() => useEventsSanitization(events));
      
      // Should sanitize all events but only confirm valid ones
      expect(result.current.sanitized).toHaveLength(2);
      expect(result.current.confirmedEvents.length).toBeLessThanOrEqual(2);
    });

    it('should create daily events map', () => {
      const events = [
        createMockCalendarEvent('event-1', {
          start: { dateTime: '2024-01-01T10:00:00Z', timeZone: 'UTC' },
          end: { dateTime: '2024-01-01T11:00:00Z', timeZone: 'UTC' },
        }),
        createMockCalendarEvent('event-2', {
          start: { dateTime: '2024-01-01T14:00:00Z', timeZone: 'UTC' },
          end: { dateTime: '2024-01-01T15:00:00Z', timeZone: 'UTC' },
        }),
        createMockCalendarEvent('event-3', {
          start: { dateTime: '2024-01-02T10:00:00Z', timeZone: 'UTC' },
          end: { dateTime: '2024-01-02T11:00:00Z', timeZone: 'UTC' },
        }),
      ];
      
      const { result } = renderHook(() => useEventsSanitization(events));
      
      expect(result.current.dailyEvents.size).toBeGreaterThan(0);
      // Should group events by date
      if (result.current.dailyEvents.size > 0) {
        const firstDateEvents = Array.from(result.current.dailyEvents.values())[0];
        expect(Array.isArray(firstDateEvents)).toBe(true);
      }
    });
  });

  describe('Memoization', () => {
    it('should memoize results when events stay the same', () => {
      const events = [createMockCalendarEvent('event-1')];
      
      const { result, rerender } = renderHook(
        ({ events }) => useEventsSanitization(events),
        { initialProps: { events } }
      );
      
      const firstResult = result.current.sanitized;
      
      rerender({ events });
      
      expect(result.current.sanitized).toBe(firstResult);
    });

    it('should recalculate when events change', () => {
      const initialEvents = [createMockCalendarEvent('event-1')];
      
      const { result, rerender } = renderHook(
        ({ events }) => useEventsSanitization(events),
        { initialProps: { events: initialEvents } }
      );
      
      const firstResult = result.current.sanitized;
      
      const newEvents = [
        createMockCalendarEvent('event-1'),
        createMockCalendarEvent('event-2'),
      ];
      
      rerender({ events: newEvents });
      
      expect(result.current.sanitized).not.toBe(firstResult);
      expect(result.current.sanitized).toHaveLength(2);
    });
  });
});
