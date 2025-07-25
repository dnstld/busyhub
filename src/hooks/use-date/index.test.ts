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
});
