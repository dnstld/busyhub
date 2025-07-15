'use client';

import { CalendarEvent } from '@/app/actions/getEvents';
import { SanitizedEvent, useEvents } from '@/hooks/useEvents';
import { useEventsGrid } from '@/hooks/useEventsGrid';
import { intensityColors, useIntensityScale } from '@/hooks/useIntensityScale';
import { usePanelTooltip } from '@/hooks/usePanelTooltip';

const EventsPanel = ({
  events,
  year = new Date().getFullYear(),
  ...rest
}: {
  events: CalendarEvent[];
  year?: number;
  rest?: React.HTMLAttributes<HTMLDivElement>;
}) => {
  const { dailyEvents } = useEvents(events);
  const eventsGrid = useEventsGrid(dailyEvents, year);

  const getIntensityClass = useIntensityScale();
  const {
    hoveredDay,
    handleMouseEnter,
    handleMouseLeave,
    formatTooltipContent,
  } = usePanelTooltip();

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const dayLabels = ['Mon', 'Wed', 'Fri'];

  return (
    <div className="rounded-lg border border-zinc-800 p-4" {...rest}>
      <div aria-hidden={true}>
        <div className="flex overflow-x-auto">
          {/* day labels */}
          <div className="flex flex-col justify-between mr-4 mt-7 py-3 text-xs">
            {dayLabels.map((d) => (
              <span key={d} className="h-3 mb-1 flex items-center">
                {d}
              </span>
            ))}
          </div>

          {/* grid + month labels */}
          <div>
            <div className="flex justify-between mb-2">
              {months.map((month) => (
                <span key={month} className="text-xs">
                  {month}
                </span>
              ))}
            </div>

            <div className="flex">
              {eventsGrid.map((week, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${
                    i === eventsGrid.length - 1 ? 'mr-0' : 'mr-1'
                  }`}
                >
                  {week.map((day, di) => (
                    <div
                      key={`${day.dateKey}-${di}`}
                      className={`
                        w-[10px] xl:w-3 h-[10px] xl:h-3 rounded-xs cursor-pointer transition-all
                        hover:ring hover:ring-white hover:ring-opacity-50
                        ${di === week.length - 1 ? 'mb-0' : 'mb-1'}
                        ${
                          day.isCurrentYear
                            ? getIntensityClass(day.eventCount)
                            : 'bg-zinc-800 opacity-50'
                        }
                      `}
                      onMouseEnter={(e) =>
                        handleMouseEnter(
                          e,
                          day.date,
                          day.events as SanitizedEvent[]
                        )
                      }
                      onMouseLeave={handleMouseLeave}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="flex items-center mt-4 text-xs">
            <span className="mr-2">Less</span>
            <div className="flex space-x-1">
              {intensityColors.map((c) => (
                <div key={c} className={`w-3 h-3 rounded-xs ${c}`}></div>
              ))}
            </div>
            <span className="ml-2">More</span>
          </div>
        </div>

        {hoveredDay && (
          <div
            className="fixed z-50 bg-zinc-100 text-zinc-800 text-xs px-2 py-1 rounded shadow-lg pointer-events-none"
            style={{
              left: hoveredDay.position.x,
              top: hoveredDay.position.y,
              transform: 'translate(-50%, -100%)',
            }}
          >
            {formatTooltipContent(hoveredDay.date, hoveredDay.events)}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPanel;
