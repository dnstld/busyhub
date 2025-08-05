'use client';

import HeatmapChart from '@/components/presenters/charts/heatmap-chart';
import { useEvents } from '@/hooks/use-events';
import { useCalendar } from '@/providers/events-provider';

const Heatmap = () => {
  const events = useCalendar();
  const { totalEvents, dailyEvents } = useEvents(events);

  return (
    <section
      className="flex flex-col gap-4"
      aria-describedby="heatmap-description"
    >
      <h2 className="text-lg font-semibold">
        {totalEvents} events in your calendar this year
      </h2>

      <p id="heatmap-description" className="sr-only">
        This calendar activity heatmap shows your daily event count across the
        year. You have {totalEvents} total events across {dailyEvents.size}
        active days. Lighter colors represent higher activity. The grid is
        visual only and not interactive.
      </p>

      <HeatmapChart events={events} />
    </section>
  );
};

export default Heatmap;
