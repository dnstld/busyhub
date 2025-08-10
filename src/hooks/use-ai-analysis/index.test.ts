import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAIAnalysis } from './index';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('useAIAnalysis', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear localStorage
    localStorage.clear();
  });

  afterEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useAIAnalysis());

    expect(result.current.analysis).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isCached).toBe(false);
    expect(result.current.cacheAge).toBeUndefined();
    expect(typeof result.current.generateAnalysis).toBe('function');
  });

  it('should fetch analysis successfully', async () => {
    const mockAnalysis = 'Your calendar shows efficient meeting patterns...';
    const mockResponse = {
      analysis: mockAnalysis,
      usage: { total_tokens: 150 } as const,
      cached: false
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const { result } = renderHook(() => useAIAnalysis());
    const testPrompt = 'Meeting data for analysis...';

    await act(async () => {
      await result.current.generateAnalysis(testPrompt);
    });

    expect(mockFetch).toHaveBeenCalledWith('/api/insights/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: testPrompt }),
    });

    expect(result.current.analysis).toBe(mockAnalysis);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isCached).toBe(false);
  });

  it('should handle loading state correctly', async () => {
    let resolvePromise: (value: unknown) => void;
    const mockPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    mockFetch.mockReturnValueOnce(mockPromise);

    const { result } = renderHook(() => useAIAnalysis());

    act(() => {
      result.current.generateAnalysis('test prompt');
    });

    // Should be loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();

    // Resolve the promise
    await act(async () => {
      resolvePromise!({
        ok: true,
        json: () => Promise.resolve({ 
          analysis: 'Test analysis', 
          cached: false 
        }),
      });
      await mockPromise;
    });

    // Should no longer be loading
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle API errors', async () => {
    const errorMessage = 'Failed to generate analysis';
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: errorMessage }),
    });

    const { result } = renderHook(() => useAIAnalysis());

    await act(async () => {
      await result.current.generateAnalysis('test prompt');
    });

    expect(result.current.analysis).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

  it('should handle network errors', async () => {
    const networkError = new Error('Network error');
    mockFetch.mockRejectedValueOnce(networkError);

    const { result } = renderHook(() => useAIAnalysis());

    await act(async () => {
      await result.current.generateAnalysis('test prompt');
    });

    expect(result.current.analysis).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Network error');
  });

  it('should handle empty prompt', async () => {
    const { result } = renderHook(() => useAIAnalysis());

    await act(async () => {
      await result.current.generateAnalysis('');
    });

    expect(result.current.error).toBe('Prompt cannot be empty');
    expect(result.current.isLoading).toBe(false);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should handle whitespace-only prompt', async () => {
    const { result } = renderHook(() => useAIAnalysis());

    await act(async () => {
      await result.current.generateAnalysis('   \n\t   ');
    });

    expect(result.current.error).toBe('Prompt cannot be empty');
    expect(result.current.isLoading).toBe(false);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should clear error on successful request', async () => {
    const { result } = renderHook(() => useAIAnalysis());

    // First, trigger an error
    await act(async () => {
      await result.current.generateAnalysis('');
    });

    expect(result.current.error).toBe('Prompt cannot be empty');

    // Then make a successful request
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ analysis: 'Success' }),
    });

    await act(async () => {
      await result.current.generateAnalysis('valid prompt');
    });

    expect(result.current.error).toBeNull();
    expect(result.current.analysis).toBe('Success');
  });

  it('should handle API error responses without error field', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({}),
    });

    const { result } = renderHook(() => useAIAnalysis());

    await act(async () => {
      await result.current.generateAnalysis('test prompt');
    });

    expect(result.current.error).toBe('Failed to generate analysis');
  });

  it('should handle cached responses', async () => {
    const mockAnalysis = 'Cached analysis result';
    const mockResponse = {
      analysis: mockAnalysis,
      usage: { total_tokens: 150 },
      cached: true,
      cacheAge: 2
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const { result } = renderHook(() => useAIAnalysis());

    await act(async () => {
      await result.current.generateAnalysis('test prompt');
    });

    expect(result.current.analysis).toBe(mockAnalysis);
    expect(result.current.isCached).toBe(true);
    expect(result.current.cacheAge).toBe(2);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
