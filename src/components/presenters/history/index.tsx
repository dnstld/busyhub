'use client';

import { ChartContainer } from '@/components/presenters/charts/chart-components';
import { ChartFilter } from '@/components/presenters/charts/chart-components/chart-filter';
import { ChartHeader } from '@/components/presenters/charts/chart-components/chart-header';
import { HistoryItem } from '@/components/presenters/history/history-item';
import { FilterType, useEvents } from '@/hooks/use-events';
import { useCalendar } from '@/providers/events-provider';
import { History as HistoryIcon } from 'lucide-react';
import { useState } from 'react';

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
        {sortedMonths.map((month) => (
          <HistoryItem
            key={month}
            month={month}
            monthData={monthlyEvents[month]}
            filter={filter}
          />
        ))}
      </div>
    </ChartContainer>
  );
};

export default History;
