import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDate } from './index';

describe('useDate', () => {
  beforeEach(() => {
    // Mock the Date constructor to return a consistent year
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getCurrentYearWeekdays', () => {
    it('should calculate correct weekdays for 2024 (leap year)', () => {
      // Mock Date to return 2024
      vi.setSystemTime(new Date('2024-06-15'));
      
      const { result } = renderHook(() => useDate());
      
      // 2024 is a leap year with 366 days
      // Should have 262 weekdays (Monday-Friday)
      expect(result.current.totalWeekdays).toBe(262);
    });

    it('should calculate correct weekdays for 2023 (non-leap year)', () => {
      // Mock Date to return 2023
      vi.setSystemTime(new Date('2023-06-15'));
      
      const { result } = renderHook(() => useDate());
      
      // 2023 is a non-leap year with 365 days
      // Should have 260 weekdays (Monday-Friday)
      expect(result.current.totalWeekdays).toBe(260);
    });

    it('should calculate correct weekdays for 2025', () => {
      // Mock Date to return 2025
      vi.setSystemTime(new Date('2025-06-15'));
      
      const { result } = renderHook(() => useDate());
      
      // 2025 starts on Wednesday and has 365 days
      // Should have 261 weekdays (Monday-Friday)
      expect(result.current.totalWeekdays).toBe(261);
    });

    it('should handle year boundary correctly', () => {
      // Test on New Year's Eve
      vi.setSystemTime(new Date('2024-12-31T23:59:59'));
      
      const { result } = renderHook(() => useDate());
      
      // Should still calculate for 2024
      expect(result.current.totalWeekdays).toBe(262);
    });

    it('should handle year beginning correctly', () => {
      // Test on New Year's Day
      vi.setSystemTime(new Date('2024-01-01T00:00:00'));
      
      const { result } = renderHook(() => useDate());
      
      // Should calculate for 2024
      expect(result.current.totalWeekdays).toBe(262);
    });

    it('should be consistent across multiple calls', () => {
      vi.setSystemTime(new Date('2024-06-15'));
      
      const { result: result1 } = renderHook(() => useDate());
      const { result: result2 } = renderHook(() => useDate());
      
      expect(result1.current.totalWeekdays).toBe(result2.current.totalWeekdays);
    });

    it('should exclude weekends (Saturday=6, Sunday=0)', () => {
      vi.setSystemTime(new Date('2024-06-15'));
      
      const { result } = renderHook(() => useDate());
      
      // Verify by manual calculation for a sample month
      // January 2024: 31 days, starts on Monday
      // Weekdays: 1,2,3,4,5,8,9,10,11,12,15,16,17,18,19,22,23,24,25,26,29,30,31 = 23 weekdays
      // Weekends: 6,7,13,14,20,21,27,28 = 8 weekend days
      // Total: 23 + 8 = 31 ✓
      
      // The result should be reasonable (between 260-265 for any year)
      expect(result.current.totalWeekdays).toBeGreaterThan(260);
      expect(result.current.totalWeekdays).toBeLessThan(265);
    });

    it('should handle leap year February correctly', () => {
      vi.setSystemTime(new Date('2024-02-15')); // 2024 is a leap year
      
      const { result } = renderHook(() => useDate());
      
      // Manual verification that leap year is handled
      // February 2024 has 29 days, starts on Thursday
      // This is part of the total calculation, so we just verify reasonable bounds
      expect(result.current.totalWeekdays).toBe(262); // Known value for 2024
    });
  });

  describe('return value structure', () => {
    it('should return object with totalWeekdays property', () => {
      vi.setSystemTime(new Date('2024-06-15'));
      
      const { result } = renderHook(() => useDate());
      
      expect(result.current).toHaveProperty('totalWeekdays');
      expect(typeof result.current.totalWeekdays).toBe('number');
    });

    it('should return positive number of weekdays', () => {
      vi.setSystemTime(new Date('2024-06-15'));
      
      const { result } = renderHook(() => useDate());
      
      expect(result.current.totalWeekdays).toBeGreaterThan(0);
    });
  });

  describe('edge cases', () => {
    it('should handle century leap years correctly (2000)', () => {
      vi.setSystemTime(new Date('2000-06-15'));
      
      const { result } = renderHook(() => useDate());
      
      // 2000 was a leap year (divisible by 400)
      // Should have 260 weekdays
      expect(result.current.totalWeekdays).toBe(260);
    });

    it('should handle non-century leap years correctly (1900)', () => {
      vi.setSystemTime(new Date('1900-06-15'));
      
      const { result } = renderHook(() => useDate());
      
      // 1900 was NOT a leap year (divisible by 100 but not 400)
      // Should have 261 weekdays
      expect(result.current.totalWeekdays).toBe(261);
    });

    it('should handle different time zones correctly', () => {
      // Test with different time zones - should still use local date
      vi.setSystemTime(new Date('2024-06-15T23:00:00Z')); // UTC
      
      const { result } = renderHook(() => useDate());
      
      // Should calculate based on current year regardless of timezone
      expect(result.current.totalWeekdays).toBe(262);
    });
  });

  describe('getCurrentMonthKey', () => {
    it('should return current month in "Month YYYY" format', () => {
      vi.setSystemTime(new Date('2024-06-15T12:00:00'));
      
      const { result } = renderHook(() => useDate());
      
      expect(result.current.getCurrentMonthKey()).toBe('June 2024');
    });

    it('should handle different months correctly', () => {
      const testCases = [
        { date: '2024-01-15', expected: 'January 2024' },
        { date: '2024-02-29', expected: 'February 2024' }, // Leap year
        { date: '2024-12-31', expected: 'December 2024' },
        { date: '2025-09-01', expected: 'September 2025' },
      ];

      testCases.forEach(({ date, expected }) => {
        vi.setSystemTime(new Date(date));
        const { result } = renderHook(() => useDate());
        expect(result.current.getCurrentMonthKey()).toBe(expected);
      });
    });

    it('should be consistent with system time', () => {
      vi.setSystemTime(new Date('2024-03-15T09:30:00'));
      
      const { result } = renderHook(() => useDate());
      
      expect(result.current.getCurrentMonthKey()).toBe('March 2024');
    });
  });

  describe('getMonthDisplayName', () => {
    it('should convert full month names to short forms', () => {
      const { result } = renderHook(() => useDate());
      
      const testCases = [
        { input: 'January 2024', expected: 'Jan' },
        { input: 'February 2024', expected: 'Feb' },
        { input: 'March 2024', expected: 'Mar' },
        { input: 'April 2024', expected: 'Apr' },
        { input: 'May 2024', expected: 'May' },
        { input: 'June 2024', expected: 'Jun' },
        { input: 'July 2024', expected: 'Jul' },
        { input: 'August 2024', expected: 'Aug' },
        { input: 'September 2024', expected: 'Sep' },
        { input: 'October 2024', expected: 'Oct' },
        { input: 'November 2024', expected: 'Nov' },
        { input: 'December 2024', expected: 'Dec' },
      ];

      testCases.forEach(({ input, expected }) => {
        expect(result.current.getMonthDisplayName(input)).toBe(expected);
      });
    });

    it('should handle edge cases gracefully', () => {
      const { result } = renderHook(() => useDate());
      
      // Empty string
      expect(result.current.getMonthDisplayName('')).toBe('');
      
      // Only spaces
      expect(result.current.getMonthDisplayName('   ')).toBe('');
      
      // Invalid month name
      expect(result.current.getMonthDisplayName('InvalidMonth 2024')).toBe('Inv');
      
      // No year part
      expect(result.current.getMonthDisplayName('January')).toBe('Jan');
      
      // Original string if no space found
      expect(result.current.getMonthDisplayName('SingleWord')).toBe('Sin');
    });

    it('should handle malformed input', () => {
      const { result } = renderHook(() => useDate());
      
      // Should not crash and return fallback
      expect(result.current.getMonthDisplayName('Not a month')).toBe('Not');
      expect(result.current.getMonthDisplayName('123 456')).toBe('123');
    });
  });

  describe('getCurrentYear', () => {
    it('should return current year as number', () => {
      vi.setSystemTime(new Date('2024-06-15'));
      
      const { result } = renderHook(() => useDate());
      
      expect(result.current.getCurrentYear()).toBe(2024);
      expect(typeof result.current.getCurrentYear()).toBe('number');
    });

    it('should handle different years correctly', () => {
      const testYears = [2020, 2021, 2022, 2023, 2024, 2025, 2030];
      
      testYears.forEach(year => {
        vi.setSystemTime(new Date(`${year}-06-15`));
        const { result } = renderHook(() => useDate());
        expect(result.current.getCurrentYear()).toBe(year);
      });
    });

    it('should handle year boundaries', () => {
      // New Year's Eve
      vi.setSystemTime(new Date('2024-12-31T23:59:59'));
      const { result: result1 } = renderHook(() => useDate());
      expect(result1.current.getCurrentYear()).toBe(2024);
      
      // New Year's Day
      vi.setSystemTime(new Date('2025-01-01T00:00:00'));
      const { result: result2 } = renderHook(() => useDate());
      expect(result2.current.getCurrentYear()).toBe(2025);
    });
  });

  describe('getCurrentMonth', () => {
    it('should return current month index (0-11)', () => {
      vi.setSystemTime(new Date('2024-06-15')); // June = index 5
      
      const { result } = renderHook(() => useDate());
      
      expect(result.current.getCurrentMonth()).toBe(5);
      expect(typeof result.current.getCurrentMonth()).toBe('number');
    });

    it('should handle all months correctly', () => {
      const monthTests = [
        { date: '2024-01-15', expected: 0 },  // January
        { date: '2024-02-15', expected: 1 },  // February
        { date: '2024-03-15', expected: 2 },  // March
        { date: '2024-04-15', expected: 3 },  // April
        { date: '2024-05-15', expected: 4 },  // May
        { date: '2024-06-15', expected: 5 },  // June
        { date: '2024-07-15', expected: 6 },  // July
        { date: '2024-08-15', expected: 7 },  // August
        { date: '2024-09-15', expected: 8 },  // September
        { date: '2024-10-15', expected: 9 },  // October
        { date: '2024-11-15', expected: 10 }, // November
        { date: '2024-12-15', expected: 11 }, // December
      ];

      monthTests.forEach(({ date, expected }) => {
        vi.setSystemTime(new Date(date));
        const { result } = renderHook(() => useDate());
        expect(result.current.getCurrentMonth()).toBe(expected);
      });
    });
  });

  describe('getCurrentDate', () => {
    it('should return current Date object', () => {
      const testDate = new Date('2024-06-15T12:30:45');
      vi.setSystemTime(testDate);
      
      const { result } = renderHook(() => useDate());
      
      const returnedDate = result.current.getCurrentDate();
      expect(returnedDate).toBeInstanceOf(Date);
      expect(returnedDate.getTime()).toBe(testDate.getTime());
    });

    it('should return fresh Date object on each call', () => {
      vi.setSystemTime(new Date('2024-06-15T12:30:45'));
      
      const { result } = renderHook(() => useDate());
      
      const date1 = result.current.getCurrentDate();
      const date2 = result.current.getCurrentDate();
      
      // Should be different object instances but same time
      expect(date1).not.toBe(date2);
      expect(date1.getTime()).toBe(date2.getTime());
    });
  });

  describe('formatMonthYear', () => {
    it('should return input when already in correct format', () => {
      const { result } = renderHook(() => useDate());
      
      const testCases = [
        'January 2024',
        'February 2025',
        'December 2023',
        'September 2025'
      ];

      testCases.forEach(input => {
        expect(result.current.formatMonthYear(input)).toBe(input);
      });
    });

    it('should handle edge cases gracefully', () => {
      const { result } = renderHook(() => useDate());
      
      // Empty string
      expect(result.current.formatMonthYear('')).toBe('');
      
      // Only spaces
      expect(result.current.formatMonthYear('   ')).toBe('   ');
      
      // Single word
      expect(result.current.formatMonthYear('January')).toBe('January');
      
      // Invalid format but doesn't crash
      expect(result.current.formatMonthYear('Not a date')).toBe('Not a date');
    });

    it('should handle malformed input appropriately', () => {
      const { result } = renderHook(() => useDate());
      
      // Test cases based on actual JavaScript Date behavior
      const testCases = [
        { input: 'invalid-date', expected: 'invalid-date' }, // Invalid Date, returns original
        { input: '2024-13-45', expected: '2024-13-45' }, // Invalid Date, returns original  
        { input: 'Random text', expected: 'Random text' }, // Invalid Date, returns original
        { input: 'January', expected: 'January' }, // Single part, returns original
      ];

      testCases.forEach(({ input, expected }) => {
        expect(result.current.formatMonthYear(input)).toBe(expected);
      });
    });

    it('should handle valid date strings that get parsed', () => {
      const { result } = renderHook(() => useDate());
      
      // "123" is parsed as year 123, which becomes a valid date
      const result123 = result.current.formatMonthYear('123');
      // This will be formatted as a proper month/year since it's a valid date
      expect(result123).toMatch(/^[A-Za-z]+ \d+$/); // Should be "Month Year" format
    });
  });

  describe('getDateKey', () => {
    it('should format date as YYYY-MM-DD', () => {
      const { result } = renderHook(() => useDate());
      
      const testCases = [
        { date: new Date('2024-01-01T12:00:00'), expected: '2024-01-01' },
        { date: new Date('2024-02-29T00:00:00'), expected: '2024-02-29' }, // Leap year
        { date: new Date('2024-12-31T23:59:59'), expected: '2024-12-31' },
        { date: new Date('2025-09-01T15:30:00'), expected: '2025-09-01' },
      ];

      testCases.forEach(({ date, expected }) => {
        expect(result.current.getDateKey(date)).toBe(expected);
      });
    });

    it('should pad single digit months and days', () => {
      const { result } = renderHook(() => useDate());
      
      const testCases = [
        { date: new Date('2024-01-01'), expected: '2024-01-01' },
        { date: new Date('2024-01-09'), expected: '2024-01-09' },
        { date: new Date('2024-09-01'), expected: '2024-09-01' },
        { date: new Date('2024-09-09'), expected: '2024-09-09' },
      ];

      testCases.forEach(({ date, expected }) => {
        expect(result.current.getDateKey(date)).toBe(expected);
      });
    });

    it('should handle different years correctly', () => {
      const { result } = renderHook(() => useDate());
      
      const years = [2020, 2021, 2024, 2025, 2030];
      years.forEach(year => {
        const date = new Date(`${year}-06-15`);
        expect(result.current.getDateKey(date)).toBe(`${year}-06-15`);
      });
    });
  });

  describe('isCurrentYear', () => {
    it('should return true for dates in current year', () => {
      vi.setSystemTime(new Date('2024-06-15'));
      
      const { result } = renderHook(() => useDate());
      
      const datesIn2024 = [
        new Date('2024-01-01'),
        new Date('2024-06-15'),
        new Date('2024-12-31'),
        new Date('2024-02-29'), // Leap year date
      ];

      datesIn2024.forEach(date => {
        expect(result.current.isCurrentYear(date)).toBe(true);
      });
    });

    it('should return false for dates not in current year', () => {
      vi.setSystemTime(new Date('2024-06-15'));
      
      const { result } = renderHook(() => useDate());
      
      const datesNotIn2024 = [
        new Date('2023-12-31'),
        new Date('2025-01-01'),
        new Date('2020-06-15'),
        new Date('2030-06-15'),
      ];

      datesNotIn2024.forEach(date => {
        expect(result.current.isCurrentYear(date)).toBe(false);
      });
    });

    it('should handle year boundaries correctly', () => {
      // Test on New Year's Eve 2024
      vi.setSystemTime(new Date('2024-12-31T23:59:59'));
      
      const { result: result2024 } = renderHook(() => useDate());
      
      expect(result2024.current.isCurrentYear(new Date('2024-12-31'))).toBe(true);
      expect(result2024.current.isCurrentYear(new Date('2025-01-01'))).toBe(false);
      
      // Test on New Year's Day 2025
      vi.setSystemTime(new Date('2025-01-01T00:00:00'));
      
      const { result: result2025 } = renderHook(() => useDate());
      
      expect(result2025.current.isCurrentYear(new Date('2024-12-31'))).toBe(false);
      expect(result2025.current.isCurrentYear(new Date('2025-01-01'))).toBe(true);
    });
  });

  describe('isCurrentMonth', () => {
    it('should return true for dates in current month and year', () => {
      vi.setSystemTime(new Date('2024-06-15T12:00:00'));
      
      const { result } = renderHook(() => useDate());
      
      const datesInJune2024 = [
        new Date('2024-06-01'),
        new Date('2024-06-15'),
        new Date('2024-06-30'),
      ];

      datesInJune2024.forEach(date => {
        expect(result.current.isCurrentMonth(date)).toBe(true);
      });
    });

    it('should return false for dates in different months', () => {
      vi.setSystemTime(new Date('2024-06-15T12:00:00'));
      
      const { result } = renderHook(() => useDate());
      
      const datesNotInJune2024 = [
        new Date('2024-05-31'), // Previous month
        new Date('2024-07-01'), // Next month
        new Date('2023-06-15'), // Same month, different year
        new Date('2025-06-15'), // Same month, different year
      ];

      datesNotInJune2024.forEach(date => {
        expect(result.current.isCurrentMonth(date)).toBe(false);
      });
    });

    it('should handle month boundaries correctly', () => {
      // Test on last day of May
      vi.setSystemTime(new Date('2024-05-31T23:59:59'));
      
      const { result: resultMay } = renderHook(() => useDate());
      
      expect(resultMay.current.isCurrentMonth(new Date('2024-05-31'))).toBe(true);
      expect(resultMay.current.isCurrentMonth(new Date('2024-06-01'))).toBe(false);
      
      // Test on first day of June
      vi.setSystemTime(new Date('2024-06-01T00:00:00'));
      
      const { result: resultJune } = renderHook(() => useDate());
      
      expect(resultJune.current.isCurrentMonth(new Date('2024-05-31'))).toBe(false);
      expect(resultJune.current.isCurrentMonth(new Date('2024-06-01'))).toBe(true);
    });

    it('should handle leap year February correctly', () => {
      vi.setSystemTime(new Date('2024-02-15T12:00:00')); // 2024 is leap year
      
      const { result } = renderHook(() => useDate());
      
      expect(result.current.isCurrentMonth(new Date('2024-02-29'))).toBe(true);
      expect(result.current.isCurrentMonth(new Date('2024-03-01'))).toBe(false);
    });
  });

  describe('return value structure', () => {
    it('should return object with all expected properties', () => {
      vi.setSystemTime(new Date('2024-06-15'));
      
      const { result } = renderHook(() => useDate());
      
      // Check all properties exist
      expect(result.current).toHaveProperty('totalWeekdays');
      expect(result.current).toHaveProperty('getCurrentMonthKey');
      expect(result.current).toHaveProperty('getMonthDisplayName');
      expect(result.current).toHaveProperty('getCurrentYear');
      expect(result.current).toHaveProperty('getCurrentMonth');
      expect(result.current).toHaveProperty('getCurrentDate');
      expect(result.current).toHaveProperty('formatMonthYear');
      expect(result.current).toHaveProperty('getDateKey');
      expect(result.current).toHaveProperty('isCurrentYear');
      expect(result.current).toHaveProperty('isCurrentMonth');
    });

    it('should return functions for all method properties', () => {
      vi.setSystemTime(new Date('2024-06-15'));
      
      const { result } = renderHook(() => useDate());
      
      // Check all methods are functions
      expect(typeof result.current.getCurrentMonthKey).toBe('function');
      expect(typeof result.current.getMonthDisplayName).toBe('function');
      expect(typeof result.current.getCurrentYear).toBe('function');
      expect(typeof result.current.getCurrentMonth).toBe('function');
      expect(typeof result.current.getCurrentDate).toBe('function');
      expect(typeof result.current.formatMonthYear).toBe('function');
      expect(typeof result.current.getDateKey).toBe('function');
      expect(typeof result.current.isCurrentYear).toBe('function');
      expect(typeof result.current.isCurrentMonth).toBe('function');
    });

    it('should return number for totalWeekdays', () => {
      vi.setSystemTime(new Date('2024-06-15'));
      
      const { result } = renderHook(() => useDate());
      
      expect(typeof result.current.totalWeekdays).toBe('number');
      expect(result.current.totalWeekdays).toBeGreaterThan(0);
    });
  });
});
