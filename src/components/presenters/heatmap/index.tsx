'use client';

import HeatmapChart from '@/components/presenters/charts/heatmap-chart';
import { useEvents } from '@/hooks/use-events';
import { useCalendar } from '@/providers/events-provider';

const Heatmap = ({ year = new Date().getFullYear() }: { year?: number }) => {
  const events = useCalendar();
  const { totalEvents, dailyEvents } = useEvents(events);

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">
        {totalEvents} events in {year}
      </h2>

      <HeatmapChart
        events={events}
        year={year}
        aria-label={`Your heatmap timeline indicates that you have ${totalEvents} events over ${dailyEvents.size} days in ${year}.`}
      />
    </section>
  );
};

export default Heatmap;
