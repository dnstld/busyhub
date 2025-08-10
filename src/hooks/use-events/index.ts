import { CalendarEvent } from '@/app/actions/get-events';
import { EventsData, EventsQuery, EventsStats, UseEventsLegacyResult, UseEventsResult } from './types';
import { DailyEventStats, useEventsAggregation } from './useEventsAggregation';
import { FilterType, GroupedEvents, MonthData, useEventsFiltering } from './useEventsFiltering';
import { SanitizedEvent, useEventsSanitization } from './useEventsSanitization';
import { useEventsUtils } from './useEventsUtils';

// Re-export types for backward compatibility
export type { DailyEventStats, EventsData, EventsQuery, EventsStats, FilterType, GroupedEvents, MonthData, SanitizedEvent, UseEventsLegacyResult, UseEventsResult };

/**
 * Main events hook that maintains backward compatibility with the flat interface.
 * 
 * For new code, consider using `useEventsOrganized` for a cleaner interface.
 * 
 * @param events - Array of calendar events from the API
 * @returns Flat interface for backward compatibility
 */
export function useEvents(events: CalendarEvent[]): UseEventsLegacyResult {
  return useEventsLegacy(events);
}

/**
 * New organized events hook that provides comprehensive event management functionality.
 * 
 * Returns an organized interface with:
 * - data: Core event data and transformations
 * - stats: Statistical aggregations (daily, weekly, monthly)
 * - query: Utility functions for event querying and manipulation
 * 
 * @param events - Array of calendar events from the API
 * @returns Organized event management interface
 */
export function useEventsOrganized(events: CalendarEvent[]): UseEventsResult {
  const sanitization = useEventsSanitization(events);
  const aggregation = useEventsAggregation(sanitization.confirmedEvents);
  const filtering = useEventsFiltering(sanitization.confirmedEvents);
  const utils = useEventsUtils(sanitization.confirmedEvents, sanitization.dailyEvents);

  // Organize return values into logical groups
  const data: EventsData = {
    sanitized: sanitization.sanitized,
    confirmedEvents: sanitization.confirmedEvents,
    dailyEvents: sanitization.dailyEvents,
    totalEvents: sanitization.totalEvents,
  };

  const stats: EventsStats = {
    dailyStats: aggregation.dailyStats,
    weeklyStats: aggregation.weeklyStats,
    monthlyStats: aggregation.monthlyStats,
  };

  const query: EventsQuery = {
    getHistoryData: filtering.getHistoryData,
    getEventsByDateRange: utils.getEventsByDateRange,
    getEventsForDate: utils.getEventsForDate,
    filterEventsByTimeframe: filtering.filterEventsByTimeframe,
    parseEventDate: filtering.parseEventDate,
  };

  return { data, stats, query };
}

/**
 * Legacy version that maintains backward compatibility with the flat interface.
 * 
 * @deprecated Use the new organized interface instead
 * @param events - Array of calendar events from the API
 * @returns Flat interface for backward compatibility
 */
export function useEventsLegacy(events: CalendarEvent[]): UseEventsLegacyResult {
  const { data, stats, query } = useEventsOrganized(events);

  return {
    // Data properties
    sanitized: data.sanitized,
    confirmedEvents: data.confirmedEvents,
    dailyEvents: data.dailyEvents,
    totalEvents: data.totalEvents,
    
    // Stats properties
    dailyStats: stats.dailyStats,
    weeklyStats: stats.weeklyStats,
    monthlyStats: stats.monthlyStats,
    
    // Query functions
    getHistoryData: query.getHistoryData,
    getEventsByDateRange: query.getEventsByDateRange,
    getEventsForDate: query.getEventsForDate,
    filterEventsByTimeframe: query.filterEventsByTimeframe,
    parseEventDate: query.parseEventDate,
  };
}
