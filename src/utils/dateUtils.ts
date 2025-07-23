import { CalendarEvent } from '@/app/actions/getEvents';

/**
 * Date utility functions for event processing
 */

/**
 * Generate a date key in YYYY-MM-DD format
 */
export const getDateKey = (date: Date): string => {
  return date.toISOString().slice(0, 10);
};

/**
 * Generate a week key (start of week in YYYY-MM-DD format)
 * Week starts on Sunday
 */
export const getWeekKey = (date: Date): string => {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay()); // Start on Sunday
  return startOfWeek.toISOString().slice(0, 10);
};

/**
 * Generate a month key in YYYY-MM format
 */
export const getMonthKey = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

/**
 * Generate a month display key (e.g., "January 2024")
 */
export const getMonthDisplayKey = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
};

/**
 * Generate a day key for grouping (e.g., "Mon Jan 01 2024")
 */
export const getDayKey = (date: Date): string => {
  return date.toDateString();
};

/**
 * Parse event date with error handling
 */
export const parseEventDate = (event: CalendarEvent): Date | null => {
  try {
    const dateStr = event.start?.dateTime;
    return dateStr ? new Date(dateStr) : null;
  } catch {
    console.warn('Invalid date format:', event.start?.dateTime);
    return null;
  }
};

/**
 * Check if a date string is valid
 */
export const isValidDateString = (dateStr: string | null | undefined): boolean => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
};

/**
 * Get the start of week for a given date (Sunday)
 */
export const getStartOfWeek = (date: Date): Date => {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());
  return startOfWeek;
};

/**
 * Compare two date strings for sorting
 */
export const compareDateStrings = (a: string, b: string): number => {
  return a.localeCompare(b);
};

/**
 * Compare two dates for sorting (descending)
 */
export const compareDatesDescending = (a: string, b: string): number => {
  return new Date(b).getTime() - new Date(a).getTime();
};

/**
 * Compare two dates for sorting (ascending)
 */
export const compareDatesAscending = (a: string, b: string): number => {
  return new Date(a).getTime() - new Date(b).getTime();
};
