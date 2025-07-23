/**
 * Enhanced types for type safety improvements
 */

/**
 * Utility type to make certain properties required
 */
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Utility type to make properties optional
 */
export type PartialFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Non-empty array type
 */
export type NonEmptyArray<T> = [T, ...T[]];

/**
 * Safe map access result
 */
export type SafeMapResult<T> = T | undefined;

/**
 * Type-safe event with guaranteed properties
 */
export interface SafeEvent {
  id: string;
  status: 'confirmed' | 'tentative' | 'cancelled';
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
  attendees?: Array<{
    email?: string;
    displayName?: string;
    responseStatus?: string;
  }>;
}

/**
 * Type predicate for safe event
 */
export const isSafeEvent = (event: unknown): event is SafeEvent => {
  return (
    typeof event === 'object' &&
    event !== null &&
    typeof (event as Record<string, unknown>).id === 'string' &&
    typeof (event as Record<string, unknown>).status === 'string' &&
    typeof (event as { start?: { dateTime?: unknown } }).start?.dateTime === 'string' &&
    typeof (event as { end?: { dateTime?: unknown } }).end?.dateTime === 'string'
  );
};

/**
 * Result type for operations that can fail
 */
export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Helper to create success result
 */
export const success = <T>(data: T): Result<T> => ({
  success: true,
  data,
});

/**
 * Helper to create error result
 */
export const failure = <E = Error>(error: E): Result<never, E> => ({
  success: false,
  error,
});

/**
 * Type-safe date string (YYYY-MM-DD format)
 */
export type DateString = string & { __brand: 'DateString' };

/**
 * Create a type-safe date string
 */
export const createDateString = (date: Date): DateString => {
  return date.toISOString().slice(0, 10) as DateString;
};

/**
 * Validate if string is a valid date string
 */
export const isDateString = (value: string): value is DateString => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(value)) return false;
  
  const date = new Date(value);
  return !isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

/**
 * Branded type for validated month keys
 */
export type MonthKey = string & { __brand: 'MonthKey' };

/**
 * Create a validated month key
 */
export const createMonthKey = (date: Date): MonthKey => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  }) as MonthKey;
};

/**
 * Type for strict object key checking
 */
export type StrictKeys<T> = keyof T;

/**
 * Type guard for checking if object has all required keys
 */
export const hasRequiredKeys = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): obj is T & Required<Pick<T, K>> => {
  return keys.every(key => key in obj && obj[key] !== undefined && obj[key] !== null);
};
