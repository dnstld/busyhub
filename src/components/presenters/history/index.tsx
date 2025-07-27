'use client';

import { FilterType, useEvents } from '@/hooks/use-events';
import { useCalendar } from '@/providers/events-provider';
import { History as HistoryIcon } from 'lucide-react';
import { useState } from 'react';
import { ChartContainer } from '../charts/chart-components/chart-container';
import { ChartEmptyState } from '../charts/chart-components/chart-empty-state';
import { ChartFilter } from '../charts/chart-components/chart-filter';
import { ChartHeader } from '../charts/chart-components/chart-header';
import { HistoryItem } from './history-item';

const History = () => {
  const events = useCalendar();
  const [filter, setFilter] = useState<FilterType>('all');
  const { getHistoryData } = useEvents(events);

  const { sortedMonths, monthlyEvents } = getHistoryData(filter);

  return (
    <ChartContainer>
      <ChartHeader
        icon={<HistoryIcon className="text-lime-400" size={20} />}
        title="Event History"
      >
        <ChartFilter filter={filter} onFilterChange={setFilter} />
      </ChartHeader>

      <div className="p-4 pt-0">
        {sortedMonths.length === 0 ? (
          <ChartEmptyState
            title="No Events Found"
            description={
              filter === 'past'
                ? 'No past events to display'
                : filter === 'upcoming'
                ? 'No upcoming events scheduled'
                : 'No events in your calendar'
            }
          />
        ) : (
          <div className="space-y-0">
            {sortedMonths.map((month) => (
              <HistoryItem
                key={month}
                month={month}
                monthData={monthlyEvents[month]}
                filter={filter}
              />
            ))}
          </div>
        )}
      </div>
    </ChartContainer>
  );
};

export default History;
