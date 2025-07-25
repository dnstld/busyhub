/**
 * Hooks index file - maintains backward compatibility
 * All hooks are now organized in their respective folders
 */

// Main useEvents hook (with organized structure)
export { useEvents, useEventsLegacy, useEventsOrganized } from './use-events';
export type {
    DailyEventStats, EventsData, EventsQuery, EventsStats, FilterType,
    GroupedEvents,
    MonthData,
    SanitizedEvent, UseEventsLegacyResult, UseEventsResult
} from './use-events';

// Individual hooks
export { useAchievements } from './use-achievements';
export { useDate } from './use-date';
export { useEventsGrid } from './use-events-grid';
export type { GridCell } from './use-events-grid';
export { intensityColors, useIntensityScale } from './use-intensity-scale';

