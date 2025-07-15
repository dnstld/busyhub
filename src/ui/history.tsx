'use client';

import { useCalendar } from '@/app/context/events-provider-client';
import { useHistory } from '@/hooks/useHistory';
import { Calendar } from 'lucide-react';
import { use, useState } from 'react';
import { FilterType, HistoryFilter } from './history-filter';
import { HistoryItem } from './history-item';

const History = () => {
  const events = use(useCalendar());
  const [filter, setFilter] = useState<FilterType>('past');
  const { sortedMonths, monthlyEvents } = useHistory(events, filter);

  return (
    <>
      <div>
        <HistoryFilter value={filter} onChange={setFilter} />
      </div>

      {sortedMonths.length === 0 ? (
        <div className="group text-center space-y-4 p-6 rounded-lg border border-zinc-800 hover:border-lime-400/30 transition-all duration-300 hover:bg-zinc-900/30">
          <div className="w-12 h-12 bg-lime-500/10 rounded-xl mx-auto flex items-center justify-center group-hover:bg-lime-400/20 transition-colors">
            <Calendar className="text-lime-400" size={24} />
          </div>
          <h3 className="text-xl font-semibold text-zinc-100">
            No Events Found
          </h3>
          <p className="text-zinc-400 leading-relaxed">
            {filter === 'past' && 'No past events to display'}
            {filter === 'upcoming' && 'No upcoming events scheduled'}
            {filter === 'all' && 'No events in your calendar'}
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {sortedMonths.map((month) => (
            <HistoryItem
              key={month}
              month={month}
              monthData={monthlyEvents[month]}
              filter={filter}
            />
          ))}
        </ul>
      )}
    </>
  );
};

export default History;
