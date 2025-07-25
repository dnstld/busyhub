/**
 * Type guard utilities for type safety improvements
 */

/**
 * Type guard to check if a value is defined (not null or undefined)
 */
export const isDefined = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
};

/**
 * Type guard to check if a string is not empty
 */
export const isNonEmptyString = (value: string | null | undefined): value is string => {
  return isDefined(value) && value.trim().length > 0;
};

/**
 * Type guard to check if an array is not empty
 */
export const isNonEmptyArray = <T>(array: T[] | null | undefined): array is T[] => {
  return isDefined(array) && array.length > 0;
};

/**
 * Type guard to check if a Map has a specific key and return the value safely
 */
export const getMapValue = <K, V>(map: Map<K, V>, key: K): V | undefined => {
  return map.has(key) ? map.get(key) : undefined;
};

/**
 * Safe Map access that guarantees a value exists
 */
export const getOrSetMapValue = <K, V>(
  map: Map<K, V>, 
  key: K, 
  defaultValue: V
): V => {
  if (map.has(key)) {
    return map.get(key)!; // Safe because we checked has()
  }
  
  map.set(key, defaultValue);
  return defaultValue;
};

/**
 * Type guard for checking if an object has a specific property
 */
export const hasProperty = <T extends object, K extends PropertyKey>(
  obj: T | null | undefined,
  key: K
): obj is T & Record<K, unknown> => {
  return obj != null && key in obj;
};

/**
 * Safe property access that returns undefined if property doesn't exist
 */
export const getProperty = <T extends object, K extends keyof T>(
  obj: T | null | undefined,
  key: K
): T[K] | undefined => {
  return isDefined(obj) ? obj[key] : undefined;
};

/**
 * Type assertion helper that provides better error messages
 */
export const assertType = <T>(
  value: unknown,
  predicate: (value: unknown) => value is T,
  errorMessage: string
): T => {
  if (predicate(value)) {
    return value;
  }
  throw new Error(errorMessage);
};

/**
 * Safe number conversion
 */
export const toSafeNumber = (value: unknown, defaultValue: number = 0): number => {
  if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
    return value;
  }
  
  if (typeof value === 'string') {
    const parsed = Number(value);
    return isNaN(parsed) || !isFinite(parsed) ? defaultValue : parsed;
  }
  
  return defaultValue;
};

/**
 * Safe date creation with validation
 */
export const createSafeDate = (value: string | number | Date | null | undefined): Date | null => {
  if (!isDefined(value)) {
    return null;
  }
  
  try {
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
};

/**
 * Type guard for checking if a value is a valid date
 */
export const isValidDate = (date: Date | null | undefined): date is Date => {
  return isDefined(date) && !isNaN(date.getTime());
};

/**
 * Narrow type helper for union types
 */
export const narrow = <T, U extends T>(
  value: T,
  predicate: (value: T) => value is U
): U | null => {
  return predicate(value) ? value : null;
};

/**
 * Safe array access with bounds checking
 */
export const safeArrayAccess = <T>(
  array: T[] | null | undefined,
  index: number
): T | undefined => {
  if (!isNonEmptyArray(array) || index < 0 || index >= array.length) {
    return undefined;
  }
  return array[index];
};

/**
 * Type-safe object property checker
 */
export const hasValidProperty = <T extends object, K extends keyof T>(
  obj: T | null | undefined,
  key: K,
  validator: (value: unknown) => boolean
): obj is T & Required<Pick<T, K>> => {
  if (!isDefined(obj) || !hasProperty(obj, key)) {
    return false;
  }
  
  return validator(obj[key]);
};
