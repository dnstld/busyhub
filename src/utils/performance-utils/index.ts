import { useCallback, useRef } from 'react';

/**
 * Performance utilities for optimization
 */

/**
 * Debounce hook for expensive operations
 */
export const useDebounce = <T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]) as T;
};

/**
 * Throttle hook for limiting function calls
 */
export const useThrottle = <T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T => {
  const lastCall = useRef<number>(0);
  
  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      return callback(...args);
    }
  }, [callback, delay]) as T;
};

/**
 * Memoization cache for expensive computations
 */
export class MemoCache<TKey, TValue> {
  private cache = new Map<string, TValue>();
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  get(key: TKey, computeFn: () => TValue): TValue {
    const keyStr = JSON.stringify(key);
    
    if (this.cache.has(keyStr)) {
      return this.cache.get(keyStr)!;
    }

    const value = computeFn();
    
    // Implement LRU eviction if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    
    this.cache.set(keyStr, value);
    return value;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

/**
 * Batch processing utility for large datasets
 */
export const processBatch = <T, R>(
  items: T[],
  processor: (item: T) => R,
  batchSize: number = 1000
): R[] => {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = batch.map(processor);
    results.push(...batchResults);
    
    // Allow other tasks to run between batches
    if (i + batchSize < items.length) {
      // In a real scenario, you might want to use setTimeout or requestIdleCallback
      // For now, we'll just continue synchronously
    }
  }
  
  return results;
};

/**
 * Shallow comparison for dependency arrays
 */
export const shallowEqual = (a: unknown[], b: unknown[]): boolean => {
  if (a.length !== b.length) return false;
  
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  
  return true;
};

/**
 * Performance monitoring utilities
 */
export const perfUtils = {
  /**
   * Measure execution time of a function
   */
  measure: <T>(label: string, fn: () => T): T => {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    console.log(`${label}: ${(end - start).toFixed(2)}ms`);
    return result;
  },

  /**
   * Log memory usage (browser only)
   */
  logMemory: (label: string) => {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as { memory: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
      console.log(`${label} Memory:`, {
        used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
        total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
        limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`,
      });
    }
  },
};
