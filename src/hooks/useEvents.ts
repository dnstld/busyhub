import { CalendarEvent } from '@/app/actions/getEvents';
import { DailyEventStats, useEventsAggregation } from './useEventsAggregation';
import { FilterType, GroupedEvents, MonthData, useEventsFiltering } from './useEventsFiltering';
import { SanitizedEvent, useEventsSanitization } from './useEventsSanitization';
import { useEventsUtils } from './useEventsUtils';

// Re-export types for backward compatibility
export type { DailyEventStats, FilterType, GroupedEvents, MonthData, SanitizedEvent };

export const useEvents = (rawEvents: CalendarEvent[]) => {
  // Use focused hooks for specific functionality
  const { sanitized, confirmedEvents, dailyEvents, totalEvents } = useEventsSanitization(rawEvents);
  const { dailyStats, weeklyStats, monthlyStats } = useEventsAggregation(confirmedEvents);
  const { getHistoryData } = useEventsFiltering(rawEvents);
  const { getEventsByDateRange, getEventsForDate } = useEventsUtils(confirmedEvents, dailyEvents);

  return {
    // Original data
    events: sanitized,
    confirmedEvents,
    totalEvents,
    
    // For Timeline/Heatmap
    dailyEvents,
    dailyStats,
    
    // For History component
    getHistoryData,
    
    // For Charts
    weeklyStats,
    monthlyStats,
    
    // Utility functions
    getEventsByDateRange,
    getEventsForDate,
  };
};

