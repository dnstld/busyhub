import { CalendarEvent } from '@/app/actions/get-events';
import { describe, expect, it } from 'vitest';
import { EVENT_STATUS } from '../../constants/events-constants';
import {
  hasValidDate,
  isConfirmedEvent,
  isValidConfirmedEvent
} from './index';

describe('eventUtils', () => {
  const mockEvent: CalendarEvent = {
    id: 'test-1',
    summary: 'Test Event',
    start: { dateTime: '2024-01-15T10:00:00Z' },
    end: { dateTime: '2024-01-15T11:00:00Z' },
    status: EVENT_STATUS.CONFIRMED
  };

  const mockInvalidEvent: CalendarEvent = {
    id: 'test-2',
    summary: 'Invalid Event',
    start: { dateTime: '' },
    end: { dateTime: '' },
    status: EVENT_STATUS.CONFIRMED
  };

  const mockTentativeEvent: CalendarEvent = {
    id: 'test-3',
    summary: 'Tentative Event',
    start: { dateTime: '2024-01-15T10:00:00Z' },
    end: { dateTime: '2024-01-15T11:00:00Z' },
    status: EVENT_STATUS.TENTATIVE
  };

  describe('hasValidDate', () => {
    it('should return true for events with valid dateTime', () => {
      expect(hasValidDate(mockEvent)).toBe(true);
    });

    it('should return false for events with empty dateTime', () => {
      expect(hasValidDate(mockInvalidEvent)).toBe(false);
    });

    it('should return false for events with null start', () => {
      const eventWithNullStart = { ...mockEvent, start: null };
      expect(hasValidDate(eventWithNullStart as unknown as CalendarEvent)).toBe(false);
    });

    it('should return false for events with undefined start', () => {
      const eventWithUndefinedStart = { ...mockEvent, start: undefined };
      expect(hasValidDate(eventWithUndefinedStart as unknown as CalendarEvent)).toBe(false);
    });
  });

  describe('isConfirmedEvent', () => {
    it('should return true for confirmed events', () => {
      expect(isConfirmedEvent(mockEvent)).toBe(true);
    });

    it('should return false for tentative events', () => {
      expect(isConfirmedEvent(mockTentativeEvent)).toBe(false);
    });

    it('should return false for cancelled events', () => {
      const cancelledEvent = { ...mockEvent, status: EVENT_STATUS.CANCELLED };
      expect(isConfirmedEvent(cancelledEvent)).toBe(false);
    });
  });

  describe('isValidConfirmedEvent', () => {
    it('should return true for valid confirmed events', () => {
      expect(isValidConfirmedEvent(mockEvent)).toBe(true);
    });

    it('should return false for confirmed events with invalid dates', () => {
      expect(isValidConfirmedEvent(mockInvalidEvent)).toBe(false);
    });

    it('should return false for tentative events even with valid dates', () => {
      expect(isValidConfirmedEvent(mockTentativeEvent)).toBe(false);
    });

    it('should return false for events that are neither valid nor confirmed', () => {
      const invalidTentativeEvent = { ...mockInvalidEvent, status: EVENT_STATUS.TENTATIVE };
      expect(isValidConfirmedEvent(invalidTentativeEvent)).toBe(false);
    });
  });

  describe('integration tests', () => {
    it('should handle array of mixed events correctly', () => {
      const events = [mockEvent, mockInvalidEvent, mockTentativeEvent];
      
      const validEvents = events.filter(hasValidDate);
      expect(validEvents).toHaveLength(2); // mockEvent and mockTentativeEvent
      
      const confirmedEvents = events.filter(isConfirmedEvent);
      expect(confirmedEvents).toHaveLength(2); // mockEvent and mockInvalidEvent
      
      const validConfirmedEvents = events.filter(isValidConfirmedEvent);
      expect(validConfirmedEvents).toHaveLength(1); // only mockEvent
    });
  });
});
