'use client';

import { CalendarEvent } from '@/app/actions/get-events';
import { useEvents } from '@/hooks/use-events';
import { useCalendar } from '@/providers/events-provider';
import { BarChart3, Calendar, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type ChartType = 'daily' | 'weekly' | 'monthly';
type ChartView = 'bar' | 'line';

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: {
      date: string;
      count: number;
      events?: CalendarEvent[];
      startDate?: string;
      endDate?: string;
    };
  }>;
}

interface CustomTooltipComponentProps extends TooltipProps {
  chartType: ChartType;
}

const CustomTooltip = ({
  active,
  payload,
  chartType,
}: CustomTooltipComponentProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    const formatDateRange = () => {
      if (chartType === 'daily') {
        const date = new Date(data.date);
        return date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      } else {
        // For weekly and monthly, we need to calculate the date range
        const baseDate = new Date(data.date);
        let startDate, endDate;

        if (chartType === 'weekly') {
          // For weekly, show the week range
          startDate = new Date(baseDate);
          endDate = new Date(baseDate.getTime() + 6 * 24 * 60 * 60 * 1000);
        } else {
          // monthly
          // For monthly, show the month range (first day to last day of month)
          startDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
          endDate = new Date(
            baseDate.getFullYear(),
            baseDate.getMonth() + 1,
            0
          );
        }

        const formatOptions: Intl.DateTimeFormatOptions = {
          month: 'short',
          day: 'numeric',
          year: chartType === 'monthly' ? 'numeric' : undefined,
        };

        const startFormatted = startDate.toLocaleDateString(
          'en-US',
          formatOptions
        );
        const endFormatted = endDate.toLocaleDateString('en-US', formatOptions);

        return `${startFormatted} to ${endFormatted}`;
      }
    };

    return (
      <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 shadow-xl">
        <p className="text-zinc-300 text-sm">{formatDateRange()}</p>
        <p className="text-lime-400 font-semibold">
          {data.count} event{data.count !== 1 ? 's' : ''}
        </p>
      </div>
    );
  }
  return null;
};

const DailyEventsChart = () => {
  const events = useCalendar();
  const { dailyStats, weeklyStats, monthlyStats, totalEvents } =
    useEvents(events);
  const [chartType, setChartType] = useState<ChartType>('daily');
  const [chartView, setChartView] = useState<ChartView>('bar');

  // Get the appropriate data based on chart type
  const getChartData = () => {
    switch (chartType) {
      case 'weekly':
        return weeklyStats;
      case 'monthly':
        return monthlyStats;
      default:
        // Show all daily data for the entire year
        return dailyStats;
    }
  };

  const chartData = getChartData();

  // Calculate average for the reference line
  const averageCount =
    chartData.length > 0
      ? chartData.reduce((acc, d) => acc + d.count, 0) / chartData.length
      : 0;

  // Format date for X-axis based on chart type
  const formatXAxisDate = (dateStr: string) => {
    const date = new Date(dateStr);
    switch (chartType) {
      case 'weekly':
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
      case 'monthly':
        return date.toLocaleDateString('en-US', {
          month: 'short',
          year: '2-digit',
        });
      default:
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
    }
  };

  if (totalEvents === 0) {
    return (
      <div className="border border-zinc-800 rounded-xl p-4">
        <div className="text-center space-y-4">
          <div
            className="w-12 h-12 bg-lime-500/10 rounded-xl mx-auto flex items-center justify-center"
            aria-hidden="true"
          >
            <Calendar className="text-lime-400" size={24} />
          </div>
          <h2 className="text-xl font-semibold text-zinc-100">
            No Events Data
          </h2>
          <p className="text-zinc-400">
            Add some events to see your activity chart
          </p>
        </div>
      </div>
    );
  }

  const ChartComponent = chartView === 'line' ? LineChart : BarChart;

  return (
    <section className="border border-zinc-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp
              className="text-lime-400"
              size={20}
              aria-hidden="true"
            />
            <h2 className="text-xl font-semibold text-zinc-100">
              Event Activity
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Chart View Toggle */}
            <div className="flex bg-zinc-800 rounded-lg p-2">
              <button
                onClick={() => setChartView('bar')}
                className={`p-1.5 rounded cursor-pointer ${
                  chartView === 'bar'
                    ? 'bg-lime-400 text-zinc-900'
                    : 'text-zinc-400 hover:text-zinc-300'
                }`}
                aria-label="Bar Chart View"
              >
                <BarChart3 size={16} aria-hidden="true" />
              </button>
              <button
                onClick={() => setChartView('line')}
                className={`p-1.5 rounded cursor-pointer ${
                  chartView === 'line'
                    ? 'bg-lime-400 text-zinc-900'
                    : 'text-zinc-400 hover:text-zinc-300'
                }`}
                aria-label="Line Chart View"
              >
                <TrendingUp size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Chart Type Selector */}
        <div className="flex gap-1 bg-zinc-800 rounded-lg p-2 w-fit">
          {(['daily', 'weekly', 'monthly'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={`px-3 p-1.5 rounded text-sm capitalize transition-colors cursor-pointer ${
                chartType === type
                  ? 'bg-lime-400 text-zinc-900 font-medium'
                  : 'text-zinc-400 hover:text-zinc-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="p-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ChartComponent
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
              <Tooltip
                content={(props) => (
                  <CustomTooltip {...props} chartType={chartType} />
                )}
              />

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

              {chartView === 'line' ? (
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#a3e635"
                  strokeWidth={2}
                  dot={{ fill: '#a3e635', strokeWidth: 2, r: 4 }}
                  activeDot={{
                    r: 6,
                    stroke: '#a3e635',
                    strokeWidth: 2,
                    fill: '#a3e635',
                  }}
                />
              ) : (
                <Bar dataKey="count" fill="#a3e635" radius={[2, 2, 0, 0]} />
              )}
            </ChartComponent>
          </ResponsiveContainer>
        </div>

        {/* Summary Stats */}
        <div className="mt-4 pt-4 border-t border-zinc-800">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-zinc-400 text-sm">Total Events</p>
              <p className="text-lime-400 font-semibold">{totalEvents}</p>
            </div>
            <div>
              <p className="text-zinc-400 text-sm">
                Avg per{' '}
                {chartType === 'daily'
                  ? 'Day'
                  : chartType === 'weekly'
                  ? 'Week'
                  : 'Month'}
              </p>
              <p className="text-lime-400 font-semibold">
                {chartData.length > 0
                  ? Math.round(
                      chartData.reduce((acc, d) => acc + d.count, 0) /
                        chartData.length
                    )
                  : 0}
              </p>
            </div>
            <div>
              <p className="text-zinc-400 text-sm">
                Peak{' '}
                {chartType === 'daily'
                  ? 'Day'
                  : chartType === 'weekly'
                  ? 'Week'
                  : 'Month'}
              </p>
              <p className="text-lime-400 font-semibold">
                {chartData.length > 0
                  ? Math.max(...chartData.map((d) => d.count))
                  : 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DailyEventsChart;
