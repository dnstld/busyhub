'use client';

import type { CalendarEvent } from '@/app/actions/get-events';
import { createContext, ReactNode, useContext } from 'react';

const EventsContext = createContext<CalendarEvent[] | null>(null);

export const EventsProvider = ({
  children,
  events,
}: {
  children: ReactNode;
  events: CalendarEvent[];
}) => {
  return (
    <EventsContext.Provider value={events}>{children}</EventsContext.Provider>
  );
};

export function useCalendar() {
  const context = useContext(EventsContext);
  if (context === null) {
    throw new Error('useCalendar must be used inside EventsProvider');
  }
  return context;
}

export default EventsProvider;
