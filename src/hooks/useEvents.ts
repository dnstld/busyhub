import { CalendarEvent } from '@/app/actions/getEvents';
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

export const useEvents = (
  rawEvents: CalendarEvent[],
) => {
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

    const byDate = new Map<string, SanitizedEvent[]>();

    sanitized.forEach((ev) => {
      if (ev.status !== 'confirmed') return;
      if (!ev.start.dateTime) return;

      const dateObj = new Date(ev.start.dateTime);
      const dateKey = dateObj.toISOString().slice(0, 10);
      
      if (!byDate.has(dateKey)) byDate.set(dateKey, []);
      byDate.get(dateKey)!.push(ev);
    });

    const totalEvents = sanitized.length;

    return {
      events: sanitized,
      dailyEvents: byDate,
      totalEvents: totalEvents,
    };
  }, [rawEvents]);
};
