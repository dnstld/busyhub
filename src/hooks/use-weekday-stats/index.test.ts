import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SanitizedEvent } from '../use-events/useEventsSanitization';
import { useWeekdayStats } from './index';

// Mock the utility functions
vi.mock('@/utils', () => ({
  createSafeDate: (dateStr: string) => new Date(dateStr),
  isNonEmptyString: (str: unknown) => typeof str === 'string' && str.length > 0,
  isValidDate: (date: unknown) => date instanceof Date && !isNaN(date.getTime()),
}));

describe('useWeekdayStats', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-15')); // Set to 2024
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const createMockEvent = (id: string, dateTime: string): SanitizedEvent => ({
    id,
    status: 'confirmed',
    start: { dateTime, timeZone: 'UTC' },
    end: { dateTime, timeZone: 'UTC' },
    attendees: [],
    eventType: 'work',
  });

  it('should return stats for all weekdays', () => {
    const events = [
      createMockEvent('1', '2024-01-01T10:00:00Z'), // Monday
      createMockEvent('2', '2024-01-02T10:00:00Z'), // Tuesday
    ];

    const { result } = renderHook(() => useWeekdayStats(events));

    expect(result.current).toHaveLength(7);
    expect(result.current[0].dayName).toBe('Monday');
    expect(result.current[6].dayName).toBe('Sunday');
  });

  it('should filter events to current year only', () => {
    const events = [
      createMockEvent('1', '2024-01-01T10:00:00Z'), // Current year
      createMockEvent('2', '2023-01-01T10:00:00Z'), // Previous year
      createMockEvent('3', '2025-01-01T10:00:00Z'), // Next year
    ];

    const { result } = renderHook(() => useWeekdayStats(events));

    const totalEvents = result.current.reduce((sum, stat) => sum + stat.count, 0);
    expect(totalEvents).toBe(1); // Only 2024 event should be counted
  });

  it('should correctly count events by weekday', () => {
    const events = [
      createMockEvent('1', '2024-01-01T10:00:00Z'), // Monday
      createMockEvent('2', '2024-01-08T10:00:00Z'), // Monday
      createMockEvent('3', '2024-01-02T10:00:00Z'), // Tuesday
    ];

    const { result } = renderHook(() => useWeekdayStats(events));

    const mondayStats = result.current.find(stat => stat.dayName === 'Monday');
    const tuesdayStats = result.current.find(stat => stat.dayName === 'Tuesday');

    expect(mondayStats?.count).toBe(2);
    expect(tuesdayStats?.count).toBe(1);
  });

  it('should handle empty events array', () => {
    const { result } = renderHook(() => useWeekdayStats([]));

    expect(result.current).toHaveLength(7);
    result.current.forEach(stat => {
      expect(stat.count).toBe(0);
      expect(stat.events).toHaveLength(0);
    });
  });

  it('should handle events with invalid dates', () => {
    const events = [
      createMockEvent('1', '2024-01-01T10:00:00Z'), // Valid
      createMockEvent('2', ''), // Invalid
      { ...createMockEvent('3', '2024-01-02T10:00:00Z'), start: { dateTime: null, timeZone: 'UTC' } }, // Invalid
    ] as SanitizedEvent[];

    const { result } = renderHook(() => useWeekdayStats(events));

    const totalEvents = result.current.reduce((sum, stat) => sum + stat.count, 0);
    expect(totalEvents).toBe(1); // Only valid events should be counted
  });

  it('should sort weekdays correctly (Monday first)', () => {
    const { result } = renderHook(() => useWeekdayStats([]));

    const dayNames = result.current.map(stat => stat.dayName);
    expect(dayNames).toEqual([
      'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
    ]);
  });
});
