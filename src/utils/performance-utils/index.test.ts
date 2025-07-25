import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    MemoCache,
    processBatch,
    useDebounce,
    useThrottle
} from './index';

describe('performanceUtils', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('useDebounce', () => {
    it('should debounce function calls', () => {
      const mockFn = vi.fn();
      const { result } = renderHook(() => useDebounce(mockFn, 1000));

      // Call multiple times rapidly
      act(() => {
        result.current('call1');
        result.current('call2');
        result.current('call3');
      });

      // Should not have been called yet
      expect(mockFn).not.toHaveBeenCalled();

      // Fast-forward time
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      // Should only be called once with the last arguments
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('call3');
    });
  });

  describe('useThrottle', () => {
    it('should throttle function calls', () => {
      const mockFn = vi.fn();
      const { result } = renderHook(() => useThrottle(mockFn, 1000));

      // First call should execute immediately
      act(() => {
        result.current('call1');
      });

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('call1');

      // Subsequent calls within delay should be ignored
      act(() => {
        result.current('call2');
        result.current('call3');
      });

      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('MemoCache', () => {
    let cache: MemoCache<string, number>;

    beforeEach(() => {
      cache = new MemoCache<string, number>(3);
    });

    it('should cache computed values', () => {
      const computeFn = vi.fn(() => 42);
      
      const result1 = cache.get('key1', computeFn);
      const result2 = cache.get('key1', computeFn);

      expect(result1).toBe(42);
      expect(result2).toBe(42);
      expect(computeFn).toHaveBeenCalledTimes(1); // Should only compute once
    });

    it('should respect max size', () => {
      cache.get('key1', () => 1);
      cache.get('key2', () => 2);
      cache.get('key3', () => 3);
      
      expect(cache.size()).toBe(3);
      
      // Adding one more should not exceed max size
      cache.get('key4', () => 4);
      
      expect(cache.size()).toBe(3);
    });

    it('should clear all entries', () => {
      cache.get('key1', () => 1);
      cache.get('key2', () => 2);

      expect(cache.size()).toBe(2);

      cache.clear();

      expect(cache.size()).toBe(0);
    });
  });

  describe('processBatch', () => {
    it('should process items in batches', () => {
      const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const processor = (x: number) => x * 2;
      
      const results = processBatch(items, processor, 3);
      
      expect(results).toEqual([2, 4, 6, 8, 10, 12, 14, 16, 18, 20]);
    });

    it('should handle empty arrays', () => {
      const results = processBatch([], (x: number) => x, 10);
      expect(results).toEqual([]);
    });

    it('should handle single item', () => {
      const results = processBatch([42], (x: number) => x * 2, 10);
      expect(results).toEqual([84]);
    });
  });
});
