import { useCallback, useState } from 'react';
import { SanitizedEvent } from './useEvents';

interface HoveredDay {
  date: Date;
  events: SanitizedEvent[];
  position: { x: number; y: number };
}

export const usePanelTooltip = () => {
  const [hoveredDay, setHoveredDay] = useState<HoveredDay | null>(null);

  const handleMouseEnter = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement>,
      date: Date,
      events: SanitizedEvent[],
    ) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setHoveredDay({
        date,
        events,
        position: { x: rect.left + rect.width / 2, y: rect.top - 10 },
      });
    },
    [],
  );

  const handleMouseLeave = useCallback(() => setHoveredDay(null), []);

  const formatTooltipContent = useCallback((date: Date, events: SanitizedEvent[]) => {
    const eventCount = events.length;
    const dateStr = date.toLocaleDateString(undefined, {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });

    if (!eventCount) return `No events on ${dateStr}`;

    const eventText = eventCount === 1 ? 'event' : 'events';

    return `${eventCount} ${eventText} on ${dateStr}`;
  }, []);

  return { hoveredDay, handleMouseEnter, handleMouseLeave, formatTooltipContent };
};
