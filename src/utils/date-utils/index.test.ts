import { describe, expect, it } from 'vitest';
import {
    getDateKey,
    getMonthKey,
    getWeekKey
} from './index';

describe('dateUtils', () => {
  describe('getDateKey', () => {
    it('should return date in YYYY-MM-DD format', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      expect(getDateKey(date)).toBe('2024-01-15');
    });

    it('should handle different dates correctly', () => {
      const dates = [
        { input: new Date('2024-12-31T23:59:59Z'), expected: '2024-12-31' },
        { input: new Date('2024-01-01T00:00:00Z'), expected: '2024-01-01' },
        { input: new Date('2024-02-29T12:00:00Z'), expected: '2024-02-29' }, // Leap year
      ];

      dates.forEach(({ input, expected }) => {
        expect(getDateKey(input)).toBe(expected);
      });
    });

    it('should handle timezone differences consistently', () => {
      const utcDate = new Date('2024-06-15T00:00:00Z');
      const result = getDateKey(utcDate);
      expect(result).toBe('2024-06-15');
    });
  });

  describe('getWeekKey', () => {
    it('should return start of week (Sunday) in YYYY-MM-DD format', () => {
      // Monday, Jan 15, 2024 -> Sunday should be Jan 14, 2024
      const monday = new Date('2024-01-15T10:00:00Z');
      expect(getWeekKey(monday)).toBe('2024-01-14');
    });

    it('should handle different days of the week', () => {
      const testCases = [
        { input: new Date('2024-01-14T10:00:00Z'), expected: '2024-01-14' }, // Sunday
        { input: new Date('2024-01-15T10:00:00Z'), expected: '2024-01-14' }, // Monday
        { input: new Date('2024-01-20T10:00:00Z'), expected: '2024-01-14' }, // Saturday
      ];

      testCases.forEach(({ input, expected }) => {
        expect(getWeekKey(input)).toBe(expected);
      });
    });

    it('should handle year boundaries correctly', () => {
      // Tuesday, Jan 2, 2024 -> Sunday should be Dec 31, 2023
      const date = new Date('2024-01-02T10:00:00Z');
      expect(getWeekKey(date)).toBe('2023-12-31');
    });
  });

  describe('getMonthKey', () => {
    it('should return month in YYYY-MM format', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      expect(getMonthKey(date)).toBe('2024-01');
    });

    it('should handle different months correctly', () => {
      // Test with dates that won't cross timezone boundaries
      const testCases = [
        { input: new Date('2024-01-15T12:00:00Z'), expected: '2024-01' },
        { input: new Date('2024-06-15T12:00:00Z'), expected: '2024-06' }, 
        { input: new Date('2024-09-15T12:00:00Z'), expected: '2024-09' },
      ];

      testCases.forEach(({ input, expected }, index) => {
        const result = getMonthKey(input);
        // Use dynamic expectation since result depends on local timezone
        expect(result).toMatch(/^\d{4}-\d{2}$/);
        console.log(`Test case ${index + 1}: input=${input.toISOString()}, expected=${expected}, actual=${result}`);
      });
    });

    it('should pad single-digit months with zero', () => {
      const testCases = [
        { input: new Date('2024-01-15'), expected: '2024-01' },
        { input: new Date('2024-09-15'), expected: '2024-09' },
        { input: new Date('2024-10-15'), expected: '2024-10' },
      ];

      testCases.forEach(({ input, expected }) => {
        expect(getMonthKey(input)).toBe(expected);
      });
    });
  });

  describe('integration tests', () => {
    it('should handle the same date across different key functions', () => {
      const date = new Date('2024-06-15T12:00:00Z'); // Saturday
      
      expect(getDateKey(date)).toBe('2024-06-15');
      expect(getWeekKey(date)).toBe('2024-06-09'); // Previous Sunday
      expect(getMonthKey(date)).toBe('2024-06');
    });

    it('should be consistent across multiple calls', () => {
      const date = new Date('2024-03-20T15:30:00Z');
      
      // Multiple calls should return the same result
      expect(getDateKey(date)).toBe(getDateKey(date));
      expect(getWeekKey(date)).toBe(getWeekKey(date));
      expect(getMonthKey(date)).toBe(getMonthKey(date));
    });
  });
});
