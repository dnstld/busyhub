import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { intensityColors, useIntensityScale } from './index';

describe('useIntensityScale', () => {
  describe('Default Configuration', () => {
    it('should return correct classes for default thresholds', () => {
      const { result } = renderHook(() => useIntensityScale());
      
      const getIntensityClass = result.current;
      
      // Test default thresholds [0, 1, 2, 3] with default colors
      expect(getIntensityClass(0)).toBe('bg-zinc-800');   // count <= 0
      expect(getIntensityClass(1)).toBe('bg-lime-900');   // count <= 1
      expect(getIntensityClass(2)).toBe('bg-lime-700');   // count <= 2
      expect(getIntensityClass(3)).toBe('bg-lime-500');   // count <= 3
      expect(getIntensityClass(4)).toBe('bg-lime-300');   // count > 3 (highest)
      expect(getIntensityClass(10)).toBe('bg-lime-300');  // count > 3 (highest)
    });

    it('should use default intensity colors', () => {
      expect(intensityColors).toEqual([
        'bg-zinc-800',
        'bg-lime-900',
        'bg-lime-700',
        'bg-lime-500',
        'bg-lime-300',
      ]);
    });

    it('should handle negative counts gracefully', () => {
      const { result } = renderHook(() => useIntensityScale());
      
      const getIntensityClass = result.current;
      
      // Negative counts should map to first class (count <= 0)
      expect(getIntensityClass(-1)).toBe('bg-zinc-800');
      expect(getIntensityClass(-10)).toBe('bg-zinc-800');
    });
  });

  describe('Custom Thresholds', () => {
    it('should work with custom thresholds', () => {
      const customThresholds = [0, 5, 10];
      const customClasses = ['low', 'medium', 'high', 'max'];
      
      const { result } = renderHook(() => 
        useIntensityScale(customThresholds, customClasses)
      );
      
      const getIntensityClass = result.current;
      
      expect(getIntensityClass(0)).toBe('low');      // count <= 0
      expect(getIntensityClass(3)).toBe('medium');   // 0 < count <= 5
      expect(getIntensityClass(5)).toBe('medium');   // count <= 5
      expect(getIntensityClass(8)).toBe('high');     // 5 < count <= 10
      expect(getIntensityClass(10)).toBe('high');    // count <= 10
      expect(getIntensityClass(15)).toBe('max');     // count > 10
    });

    it('should handle single threshold', () => {
      const thresholds = [2];
      const classes = ['below', 'above'];
      
      const { result } = renderHook(() => 
        useIntensityScale(thresholds, classes)
      );
      
      const getIntensityClass = result.current;
      
      expect(getIntensityClass(0)).toBe('below');
      expect(getIntensityClass(1)).toBe('below');
      expect(getIntensityClass(2)).toBe('below');
      expect(getIntensityClass(3)).toBe('above');
      expect(getIntensityClass(100)).toBe('above');
    });

    it('should handle empty thresholds array', () => {
      const thresholds: number[] = [];
      const classes = ['only-class'];
      
      const { result } = renderHook(() => 
        useIntensityScale(thresholds, classes)
      );
      
      const getIntensityClass = result.current;
      
      // All counts should map to the only class
      expect(getIntensityClass(0)).toBe('only-class');
      expect(getIntensityClass(1)).toBe('only-class');
      expect(getIntensityClass(100)).toBe('only-class');
    });

    it('should handle decimal thresholds', () => {
      const thresholds = [0.5, 1.5, 2.5];
      const classes = ['a', 'b', 'c', 'd'];
      
      const { result } = renderHook(() => 
        useIntensityScale(thresholds, classes)
      );
      
      const getIntensityClass = result.current;
      
      expect(getIntensityClass(0)).toBe('a');     // count <= 0.5
      expect(getIntensityClass(0.5)).toBe('a');   // count <= 0.5
      expect(getIntensityClass(1)).toBe('b');     // 0.5 < count <= 1.5
      expect(getIntensityClass(1.5)).toBe('b');   // count <= 1.5
      expect(getIntensityClass(2)).toBe('c');     // 1.5 < count <= 2.5
      expect(getIntensityClass(3)).toBe('d');     // count > 2.5
    });
  });

  describe('Error Handling', () => {
    it('should warn when classes length does not match thresholds length + 1', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const thresholds = [1, 2, 3];
      const classes = ['a', 'b']; // Wrong length: should be 4, not 2
      
      renderHook(() => useIntensityScale(thresholds, classes));
      
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'useIntensityScale: classes.length must equal thresholds.length + 1'
      );
      
      consoleWarnSpy.mockRestore();
    });

    it('should still work despite mismatched array lengths', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const thresholds = [1, 2];
      const classes = ['a']; // Too few classes
      
      const { result } = renderHook(() => 
        useIntensityScale(thresholds, classes)
      );
      
      const getIntensityClass = result.current;
      
      // Should still return something (may be undefined for out-of-bounds)
      expect(typeof getIntensityClass).toBe('function');
      
      consoleWarnSpy.mockRestore();
    });
  });

  describe('Memoization', () => {
    it('should memoize the returned function when dependencies stay the same', () => {
      const thresholds = [1, 2, 3];
      const classes = ['a', 'b', 'c', 'd'];
      
      const { result, rerender } = renderHook(
        ({ t, c }) => useIntensityScale(t, c),
        {
          initialProps: { t: thresholds, c: classes }
        }
      );
      
      const firstFunction = result.current;
      
      // Rerender with same props
      rerender({ t: thresholds, c: classes });
      
      // Should be the same function reference
      expect(result.current).toBe(firstFunction);
    });

    it('should create new function when thresholds change', () => {
      const initialThresholds = [1, 2, 3];
      const classes = ['a', 'b', 'c', 'd'];
      
      const { result, rerender } = renderHook(
        ({ t, c }) => useIntensityScale(t, c),
        {
          initialProps: { t: initialThresholds, c: classes }
        }
      );
      
      const firstFunction = result.current;
      
      // Change thresholds
      const newThresholds = [2, 4, 6];
      rerender({ t: newThresholds, c: classes });
      
      // Should be a different function reference
      expect(result.current).not.toBe(firstFunction);
      
      // And should work with new thresholds
      expect(result.current(1)).toBe('a');  // count <= 2
      expect(result.current(3)).toBe('b');  // 2 < count <= 4
    });

    it('should create new function when classes change', () => {
      const thresholds = [1, 2, 3];
      const initialClasses = ['a', 'b', 'c', 'd'];
      
      const { result, rerender } = renderHook(
        ({ t, c }) => useIntensityScale(t, c),
        {
          initialProps: { t: thresholds, c: initialClasses }
        }
      );
      
      const firstFunction = result.current;
      
      // Change classes
      const newClasses = ['x', 'y', 'z', 'w'];
      rerender({ t: thresholds, c: newClasses });
      
      // Should be a different function reference
      expect(result.current).not.toBe(firstFunction);
      
      // And should use new classes
      expect(result.current(0)).toBe('x');
      expect(result.current(2)).toBe('y');
    });
  });

  describe('Real-world Usage Patterns', () => {
    it('should work with typical GitHub-style contribution levels', () => {
      const githubThresholds = [0, 1, 3, 6];
      const githubClasses = [
        'bg-gray-100',      // No contributions
        'bg-green-200',     // 1-1 contributions
        'bg-green-400',     // 2-3 contributions  
        'bg-green-600',     // 4-6 contributions
        'bg-green-800',     // 7+ contributions
      ];
      
      const { result } = renderHook(() => 
        useIntensityScale(githubThresholds, githubClasses)
      );
      
      const getIntensityClass = result.current;
      
      expect(getIntensityClass(0)).toBe('bg-gray-100');
      expect(getIntensityClass(1)).toBe('bg-green-200');
      expect(getIntensityClass(2)).toBe('bg-green-400');
      expect(getIntensityClass(3)).toBe('bg-green-400');
      expect(getIntensityClass(5)).toBe('bg-green-600');
      expect(getIntensityClass(6)).toBe('bg-green-600');
      expect(getIntensityClass(10)).toBe('bg-green-800');
    });

    it('should work with calendar event intensity mapping', () => {
      const eventThresholds = [0, 2, 5, 8];
      const eventClasses = [
        'bg-slate-50',      // No events
        'bg-blue-200',      // 1-2 events
        'bg-blue-400',      // 3-5 events
        'bg-blue-600',      // 6-8 events
        'bg-blue-800',      // 9+ events
      ];
      
      const { result } = renderHook(() => 
        useIntensityScale(eventThresholds, eventClasses)
      );
      
      const getIntensityClass = result.current;
      
      expect(getIntensityClass(0)).toBe('bg-slate-50');   // No events
      expect(getIntensityClass(1)).toBe('bg-blue-200');   // Light activity
      expect(getIntensityClass(4)).toBe('bg-blue-400');   // Medium activity
      expect(getIntensityClass(7)).toBe('bg-blue-600');   // High activity
      expect(getIntensityClass(12)).toBe('bg-blue-800');  // Very high activity
    });
  });

  describe('Performance', () => {
    it('should handle large numbers efficiently', () => {
      const { result } = renderHook(() => useIntensityScale());
      
      const getIntensityClass = result.current;
      
      // Should handle very large numbers without issues
      expect(getIntensityClass(1000000)).toBe('bg-lime-300');
      expect(getIntensityClass(Number.MAX_SAFE_INTEGER)).toBe('bg-lime-300');
    });

    it('should handle many different input values consistently', () => {
      const { result } = renderHook(() => useIntensityScale());
      
      const getIntensityClass = result.current;
      
      // Test a range of values
      for (let i = 0; i <= 20; i++) {
        const className = getIntensityClass(i);
        expect(typeof className).toBe('string');
        expect(className).toMatch(/^bg-/); // Should be a Tailwind background class
      }
    });
  });
});
