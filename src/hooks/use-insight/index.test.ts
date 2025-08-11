import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useInsight } from './index';

// Mock the hooks that useInsight depends on
vi.mock('@/hooks/use-events');
vi.mock('@/providers/events-provider');

import { SanitizedEvent, useEvents } from '@/hooks/use-events';
import { useCalendar } from '@/providers/events-provider';

const mockUseEvents = vi.mocked(useEvents);
const mockUseCalendar = vi.mocked(useCalendar);

// Helper function to create mock sanitized events
const createMockSanitizedEvent = (
  id: string,
  startDateTime?: string,
  endDateTime?: string,
  summary?: string
): SanitizedEvent => ({
  id,
  status: 'confirmed',
  summary: summary || `Event ${id}`,
  start: {
    dateTime: startDateTime || '2024-01-01T10:00:00Z',
    timeZone: 'UTC',
  },
  end: {
    dateTime: endDateTime || '2024-01-01T11:00:00Z',
    timeZone: 'UTC',
  },
  attendees: [],
  eventType: 'work',
});

describe('useInsight', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-15T12:00:00Z'));
    
    // Default mocks
    mockUseCalendar.mockReturnValue([]);
    mockUseEvents.mockReturnValue({
      confirmedEvents: [],
      dailyEvents: new Map(),
      sanitized: [],
      dailyStats: [],
      totalEvents: 0,
      weeklyStats: [],
      monthlyStats: [],
      getHistoryData: vi.fn(),
      getEventsByDateRange: vi.fn(),
      getEventsForDate: vi.fn(),
      filterEventsByTimeframe: vi.fn(),
      parseEventDate: vi.fn(),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe('when no events are available', () => {
    it('should return null', () => {
      const { result } = renderHook(() => useInsight());
      expect(result.current).toBeNull();
    });
  });

  describe('when events are available', () => {
    const mockEvents = [
      createMockSanitizedEvent('1', '2024-01-01T09:00:00Z', '2024-01-01T10:30:00Z', 'Daily Standup'),
      createMockSanitizedEvent('2', '2024-01-01T14:00:00Z', '2024-01-01T15:00:00Z', 'Client Meeting'),
      createMockSanitizedEvent('3', '2024-01-02T07:30:00Z', '2024-01-02T08:30:00Z', 'Early Team Sync'),
      createMockSanitizedEvent('4', '2024-01-02T16:00:00Z', '2024-01-02T20:00:00Z', 'Project Review'),
      createMockSanitizedEvent('5', '2024-01-03T11:00:00Z', '2024-01-03T12:00:00Z', 'Weekly Planning'),
    ];

    const mockDailyEvents = new Map([
      ['2024-01-01', [mockEvents[0], mockEvents[1]]],
      ['2024-01-02', [mockEvents[2], mockEvents[3]]],
      ['2024-01-03', [mockEvents[4]]],
    ]);

    beforeEach(() => {
      mockUseEvents.mockReturnValue({
        confirmedEvents: mockEvents,
        dailyEvents: mockDailyEvents,
        sanitized: mockEvents,
        dailyStats: [],
        totalEvents: mockEvents.length,
        weeklyStats: [],
        monthlyStats: [],
        getHistoryData: vi.fn(),
        getEventsByDateRange: vi.fn(),
        getEventsForDate: vi.fn(),
        filterEventsByTimeframe: vi.fn(),
        parseEventDate: vi.fn(),
      });
    });

    it('should calculate daily totals correctly', () => {
      const { result } = renderHook(() => useInsight());
      const insightData = result.current!;
      
      expect(insightData.dailyTotals).toHaveLength(3);
      
      const day1 = insightData.dailyTotals.find(d => d.date === '2024-01-01');
      expect(day1).toBeDefined();
      expect(day1!.meetingCount).toBe(2);
      expect(day1!.totalHours).toBe(2.5);
      expect(day1!.morningMeetings).toBe(1);
      expect(day1!.afternoonMeetings).toBe(1);
    });

    it('should calculate monthly trends correctly', () => {
      const { result } = renderHook(() => useInsight());
      const insightData = result.current!;
      
      expect(insightData.monthlyTrends.monthlyData['2024-01']).toBeDefined();
      expect(insightData.monthlyTrends.monthlyData['2024-01'].meetings).toBe(5);
      expect(insightData.monthlyTrends.monthlyData['2024-01'].hours).toBe(8.5);
      expect(insightData.monthlyTrends.trend).toBe('stable');
    });

    it('should calculate workday patterns correctly', () => {
      const { result } = renderHook(() => useInsight());
      const insightData = result.current!;
      
      expect(insightData.workdayPatterns.earlyStarts).toBe(1);
      expect(insightData.workdayPatterns.lateEnds).toBe(1);
      expect(insightData.workdayPatterns.longDays).toBe(1);
      expect(insightData.workdayPatterns.earlyStartPercentage).toBe(33);
      expect(insightData.workdayPatterns.lateEndPercentage).toBe(33);
    });

    it('should classify meeting types correctly', () => {
      const { result } = renderHook(() => useInsight());
      const insightData = result.current!;
      
      expect(insightData.meetingTypes.recurringMeetings).toBe(3);
      expect(insightData.meetingTypes.oneOffMeetings).toBe(2);
      expect(insightData.meetingTypes.externalMeetings).toBe(1);
      expect(insightData.meetingTypes.internalMeetings).toBe(4);
      expect(insightData.meetingTypes.recurringPercentage).toBe(60);
      expect(insightData.meetingTypes.externalPercentage).toBe(20);
    });

    it('should calculate summary statistics correctly', () => {
      const { result } = renderHook(() => useInsight());
      const insightData = result.current!;
      
      expect(insightData.totalMeetingHours).toBe(8.5);
      expect(insightData.avgMeetingHoursPerDay).toBe('2.8');
      expect(insightData.heavyDays).toHaveLength(1);
      expect(insightData.heavyDays[0].date).toBe('2024-01-02');
    });

    it('should generate AI prompt with comprehensive data', () => {
      const { result } = renderHook(() => useInsight());
      const insightData = result.current!;
      
      expect(insightData.aiPrompt).toContain('Analyze this calendar data as a productivity consultant');
      expect(insightData.aiPrompt).toContain('2024 Daily Meeting Totals:');
      expect(insightData.aiPrompt).toContain('Weekly Distribution:');
      expect(insightData.aiPrompt).toContain('Monthly Trends:');
      expect(insightData.aiPrompt).toContain('Meeting Spacing:');
      expect(insightData.aiPrompt).toContain('Workday Boundaries:');
      expect(insightData.aiPrompt).toContain('Meeting Types:');
    });

    it('should handle edge cases in time calculations', () => {
      const eventsWithoutTime = [
        {
          ...createMockSanitizedEvent('no-time', '2024-01-01T10:00:00Z', '2024-01-01T11:00:00Z'),
          start: {},
          end: {},
        } as SanitizedEvent,
      ];

      mockUseEvents.mockReturnValue({
        confirmedEvents: eventsWithoutTime,
        dailyEvents: new Map([['2024-01-01', eventsWithoutTime]]),
        sanitized: eventsWithoutTime,
        dailyStats: [],
        totalEvents: eventsWithoutTime.length,
        weeklyStats: [],
        monthlyStats: [],
        getHistoryData: vi.fn(),
        getEventsByDateRange: vi.fn(),
        getEventsForDate: vi.fn(),
        filterEventsByTimeframe: vi.fn(),
        parseEventDate: vi.fn(),
      });

      const { result } = renderHook(() => useInsight());
      const insightData = result.current!;

      const day = insightData.dailyTotals.find(d => d.date === '2024-01-01');
      expect(day).toBeDefined();
      expect(day!.totalHours).toBe(0);
      expect(day!.earliestStart).toBe('N/A');
      expect(day!.latestEnd).toBe('N/A');
      expect(day!.workdayLength).toBe(0);
    });
  });

  describe('memoization', () => {
    it('should memoize results when dependencies do not change', () => {
      const mockEvents = [
        createMockSanitizedEvent('1', '2024-01-01T10:00:00Z', '2024-01-01T11:00:00Z'),
      ];
      const mockDailyEvents = new Map([['2024-01-01', mockEvents]]);

      mockUseEvents.mockReturnValue({
        confirmedEvents: mockEvents,
        dailyEvents: mockDailyEvents,
        sanitized: mockEvents,
        dailyStats: [],
        totalEvents: mockEvents.length,
        weeklyStats: [],
        monthlyStats: [],
        getHistoryData: vi.fn(),
        getEventsByDateRange: vi.fn(),
        getEventsForDate: vi.fn(),
        filterEventsByTimeframe: vi.fn(),
        parseEventDate: vi.fn(),
      });

      const { result, rerender } = renderHook(() => useInsight());
      const firstResult = result.current;

      rerender();
      expect(result.current).toBe(firstResult);
    });
  });
});
