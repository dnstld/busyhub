import { useCallback, useState } from 'react';

interface UseAIAnalysisResult {
  analysis: string | null;
  isLoading: boolean;
  error: string | null;
  generateAnalysis: (prompt: string) => Promise<void>;
  isCached: boolean;
  cacheAge?: number; // in hours
}

interface CachedAnalysis {
  analysis: string;
  timestamp: number;
  prompt: string;
}

// Cache expiration time: 3 days in milliseconds
const CACHE_EXPIRATION_MS = 3 * 24 * 60 * 60 * 1000;
const STORAGE_KEY = 'busyhub_ai_analysis_cache';

function getCacheKey(prompt: string): string {
  // Create a simple hash of the prompt for localStorage key
  let hash = 0;
  for (let i = 0; i < prompt.length; i++) {
    const char = prompt.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `${STORAGE_KEY}_${Math.abs(hash)}`;
}

function getFromLocalStorage(prompt: string): CachedAnalysis | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const key = getCacheKey(prompt);
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const data: CachedAnalysis = JSON.parse(cached);
    const isExpired = Date.now() - data.timestamp > CACHE_EXPIRATION_MS;
    
    if (isExpired) {
      localStorage.removeItem(key);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
}

function saveToLocalStorage(prompt: string, analysis: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const key = getCacheKey(prompt);
    const data: CachedAnalysis = {
      analysis,
      timestamp: Date.now(),
      prompt
    };
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

export const useAIAnalysis = (): UseAIAnalysisResult => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);
  const [cacheAge, setCacheAge] = useState<number | undefined>(undefined);

  const generateAnalysis = useCallback(async (prompt: string) => {
    if (!prompt.trim()) {
      setError('Prompt cannot be empty');
      return;
    }

    // First check localStorage cache
    const cachedData = getFromLocalStorage(prompt);
    if (cachedData) {
      setAnalysis(cachedData.analysis);
      setIsCached(true);
      setCacheAge(Math.round((Date.now() - cachedData.timestamp) / (1000 * 60 * 60)));
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsCached(false);
    setCacheAge(undefined);

    try {
      const response = await fetch('/api/insights/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate analysis');
      }

      const data = await response.json();
      setAnalysis(data.analysis);
      setIsCached(data.cached || false);
      setCacheAge(data.cacheAge);
      
      // Save to localStorage if it's a fresh generation (not cached)
      if (!data.cached) {
        saveToLocalStorage(prompt, data.analysis);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('AI Analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    analysis,
    isLoading,
    error,
    generateAnalysis,
    isCached,
    cacheAge,
  };
};
