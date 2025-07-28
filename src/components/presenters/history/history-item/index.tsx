import { HistoryDetails } from '@/components/presenters/history/history-details';
import { FilterType, MonthData } from '@/hooks/use-events';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { JSX, useState } from 'react';

export function HistoryItem({
  month,
  monthData,
}: {
  month: string;
  monthData: MonthData;
  filter: FilterType;
}): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);
  const totalEvents = monthData.events.length;

  const getSummaryText = () => {
    const eventText = totalEvents === 1 ? 'event' : 'events';
    return `${totalEvents} ${eventText}`;
  };

  return (
    <div className="border-b border-zinc-800 last:border-b-0">
      <button
        className="w-full py-3 flex items-center justify-between hover:bg-zinc-800/30 transition-colors cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="text-left">
            <div className="text-sm text-lime-400 font-medium">{month}</div>
            <div className="text-xs text-zinc-400">{getSummaryText()}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 bg-zinc-800 px-2 py-1 rounded">
              {totalEvents}
            </span>
            {isExpanded ? (
              <ChevronDown className="text-zinc-400" size={16} />
            ) : (
              <ChevronRight className="text-zinc-400" size={16} />
            )}
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="pb-3">
          <div className="space-y-3">
            {monthData.events.map((event) => (
              <HistoryDetails key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
