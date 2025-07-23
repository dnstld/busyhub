import { MonthData } from '@/hooks/useHistory';
import { CalendarDays, ChevronDown, ChevronRight } from 'lucide-react';
import { JSX, useState } from 'react';
import { HistoryDetails } from './history-details';
import { FilterType } from './history-filter';

export function HistoryItem({
  month,
  monthData,
  filter,
}: {
  month: string;
  monthData: MonthData;
  filter: FilterType;
}): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);
  const totalEvents = monthData.events.length;

  const getSummaryText = () => {
    const eventText = totalEvents === 1 ? 'event' : 'events';

    switch (filter) {
      case 'upcoming':
        return `${totalEvents} upcoming ${eventText}`;
      default:
        return `${totalEvents} ${eventText}`;
    }
  };

  return (
    <li className="bg-zinc-800/50 border border-zinc-700 rounded-lg overflow-hidden hover:border-lime-400/30 transition-all duration-200">
      <button
        className="w-full p-4 flex items-center justify-between hover:bg-zinc-800/80 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-lime-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <CalendarDays className="text-lime-400" size={18} />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-medium text-lime-400 mb-1">{month}</h3>
            <p className="text-zinc-100 font-semibold">{getSummaryText()}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 bg-zinc-700 px-2 py-1 rounded">
            {totalEvents}
          </span>
          {isExpanded ? (
            <ChevronDown className="text-zinc-400" size={18} />
          ) : (
            <ChevronRight className="text-zinc-400" size={18} />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-zinc-700 bg-zinc-900/30">
          <div className="p-4 space-y-3">
            {monthData.events.map((event) => (
              <HistoryDetails key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}
    </li>
  );
}
