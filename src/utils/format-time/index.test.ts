import { describe, expect, it } from 'vitest';
import { formatTime } from './index';

describe('formatTime', () => {
  it('should format time string correctly for default locale', () => {
    const dateTime = '2024-01-15T10:30:00Z';
    const result = formatTime(dateTime);
    expect(result).toMatch(/\d{2}:\d{2}/);
  });

  it('should format time in 24-hour format', () => {
    // Use local times to avoid timezone conversion issues
    const times = [
      { input: '2024-01-15T10:30:00', expected: '10:30' },
      { input: '2024-01-15T15:45:00', expected: '15:45' },
      { input: '2024-01-15T23:59:00', expected: '23:59' }
    ];

    times.forEach(({ input, expected }) => {
      const result = formatTime(input);
      expect(result).toBe(expected);
    });
  });

  it('should handle different locales', () => {
    const dateTime = '2024-01-15T14:30:00Z';
    
    // Test that different locales don't throw errors
    expect(() => formatTime(dateTime, 'en-US')).not.toThrow();
    expect(() => formatTime(dateTime, 'de-DE')).not.toThrow();
    expect(() => formatTime(dateTime, 'fr-FR')).not.toThrow();
  });

  it('should handle edge cases', () => {
    // Test with local times to avoid timezone conversion issues
    expect(formatTime('2024-01-15T12:00:00')).toBe('12:00');
    expect(formatTime('2024-01-15T09:00:00')).toBe('09:00');
  });

  it('should handle different time zones consistently', () => {
    const utcTime = '2024-01-15T15:30:00Z';
    const result = formatTime(utcTime);
    
    // Should return a valid time format regardless of timezone
    expect(result).toMatch(/\d{2}:\d{2}/);
  });

  it('should handle invalid time gracefully', () => {
    expect(() => formatTime('invalid-time')).not.toThrow();
  });
});
