import { describe, expect, it } from 'vitest';
import { formatDate } from './index';

describe('formatDate', () => {
  it('should format date string correctly for default locale', () => {
    const date = '2024-01-15T10:30:00Z';
    const result = formatDate(date);
    expect(result).toBe('Jan 15');
  });

  it('should format date string correctly for different locale', () => {
    const date = '2024-01-15T10:30:00Z';
    const result = formatDate(date, 'de-DE');
    expect(result).toBe('15. Jan.');
  });

  it('should handle different date formats', () => {
    const dates = [
      '2024-03-01',
      '2024-12-31T23:59:59Z',
      '2024-06-15T12:00:00.000Z'
    ];
    
    dates.forEach(date => {
      expect(() => formatDate(date)).not.toThrow();
      expect(formatDate(date)).toMatch(/\w{3} \d{1,2}/);
    });
  });

  it('should handle edge cases', () => {
    // Test leap year
    expect(formatDate('2024-02-29')).toBe('Feb 29');
    
    // Test different months
    expect(formatDate('2024-12-01')).toBe('Dec 1');
    expect(formatDate('2024-01-01')).toBe('Jan 1');
  });

  it('should handle invalid dates gracefully', () => {
    expect(() => formatDate('invalid-date')).not.toThrow();
  });
});
