import { CalendarEvent } from '@/app/actions/getEvents';
import { getDateKey, isValidConfirmedEvent } from '@/utils';
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
  return useMemo(() => {
    const sanitized: SanitizedEvent[] = (rawEvents ?? []).map((e) => ({
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

    // Filter confirmed events with valid dates
    const confirmedEvents = sanitized.filter(isValidConfirmedEvent);

    // Group by date for heatmap/timeline usage
    const byDate = new Map<string, SanitizedEvent[]>();
    confirmedEvents.forEach((ev) => {
      const dateTime = ev.start.dateTime;
      if (!dateTime) return;
      
      const dateObj = new Date(dateTime);
      const dateKey = getDateKey(dateObj);
      
      if (!byDate.has(dateKey)) byDate.set(dateKey, []);
      byDate.get(dateKey)!.push(ev);
    });

    return {
      sanitized,
      confirmedEvents,
      dailyEvents: byDate,
      totalEvents: confirmedEvents.length,
    };
  }, [rawEvents]);
};
