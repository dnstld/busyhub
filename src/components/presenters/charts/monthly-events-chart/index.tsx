'use client';

import {
  ChartContainer,
  ChartFilter,
  ChartHeader,
  ChartSummaryStats,
  ChartTooltip,
} from '@/components/presenters/charts/chart-components';
import { FilterType, useEvents } from '@/hooks/use-events';
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

const MonthlyEventsChart = () => {
  const events = useCalendar();
  const { confirmedEvents } = useEvents(events);
  const [filter, setFilter] = useState<FilterType>('all');

  // Get events based on filter and current year
  const getFilteredMonthlyStats = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Filter events by time and current year
    const filteredEvents = confirmedEvents.filter((event) => {
      const eventDate = new Date(event.start.dateTime || '');

      // Always filter to current year
      if (eventDate.getFullYear() !== currentYear) return false;

      switch (filter) {
        case 'past':
          return eventDate.getMonth() < currentMonth;
        case 'upcoming':
          return eventDate.getMonth() >= currentMonth;
        case 'all':
        default:
          return true;
      }
    });

    // Group filtered events by month
    const monthlyMap = new Map<number, typeof filteredEvents>();

    // Initialize all months
    for (let i = 0; i < 12; i++) {
      monthlyMap.set(i, []);
    }

    filteredEvents.forEach((event) => {
      const eventDate = new Date(event.start.dateTime || '');
      const month = eventDate.getMonth();
      const events = monthlyMap.get(month);
      if (events) {
        events.push(event);
      }
    });

    // Convert to stats format
    return Array.from(monthlyMap.entries())
      .map(([month, events]) => ({
        date: `${currentYear}-${String(month + 1).padStart(2, '0')}-01`,
        count: events.length,
        events,
      }))
      .filter((stat) => {
        // Only show months that match the filter
        switch (filter) {
          case 'past':
            return (
              stat.date <=
              `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`
            );
          case 'upcoming':
            return (
              stat.date >=
              `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`
            );
          case 'all':
          default:
            return true;
        }
      });
  };

  const currentYearMonthlyStats = getFilteredMonthlyStats();
  const filteredTotalEvents = currentYearMonthlyStats.reduce(
    (sum, stat) => sum + stat.count,
    0
  );

  // Format month data for chart
  const chartData = currentYearMonthlyStats.map((stat) => ({
    date: stat.date,
    count: stat.count,
    monthName: new Date(stat.date).toLocaleDateString('en-US', {
      month: 'short',
    }),
  }));

  return (
    <ChartContainer>
      <ChartHeader
        icon={
          <BarChart3 className="text-lime-400" size={20} aria-hidden="true" />
        }
        title="By Month"
      >
        <ChartFilter filter={filter} onFilterChange={setFilter} />
      </ChartHeader>

      {/* Chart */}
      <div className="p-4 pt-0">
        {chartData.length === 0 ? (
          // Empty state
          <div className="h-48 flex items-center justify-center border border-zinc-800 rounded-lg bg-zinc-900/30">
            <div className="text-center">
              <div className="text-zinc-500 text-sm mb-1">No events found</div>
              <div className="text-zinc-600 text-xs">
                {filter === 'past'
                  ? 'No past events to display'
                  : filter === 'upcoming'
                  ? 'No upcoming events to display'
                  : 'No events available for this year'}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                <XAxis
                  dataKey="monthName"
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
                <Tooltip content={<ChartTooltip chartType="monthly" />} />
                <Bar dataKey="count" fill="#a3e635" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <ChartSummaryStats
          stats={[
            {
              label:
                filter === 'all'
                  ? 'This Year'
                  : filter === 'past'
                  ? 'Past Months'
                  : 'Upcoming Months',
              value: filteredTotalEvents,
            },
            {
              label: 'Most Active',
              value:
                chartData.length > 0
                  ? chartData.reduce((max, current) =>
                      current.count > max.count ? current : max
                    ).monthName
                  : 'N/A',
            },
          ]}
        />
      </div>
    </ChartContainer>
  );
};

export default MonthlyEventsChart;
