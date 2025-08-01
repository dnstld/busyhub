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
import { TrendingUp } from 'lucide-react';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const DailyEventsChart = () => {
  const events = useCalendar();
  const { dailyStats, totalEvents } = useEvents(events);
  const [filter, setFilter] = useState<FilterType>('all');

  const getChartData = () => {
    const now = new Date();

    if (filter === 'all') {
      return dailyStats;
    }

    return dailyStats.filter((item) => {
      const itemDate = new Date(item.date);

      if (filter === 'past') {
        return itemDate < now;
      } else if (filter === 'upcoming') {
        return itemDate >= now;
      }

      return true;
    });
  };

  const chartData = getChartData();

  // Calculate average for the reference line
  const averageCount =
    chartData.length > 0
      ? chartData.reduce((acc, d) => acc + d.count, 0) / chartData.length
      : 0;

  // Format date for X-axis - always show daily format since we're showing daily data
  const formatXAxisDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <ChartContainer>
      <ChartHeader
        icon={
          <TrendingUp className="text-lime-400" size={20} aria-hidden="true" />
        }
        title="By Day"
      >
        <ChartFilter filter={filter} onFilterChange={setFilter} />
      </ChartHeader>

      {/* Chart */}
      <div className="p-4">
        {chartData.length === 0 ? (
          // Empty state
          <div className="h-64 flex items-center justify-center border border-zinc-800 rounded-lg bg-zinc-900/30">
            <div className="text-center">
              <div className="text-zinc-500 text-sm mb-1">No events found</div>
              <div className="text-zinc-600 text-xs">
                {filter === 'past'
                  ? 'No past events to display'
                  : filter === 'upcoming'
                  ? 'No upcoming events to display'
                  : 'No events available for this period'}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatXAxisDate}
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
                <Tooltip content={<ChartTooltip chartType="daily" />} />

                {/* Average reference line */}
                <ReferenceLine
                  y={averageCount}
                  stroke="#71717a"
                  strokeDasharray="5 5"
                  strokeWidth={1}
                  label={{
                    value: `Avg: ${Math.round(averageCount)}`,
                    position: 'top',
                    style: { fill: '#71717a', fontSize: '12px' },
                  }}
                />

                <Bar dataKey="count" fill="#a3e635" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <ChartSummaryStats
          columns={3}
          stats={[
            {
              label: 'Total Events',
              value: totalEvents,
            },
            {
              label: 'Avg per Day',
              value:
                chartData.length > 0
                  ? Math.round(
                      chartData.reduce((acc, d) => acc + d.count, 0) /
                        chartData.length
                    )
                  : 0,
            },
            {
              label: 'Most Active Day',
              value:
                chartData.length > 0
                  ? Math.max(...chartData.map((d) => d.count))
                  : 0,
            },
          ]}
        />
      </div>
    </ChartContainer>
  );
};

export default DailyEventsChart;
