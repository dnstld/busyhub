import { CalendarEvent } from '@/app/actions/get-events';
import { createSafeDate, getDateKey, getOrSetMapValue, isNonEmptyString, isValidConfirmedEvent } from '@/utils';
import { calendar_v3 } from 'googleapis';
import { useMemo } from 'react';

type DateTimeTZ = Pick<calendar_v3.Schema$EventDateTime, 'dateTime' | 'timeZone'>;

export interface SanitizedEvent {
  id: CalendarEvent['id'];
  status: CalendarEvent['status'];
  start: DateTimeTZ;
  end: DateTimeTZ;
  attendees: CalendarEvent['attendees'];
  eventType: CalendarEvent['eventType'];
}

export const useEventsSanitization = (rawEvents: CalendarEvent[]) => {
  // Step 1: Sanitize the raw events
  const sanitized = useMemo(() => {
    return (rawEvents ?? []).map((e) => ({
      id: e.id,
      status: e.status,
      start: {
        dateTime: e.start?.dateTime,
        timeZone: e.start?.timeZone,
      },
      end: {
        dateTime: e.end?.dateTime,
        timeZone: e.end?.timeZone,
      },
      attendees: e.attendees ?? [],
      eventType: e.eventType,
    }));
  }, [rawEvents]);

  // Step 2: Filter confirmed events with valid dates (depends on sanitized)
  const confirmedEvents = useMemo(() => {
    return sanitized.filter(isValidConfirmedEvent);
  }, [sanitized]);

  // Step 3: Group by date for heatmap/timeline usage (depends on confirmedEvents)
  const dailyEvents = useMemo(() => {
    const byDate = new Map<string, SanitizedEvent[]>();
    
    confirmedEvents.forEach((ev) => {
      const dateTime = ev.start.dateTime;
      if (!isNonEmptyString(dateTime)) return;
      
      const dateObj = createSafeDate(dateTime);
      if (!dateObj) return; // Skip invalid dates
      
      const dateKey = getDateKey(dateObj);
      const eventsForDate = getOrSetMapValue(byDate, dateKey, []);
      eventsForDate.push(ev);
    });
    
    return byDate;
  }, [confirmedEvents]);

  // Return computed values
  return {
    sanitized,
    confirmedEvents,
    dailyEvents,
    totalEvents: confirmedEvents.length, // Simple property, no memoization needed
  };
};
