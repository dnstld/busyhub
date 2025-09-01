'use client';

import {
  ChartContainer,
  ChartFilter,
  ChartHeader,
  ChartSummaryStats,
  ChartTooltip,
} from '@/components/presenters/charts/chart-components';
import { useDate } from '@/hooks/use-date';
import { FilterType, useEvents } from '@/hooks/use-events';
import { useWeekdayStats } from '@/hooks/use-weekday-stats';
import { useCalendar } from '@/providers/events-provider';
import { BarChart3 } from 'lucide-react';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const WeeklyEventsChart = () => {
  const events = useCalendar();
  const { confirmedEvents } = useEvents(events);
  const { getCurrentDate, isCurrentYear } = useDate();
  const [filter, setFilter] = useState<FilterType>('all');

  // Get events based on filter
  const getFilteredEvents = () => {
    const now = getCurrentDate();

    return confirmedEvents.filter((event) => {
      const eventDate = new Date(event.start.dateTime || '');

      // Always filter to current year
      if (!isCurrentYear(eventDate)) return false;

      switch (filter) {
        case 'past':
          return eventDate < now;
        case 'upcoming':
          return eventDate >= now;
        case 'all':
        default:
          return true;
      }
    });
  };

  const weekdayStats = useWeekdayStats(getFilteredEvents());
  const totalEvents = weekdayStats.reduce((sum, stat) => sum + stat.count, 0);

  return (
    <ChartContainer>
      <ChartHeader
        icon={
          <BarChart3 className="text-lime-400" size={20} aria-hidden="true" />
        }
        title="By Weekday"
      >
        <ChartFilter filter={filter} onFilterChange={setFilter} />
      </ChartHeader>

      {/* Chart */}
      <div className="p-4 pt-0">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weekdayStats}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
              <XAxis
                dataKey="dayName"
                tickFormatter={(day) => day.slice(0, 3)} // Show Mon, Tue, etc.
                stroke="#71717a"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#71717a"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<ChartTooltip chartType="weekday" />} />
              <Bar dataKey="count" fill="#a3e635" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <ChartSummaryStats
          stats={[
            {
              label: 'Total Events',
              value: totalEvents,
            },
            {
              label: 'Most Active',
              value:
                weekdayStats.length > 0
                  ? weekdayStats
                      .reduce((max, current) =>
                        current.count > max.count ? current : max
                      )
                      .dayName.slice(0, 3)
                  : 'N/A',
            },
          ]}
        />
      </div>
    </ChartContainer>
  );
};

export default WeeklyEventsChart;
