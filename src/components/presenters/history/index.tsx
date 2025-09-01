'use client';

import { ChartContainer } from '@/components/presenters/charts/chart-components';
import { ChartHeader } from '@/components/presenters/charts/chart-components/chart-header';
import { MonthEvents } from '@/components/presenters/history/month-events';
import { TimelineBar } from '@/components/presenters/history/timeline-bar';
import { Modal } from '@/components/ui/modal';
import { useEvents } from '@/hooks/use-events';
import { useCalendar } from '@/providers/events-provider';
import { History as HistoryIcon } from 'lucide-react';
import { useState } from 'react';

const History = () => {
  const events = useCalendar();
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const { getHistoryData } = useEvents(events);

  const { sortedMonths, monthlyEvents } = getHistoryData('all');

  const handleMonthClick = (month: string) => {
    setSelectedMonth(month);
  };

  const handleCloseModal = () => {
    setSelectedMonth(null);
  };

  const getModalTitle = (month: string) => {
    // month is in format "January 2024" from getMonthDisplayKey
    // Just return it as is since it's already in the desired format
    try {
      const date = new Date(month);
      if (isNaN(date.getTime())) return month; // Return original if parsing fails

      return date.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return month; // Return original if any error occurs
    }
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
        title={selectedMonth ? getModalTitle(selectedMonth) : ''}
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
