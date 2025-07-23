/**
 * Organized interface types for useEvents hook
 */

import { DailyEventStats } from './useEventsAggregation';
import { FilterType, GroupedEvents } from './useEventsFiltering';
import { SanitizedEvent } from './useEventsSanitization';

/**
 * Core event data interface - matches useEventsSanitization return
 */
export interface EventsData {
  /** All sanitized events */
  sanitized: SanitizedEvent[];
  /** Only confirmed events with valid dates */
  confirmedEvents: SanitizedEvent[];
  /** Events grouped by date */
  dailyEvents: Map<string, SanitizedEvent[]>;
  /** Total count of confirmed events */
  totalEvents: number;
}

/**
 * Statistical aggregations interface - matches useEventsAggregation return
 */
export interface EventsStats {
  /** Daily event statistics */
  dailyStats: DailyEventStats[];
  /** Weekly event aggregations */
  weeklyStats: DailyEventStats[];
  /** Monthly event aggregations */
  monthlyStats: DailyEventStats[];
}

/**
 * Query and filtering utilities interface - matches hook returns
 */
export interface EventsQuery {
  /** Get filtered events for history display */
  getHistoryData: (filter: FilterType) => {
    monthlyEvents: GroupedEvents;
    sortedMonths: string[];
  };
  /** Get events within a date range */
  getEventsByDateRange: (startDate: string, endDate: string) => SanitizedEvent[];
  /** Get events for a specific date */
  getEventsForDate: (date: string) => SanitizedEvent[];
  /** Filter events by timeframe */
  filterEventsByTimeframe: (events: any[], filter: FilterType) => any[];
  /** Parse event date safely */
  parseEventDate: (event: any) => Date | null;
}

/**
 * Main useEvents hook return interface
 */
export interface UseEventsResult {
  /** Core event data and collections */
  data: EventsData;
  /** Statistical aggregations for charts */
  stats: EventsStats;
  /** Query and filtering utilities */
  query: EventsQuery;
}

/**
 * Backward compatibility interface (flat structure)
 */
export interface UseEventsLegacyResult {
  // Data properties
  sanitized: SanitizedEvent[];
  confirmedEvents: SanitizedEvent[];
  dailyEvents: Map<string, SanitizedEvent[]>;
  totalEvents: number;
  
  // Stats properties
  dailyStats: DailyEventStats[];
  weeklyStats: DailyEventStats[];
  monthlyStats: DailyEventStats[];
  
  // Query functions
  getHistoryData: (filter: FilterType) => {
    monthlyEvents: GroupedEvents;
    sortedMonths: string[];
  };
  getEventsByDateRange: (startDate: string, endDate: string) => SanitizedEvent[];
  getEventsForDate: (date: string) => SanitizedEvent[];
  filterEventsByTimeframe: (events: any[], filter: FilterType) => any[];
  parseEventDate: (event: any) => Date | null;
}
