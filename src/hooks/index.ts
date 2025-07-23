/**
 * Hooks index file - maintains backward compatibility
 * All hooks are now organized in their respective folders
 */

// Main useEvents hook (with organized structure)
export { useEvents, useEventsLegacy, useEventsOrganized } from './useEvents';
export type {
    DailyEventStats, EventsData, EventsQuery, EventsStats, FilterType,
    GroupedEvents,
    MonthData,
    SanitizedEvent, UseEventsLegacyResult, UseEventsResult
} from './useEvents';

// Individual hooks
export { useAchievements } from './useAchievements';
export { useDate } from './useDate';
export { useEventsGrid } from './useEventsGrid';
export type { GridCell } from './useEventsGrid';
export { intensityColors, useIntensityScale } from './useIntensityScale';

