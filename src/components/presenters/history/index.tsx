'use client';

import { ChartContainer } from '@/components/presenters/charts/chart-components';
import { ChartHeader } from '@/components/presenters/charts/chart-components/chart-header';
import { MonthEvents } from '@/components/presenters/history/month-events';
import { TimelineBar } from '@/components/presenters/history/timeline-bar';
import { Modal } from '@/components/ui/modal';
import { useDate } from '@/hooks/use-date';
import { useEvents } from '@/hooks/use-events';
import { useCalendar } from '@/providers/events-provider';
import { History as HistoryIcon } from 'lucide-react';
import { useState } from 'react';

const History = () => {
  const events = useCalendar();
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const { getHistoryData } = useEvents(events);
  const { formatMonthYear } = useDate();

  const { sortedMonths, monthlyEvents } = getHistoryData('all');

  const handleMonthClick = (month: string) => {
    setSelectedMonth(month);
  };

  const handleCloseModal = () => {
    setSelectedMonth(null);
  };

  return (
    <ChartContainer>
      <ChartHeader
        icon={<HistoryIcon className="text-lime-400" size={20} />}
        title="Monthly History"
      />

      <TimelineBar
        sortedMonths={sortedMonths}
        monthlyEvents={monthlyEvents}
        filter={'all'}
        selectedMonth={selectedMonth}
        onMonthClick={handleMonthClick}
      />

      {/* Modal for showing month events */}
      <Modal
        isOpen={selectedMonth !== null}
        onClose={handleCloseModal}
        title={selectedMonth ? formatMonthYear(selectedMonth) : ''}
      >
        {selectedMonth && (
          <MonthEvents
            monthData={monthlyEvents[selectedMonth]}
            filter={'all'}
          />
        )}
      </Modal>
    </ChartContainer>
  );
};

export default History;
