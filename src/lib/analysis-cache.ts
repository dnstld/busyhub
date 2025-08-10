import { createHash } from 'crypto';

export interface CachedAnalysis {
  analysis: string;
  usage: unknown;
  timestamp: number;
  userEmail?: string;
}

// Cache expiration time: 3 days in milliseconds
export const CACHE_EXPIRATION_MS = 3 * 24 * 60 * 60 * 1000;

/**
 * In-memory cache for AI analysis results
 * In production, this should be replaced with Redis, a database, or another persistent cache
 */
class AnalysisCache {
  private cache = new Map<string, CachedAnalysis>();
  private maxSize = 1000; // Prevent memory bloat

  /**
   * Generate a cache key from prompt and optional user email
   */
  private getCacheKey(prompt: string, userEmail?: string): string {
    const hashInput = userEmail ? `${userEmail}:${prompt}` : prompt;
    return createHash('sha256').update(hashInput).digest('hex');
  }

  /**
   * Check if a cached entry has expired
   */
  private isCacheExpired(timestamp: number): boolean {
    return Date.now() - timestamp > CACHE_EXPIRATION_MS;
  }

  /**
   * Clean up expired entries to prevent memory bloat
   */
  private cleanupExpired(): void {
    if (this.cache.size <= this.maxSize) return;

    const cutoffTime = Date.now() - CACHE_EXPIRATION_MS;
    const expiredKeys: string[] = [];

    for (const [key, data] of this.cache.entries()) {
      if (data.timestamp < cutoffTime) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach(key => this.cache.delete(key));

    // If still too large, remove oldest entries (simple LRU)
    if (this.cache.size > this.maxSize) {
      const sortedEntries = Array.from(this.cache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const toRemove = sortedEntries.slice(0, this.cache.size - this.maxSize);
      toRemove.forEach(([key]) => this.cache.delete(key));
    }
  }

  /**
   * Get cached analysis if it exists and hasn't expired
   */
  get(prompt: string, userEmail?: string): CachedAnalysis | null {
    const cacheKey = this.getCacheKey(prompt, userEmail);
    const cachedData = this.cache.get(cacheKey);
    
    if (!cachedData) return null;
    
    if (this.isCacheExpired(cachedData.timestamp)) {
      this.cache.delete(cacheKey);
      return null;
    }
    
    return cachedData;
  }

  /**
   * Store analysis in cache
   */
  set(prompt: string, analysis: string, usage: unknown, userEmail?: string): void {
    const cacheKey = this.getCacheKey(prompt, userEmail);
    
    this.cache.set(cacheKey, {
      analysis,
      usage,
      timestamp: Date.now(),
      userEmail
    });

    this.cleanupExpired();
  }

  /**
   * Get cache statistics for monitoring
   */
  getStats(): { size: number; maxSize: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize
    };
  }

  /**
   * Clear entire cache (useful for testing)
   */
  clear(): void {
    this.cache.clear();
  }
}

// Export singleton instance
export const analysisCache = new AnalysisCache();
