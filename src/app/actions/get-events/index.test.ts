import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getEvents } from './index';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('getEvents server action', () => {
  const mockAccessToken = 'mock-access-token';
  const mockUserEmail = 'test@example.com';
  
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock Date to ensure consistent time ranges
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should fetch events successfully', async () => {
    const mockEvents = [
      {
        id: 'event1',
        summary: 'Test Event 1',
        start: { dateTime: '2024-01-15T10:00:00Z' },
        end: { dateTime: '2024-01-15T11:00:00Z' }
      },
      {
        id: 'event2',
        summary: 'Test Event 2',
        start: { dateTime: '2024-02-20T14:00:00Z' },
        end: { dateTime: '2024-02-20T15:00:00Z' }
      }
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValueOnce({
        items: mockEvents
      })
    });

    const result = await getEvents(mockAccessToken, mockUserEmail);

    expect(result).toEqual(mockEvents);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should make correct API call with proper parameters', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValueOnce({ items: [] })
    });

    await getEvents(mockAccessToken, mockUserEmail);

    const [[url, options]] = mockFetch.mock.calls;
    
    expect(url).toContain(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(mockUserEmail)}/events`);
    expect(url).toContain('singleEvents=true');
    expect(url).toContain('orderBy=startTime');
    expect(url).toContain('maxResults=2500');
    expect(url).toContain('timeMin=2024-01-01T00%3A00%3A00.000Z');
    expect(url).toContain('timeMax=2025-01-01T00%3A00%3A00.000Z');

    expect(options.headers).toEqual({
      Authorization: `Bearer ${mockAccessToken}`,
      'Content-Type': 'application/json'
    });
  });

  it('should handle empty response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValueOnce({})
    });

    const result = await getEvents(mockAccessToken, mockUserEmail);

    expect(result).toEqual([]);
  });

  it('should handle response with null items', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValueOnce({ items: null })
    });

    const result = await getEvents(mockAccessToken, mockUserEmail);

    expect(result).toEqual([]);
  });

  it('should throw error when API returns error', async () => {
    const mockError = {
      error: {
        message: 'Invalid credentials'
      }
    };

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: vi.fn().mockResolvedValueOnce(mockError)
    });

    await expect(getEvents(mockAccessToken, mockUserEmail)).rejects.toThrow('Invalid credentials');
  });

  it('should throw generic error when no error message provided', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: vi.fn().mockResolvedValueOnce({})
    });

    await expect(getEvents(mockAccessToken, mockUserEmail)).rejects.toThrow('HTTP 500');
  });

  it('should handle network errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(getEvents(mockAccessToken, mockUserEmail)).rejects.toThrow('Network error');
  });

  it('should use correct time range for current year', async () => {
    // Set a specific date
    vi.setSystemTime(new Date('2023-08-15T12:00:00Z'));

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValueOnce({ items: [] })
    });

    await getEvents(mockAccessToken, mockUserEmail);

    const [[url]] = mockFetch.mock.calls;
    
    expect(url).toContain('timeMin=2023-01-01T00%3A00%3A00.000Z');
    expect(url).toContain('timeMax=2024-01-01T00%3A00%3A00.000Z');
  });

  it('should handle malformed JSON response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: vi.fn().mockRejectedValueOnce(new Error('Invalid JSON'))
    });

    await expect(getEvents(mockAccessToken, mockUserEmail)).rejects.toThrow('Invalid JSON');
  });
});
