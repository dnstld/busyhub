import { MonthData } from '@/hooks/useHistory';
import { CalendarCheckIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
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
    <li className="relative border-b-1 border-zinc-800 pb-4">
      <div className="flex flex-col gap-4">
        <header className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 border border-zinc-800 rounded-lg flex items-center justify-center text-zinc-600">
                <CalendarCheckIcon aria-label="Calendar icon" />
              </div>
            </div>
            <div>
              <h3 className="text-xs text-zinc-600">{month}</h3>
              <p className="text-lg font-bold">{getSummaryText()}</p>
            </div>
          </div>
          <button
            className="bg-zinc-800 hover:bg-zinc-700 transition-colors w-8 h-8 rounded-lg shadow-md cursor-pointer text-xs flex items-center justify-center"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
          </button>
        </header>
        {isExpanded && (
          <ul className="space-y-4">
            {monthData.events.map((event) => (
              <HistoryDetails key={event.id} event={event} />
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}
