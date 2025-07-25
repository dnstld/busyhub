'use client';

import { useEvents } from '@/hooks/use-events';
import { useCalendar } from '@/providers/events-provider';
import { Calendar, History as HistoryIcon } from 'lucide-react';
import { useState } from 'react';
import { FilterType } from './history-filter';
import { HistoryItem } from './history-item';

const History = () => {
  const events = useCalendar();
  const [filter, setFilter] = useState<FilterType>('past');
  const { getHistoryData } = useEvents(events);

  const { sortedMonths, monthlyEvents } = getHistoryData(filter);

  return (
    <section className="border border-zinc-800 rounded-xl">
      {/* Header */}
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <HistoryIcon className="text-lime-400" size={20} />
            <h2 className="text-xl font-semibold text-zinc-100">
              Event History
            </h2>
          </div>
        </div>

        {/* Filter Type Selector */}
        <div className="flex gap-1 bg-zinc-800 rounded-lg p-1 w-fit">
          {(['past', 'upcoming', 'all'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1.5 rounded text-sm capitalize transition-colors ${
                filter === type
                  ? 'bg-lime-400 text-zinc-900 font-medium'
                  : 'text-zinc-400 hover:text-zinc-300'
              }`}
            >
              {type === 'all' ? 'All Events' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pt-4">
        {sortedMonths.length === 0 ? (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-lime-500/10 rounded-xl mx-auto flex items-center justify-center">
              <Calendar className="text-lime-400" size={24} />
            </div>
            <h2 className="text-xl font-semibold text-zinc-100">
              No Events Found
            </h2>
            <p className="text-zinc-400">
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
      </div>
    </section>
  );
};

export default History;
