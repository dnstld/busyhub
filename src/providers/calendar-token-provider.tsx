'use client';

import type { CalendarToken } from '@/app/actions/get-calendar-token';
import { createContext, ReactNode, useContext } from 'react';

const CalendarTokenContext = createContext<CalendarToken | null>(null);

export const CalendarTokenProvider = ({
  children,
  calendarToken,
}: {
  children: ReactNode;
  calendarToken: CalendarToken;
}) => {
  return (
    <CalendarTokenContext.Provider value={calendarToken}>
      {children}
    </CalendarTokenContext.Provider>
  );
};

export function useCalendarToken() {
  const context = useContext(CalendarTokenContext);
  return context;
}

export default CalendarTokenProvider;
