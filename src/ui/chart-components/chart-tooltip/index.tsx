'use client';

import { CalendarEvent } from '@/app/actions/get-events';

interface TooltipData {
  date: string;
  count: number;
  events?: CalendarEvent[];
  dayName?: string;
  monthName?: string;
  dayIndex?: number;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: TooltipData;
  }>;
  chartType?: 'daily' | 'weekly' | 'monthly' | 'weekday';
}

export const ChartTooltip = ({
  active,
  payload,
  chartType = 'daily',
}: ChartTooltipProps) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0].payload;

  const formatLabel = () => {
    switch (chartType) {
      case 'weekday':
        return data.dayName || '';
      case 'monthly':
        const monthYear = new Date(data.date).toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
        });
        return monthYear;
      case 'weekly':
        const baseDate = new Date(data.date);
        const startDate = new Date(baseDate);
        const endDate = new Date(baseDate.getTime() + 6 * 24 * 60 * 60 * 1000);

        const formatOptions: Intl.DateTimeFormatOptions = {
          month: 'short',
          day: 'numeric',
        };

        const startFormatted = startDate.toLocaleDateString(
          'en-US',
          formatOptions
        );
        const endFormatted = endDate.toLocaleDateString('en-US', formatOptions);

        return `${startFormatted} to ${endFormatted}`;
      case 'daily':
      default:
        const date = new Date(data.date);
        return date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 shadow-xl">
      <p className="text-zinc-300 text-sm">{formatLabel()}</p>
      <p className="text-lime-400 font-semibold">
        {data.count} event{data.count !== 1 ? 's' : ''}
      </p>
    </div>
  );
};
