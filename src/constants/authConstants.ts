/**
 * Constants for aurthentication and authorization
 */

/**
 * Configuration constants
 */
export const AUTH_CONFIG = {
  TOKEN_REFRESH_BUFFER: 5 * 60 * 1000, // 5 minutes
  SESSION_MAX_AGE: 30 * 24 * 60 * 60, // 30 days
  SESSION_UPDATE_AGE: 24 * 60 * 60, // 24 hours
} as const;