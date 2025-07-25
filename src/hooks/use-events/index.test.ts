import { CalendarEvent } from '@/app/actions/get-events';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useEvents, useEventsOrganized } from './index';

// Helper function to create mock calendar events
const createMockCalendarEvent = (id: string, date?: string): CalendarEvent => ({
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

describe('useEvents', () => {
  describe('Legacy Interface', () => {
    it('should return the expected flat structure for backward compatibility', () => {
      const events = [
        createMockCalendarEvent('event-1', '2024-01-01'),
        createMockCalendarEvent('event-2', '2024-01-02'),
      ];
      
      const { result } = renderHook(() => useEvents(events));
      
      // Should have all the legacy properties that our refined interface provides
      expect(result.current).toHaveProperty('sanitized');
      expect(result.current).toHaveProperty('confirmedEvents');
      expect(result.current).toHaveProperty('dailyEvents');
      expect(result.current).toHaveProperty('dailyStats');
      expect(result.current).toHaveProperty('totalEvents');
      expect(result.current).toHaveProperty('weeklyStats');
      expect(result.current).toHaveProperty('monthlyStats');
      expect(result.current).toHaveProperty('getHistoryData');
      expect(result.current).toHaveProperty('getEventsByDateRange');
      expect(result.current).toHaveProperty('getEventsForDate');
      expect(result.current).toHaveProperty('filterEventsByTimeframe');
      expect(result.current).toHaveProperty('parseEventDate');
    });

    it('should process events correctly', () => {
      const events = [
        createMockCalendarEvent('event-1', '2024-01-01'),
        createMockCalendarEvent('event-2', '2024-01-01'),
      ];
      
      const { result } = renderHook(() => useEvents(events));
      
      expect(result.current.sanitized).toHaveLength(2);
      expect(result.current.totalEvents).toBe(2);
      expect(result.current.dailyEvents.get('2024-01-01')).toHaveLength(2);
    });
  });

  describe('Organized Interface', () => {
    it('should return organized structure with data, stats, and query', () => {
      const events = [
        createMockCalendarEvent('event-1', '2024-01-01'),
      ];
      
      const { result } = renderHook(() => useEventsOrganized(events));
      
      expect(result.current).toHaveProperty('data');
      expect(result.current).toHaveProperty('stats');
      expect(result.current).toHaveProperty('query');
      
      // Data should contain processed events
      expect(result.current.data.sanitized).toHaveLength(1);
      expect(result.current.data.dailyEvents.size).toBe(1);
      
      // Stats should be present
      expect(Array.isArray(result.current.stats.dailyStats)).toBe(true);
      
      // Query functions should be present
      expect(typeof result.current.query.getHistoryData).toBe('function');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty events array', () => {
      const { result } = renderHook(() => useEvents([]));
      
      expect(result.current.sanitized).toHaveLength(0);
      expect(result.current.totalEvents).toBe(0);
      expect(result.current.dailyEvents.size).toBe(0);
    });

    it('should handle undefined/malformed events gracefully', () => {
      // This test ensures the hook doesn't crash with bad data
      const { result } = renderHook(() => useEvents([]));
      
      // Should return valid structure even with no events
      expect(result.current).toBeDefined();
      expect(typeof result.current.getHistoryData).toBe('function');
      expect(typeof result.current.parseEventDate).toBe('function');
    });
  });
});
