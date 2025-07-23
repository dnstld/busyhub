import { CalendarEvent } from '@/app/actions/getEvents';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FilterType, useEventsFiltering } from './index';

describe('useEventsFiltering', () => {
  describe('Basic Functionality', () => {
    it('should return utility functions', () => {
      const { result } = renderHook(() => useEventsFiltering([]));
      
      expect(result.current.getHistoryData).toBeDefined();
      expect(typeof result.current.getHistoryData).toBe('function');
      expect(result.current.filterEventsByTimeframe).toBeDefined();
      expect(typeof result.current.filterEventsByTimeframe).toBe('function');
      expect(result.current.parseEventDate).toBeDefined();
      expect(typeof result.current.parseEventDate).toBe('function');
    });

    it('should handle getHistoryData call with different filters', () => {
      const { result } = renderHook(() => useEventsFiltering([]));
      
      const filterTypes: FilterType[] = ['all', 'past', 'upcoming'];
      
      filterTypes.forEach(filterType => {
        const historyData = result.current.getHistoryData(filterType);
        expect(historyData).toBeDefined();
        expect(historyData.monthlyEvents).toBeDefined();
        expect(historyData.sortedMonths).toBeDefined();
        expect(Array.isArray(historyData.sortedMonths)).toBe(true);
      });
    });

    it('should handle filterEventsByTimeframe with empty events', () => {
      const { result } = renderHook(() => useEventsFiltering([]));
      
      const filtered = result.current.filterEventsByTimeframe([], 'all');
      expect(Array.isArray(filtered)).toBe(true);
      expect(filtered).toHaveLength(0);
    });

    it('should handle parseEventDate with null input', () => {
      const { result } = renderHook(() => useEventsFiltering([]));
      
      // Test with invalid event - should handle gracefully
      expect(() => {
        result.current.parseEventDate(null as unknown as CalendarEvent);
      }).not.toThrow();
    });
  });

  describe('Memoization', () => {
    it('should memoize results when inputs stay the same', () => {
      const events: CalendarEvent[] = [];
      
      const { result, rerender } = renderHook(
        ({ events }) => useEventsFiltering(events),
        { initialProps: { events } }
      );
      
      const firstResult = result.current.getHistoryData;
      
      rerender({ events });
      
      // Functions should be memoized
      expect(result.current.getHistoryData).toBe(firstResult);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty events array', () => {
      const { result } = renderHook(() => useEventsFiltering([]));
      
      expect(result.current).toBeDefined();
      
      // Should return empty results for empty input
      const historyData = result.current.getHistoryData('all');
      expect(historyData.sortedMonths).toHaveLength(0);
    });

    it('should handle different filter types', () => {
      const { result } = renderHook(() => useEventsFiltering([]));
      
      // Test all valid filter types
      const filterTypes: FilterType[] = ['all', 'past', 'upcoming'];
      
      filterTypes.forEach(filterType => {
        expect(() => {
          result.current.getHistoryData(filterType);
        }).not.toThrow();
      });
    });
  });
});
