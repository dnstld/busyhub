'use client';

import { useCalendar } from '@/app/context/events-provider-client';
import { useEvents } from '@/hooks/useEvents';
import { use } from 'react';
import EventsPanel from './events-panel';

const Events = ({ year = new Date().getFullYear() }: { year?: number }) => {
  const events = use(useCalendar());
  const { totalEvents, dailyEvents } = useEvents(events);

  return (
    <div className="flex flex-col gap-2">
      <p>
        {totalEvents} events in <b>{year}</b>
      </p>

      <EventsPanel
        events={events}
        year={year}
        aria-label={`Your heatmap timeline indicates that you have confirmed ${totalEvents} events over ${dailyEvents.size} days in ${year}.`}
      />
    </div>
  );
};

export default Events;
