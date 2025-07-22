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

export interface MonthData {
  events: CalendarEvent[];
  days: { [dayKey: string]: CalendarEvent[] };
}

export interface GroupedEvents {
  [monthKey: string]: MonthData;
}

export interface DailyEventStats {
  date: string; // YYYY-MM-DD format
  count: number;
  events: SanitizedEvent[];
}

export type FilterType = 'past' | 'upcoming' | 'all';

export const useEvents = (rawEvents: CalendarEvent[]) => {
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
    const confirmedEvents = sanitized.filter(
      (ev) => ev.status === 'confirmed' && ev.start.dateTime
    );

    // Group by date for heatmap/timeline usage
    const byDate = new Map<string, SanitizedEvent[]>();
    confirmedEvents.forEach((ev) => {
      const dateObj = new Date(ev.start.dateTime!);
      const dateKey = dateObj.toISOString().slice(0, 10);
      
      if (!byDate.has(dateKey)) byDate.set(dateKey, []);
      byDate.get(dateKey)!.push(ev);
    });

    // Create daily stats array for charts
    const dailyStats: DailyEventStats[] = Array.from(byDate.entries())
      .map(([date, events]) => ({
        date,
        count: events.length,
        events,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Group events by month for history component
    const groupEventsByMonth = (events: CalendarEvent[], filter: FilterType): GroupedEvents => {
      const grouped: GroupedEvents = {};
      const now = new Date();

      const filteredEvents = events.filter((event) => {
        const eventDate = parseEventDate(event);
        if (!eventDate) return false;

        switch (filter) {
          case 'past':
            return eventDate < now;
          case 'upcoming':
            return eventDate >= now;
          case 'all':
            return true;
        }
      });

      filteredEvents.forEach((event) => {
        const eventDate = parseEventDate(event);
        if (!eventDate) return;

        const monthKey = eventDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
        });

        if (!grouped[monthKey]) {
          grouped[monthKey] = { events: [], days: {} };
        }

        grouped[monthKey].events.push(event);

        const dayKey = eventDate.toDateString();
        if (!grouped[monthKey].days[dayKey]) {
          grouped[monthKey].days[dayKey] = [];
        }
        grouped[monthKey].days[dayKey].push(event);
      });

      return grouped;
    };

    // Helper function to get filtered data for history component
    const getHistoryData = (filter: FilterType) => {
      const monthlyEvents = groupEventsByMonth(rawEvents, filter);
      const sortedMonths = Object.keys(monthlyEvents).sort(
        (a, b) => new Date(b).getTime() - new Date(a).getTime()
      );
      return { monthlyEvents, sortedMonths };
    };

    // Get weekly aggregated data for charts
    const getWeeklyStats = () => {
      const weeklyMap = new Map<string, { count: number; events: SanitizedEvent[] }>();
      
      confirmedEvents.forEach((event) => {
        const date = new Date(event.start.dateTime!);
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay()); // Start on Sunday
        const weekKey = startOfWeek.toISOString().slice(0, 10);
        
        if (!weeklyMap.has(weekKey)) {
          weeklyMap.set(weekKey, { count: 0, events: [] });
        }
        
        const week = weeklyMap.get(weekKey)!;
        week.count++;
        week.events.push(event);
      });

      return Array.from(weeklyMap.entries())
        .map(([date, data]) => ({
          date,
          count: data.count,
          events: data.events,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
    };

    // Get monthly aggregated data for charts
    const getMonthlyStats = () => {
      const monthlyMap = new Map<string, { count: number; events: SanitizedEvent[] }>();
      
      confirmedEvents.forEach((event) => {
        const date = new Date(event.start.dateTime!);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyMap.has(monthKey)) {
          monthlyMap.set(monthKey, { count: 0, events: [] });
        }
        
        const month = monthlyMap.get(monthKey)!;
        month.count++;
        month.events.push(event);
      });

      return Array.from(monthlyMap.entries())
        .map(([date, data]) => ({
          date,
          count: data.count,
          events: data.events,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
    };

    return {
      // Original data
      events: sanitized,
      confirmedEvents,
      totalEvents: confirmedEvents.length,
      
      // For Timeline/Heatmap
      dailyEvents: byDate,
      dailyStats,
      
      // For History component
      getHistoryData,
      
      // For Charts
      weeklyStats: getWeeklyStats(),
      monthlyStats: getMonthlyStats(),
      
      // Utility functions
      getEventsByDateRange: (startDate: string, endDate: string) => {
        return confirmedEvents.filter((event) => {
          const eventDate = event.start.dateTime!.slice(0, 10);
          return eventDate >= startDate && eventDate <= endDate;
        });
      },
      
      // Get events for a specific date
      getEventsForDate: (date: string) => {
        return byDate.get(date) || [];
      },
    };
  }, [rawEvents]);
};

// Helper function
const parseEventDate = (event: CalendarEvent): Date | null => {
  const dateStr = event.start?.dateTime;
  return dateStr ? new Date(dateStr) : null;
};