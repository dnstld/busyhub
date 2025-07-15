'use client';

import type { CalendarEvent } from '@/app/actions/getEvents';
import { createContext, ReactNode, useContext } from 'react';

const EventsContext = createContext<Promise<CalendarEvent[]> | null>(null);

export default function EventsProvider({
  children,
  events,
}: {
  children: ReactNode;
  events: Promise<CalendarEvent[]>;
}) {
  return (
    <EventsContext.Provider value={events}>{children}</EventsContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useCalendar must be used inside EventsProvider');
  }
  return context;
}
