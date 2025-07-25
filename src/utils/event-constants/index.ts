/**
 * Constants for event processing and filtering
 */

/**
 * Event status constants
 */
export const EVENT_STATUS = {
  CONFIRMED: 'confirmed',
  TENTATIVE: 'tentative',
  CANCELLED: 'cancelled',
} as const;

/**
 * Filter type constants
 */
export const FILTER_TYPES = {
  PAST: 'past',
  UPCOMING: 'upcoming',
  ALL: 'all',
} as const;

/**
 * Date format constants
 */
export const DATE_FORMATS = {
  ISO_DATE: 'YYYY-MM-DD',
  MONTH_YEAR: 'YYYY-MM',
  DISPLAY_MONTH: 'en-US',
} as const;

/**
 * Time constants
 */
export const TIME_CONSTANTS = {
  DAYS_IN_WEEK: 7,
  SUNDAY_INDEX: 0,
  MILLISECONDS_IN_DAY: 24 * 60 * 60 * 1000,
} as const;

/**
 * Locale constants
 */
export const LOCALE_CONSTANTS = {
  DEFAULT: 'en-US',
  MONTH_FORMAT_OPTIONS: {
    year: 'numeric' as const,
    month: 'long' as const,
  },
} as const;

/**
 * Aggregation type constants
 */
export const AGGREGATION_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
} as const;
