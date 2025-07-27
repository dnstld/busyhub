'use client';

import { useEvents } from '@/hooks/use-events';
import { useCalendar } from '@/providers/events-provider';
import { BarChart3, Calendar } from 'lucide-react';
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

type FilterType = 'all' | 'past' | 'upcoming';

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: {
      date: string;
      count: number;
      monthName: string;
    };
  }>;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const monthYear = new Date(data.date).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });

    return (
      <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 shadow-xl">
        <p className="text-zinc-300 text-sm">{monthYear}</p>
        <p className="text-lime-400 font-semibold">
          {data.count} event{data.count !== 1 ? 's' : ''}
        </p>
      </div>
    );
  }
  return null;
};

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

  if (filteredTotalEvents === 0) {
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
            Add some events to see your monthly activity
          </p>
        </div>
      </div>
    );
  }

  // Format month data for chart
  const chartData = currentYearMonthlyStats.map((stat) => ({
    date: stat.date,
    count: stat.count,
    monthName: new Date(stat.date).toLocaleDateString('en-US', {
      month: 'short',
    }),
  }));

  return (
    <section className="border border-zinc-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="text-lime-400" size={20} aria-hidden="true" />
          <h2 className="text-lg font-semibold text-zinc-100">
            Monthly Activity
          </h2>
        </div>

        {/* Filter Selector */}
        <div className="flex gap-1 bg-zinc-800 rounded-lg p-1 w-fit">
          {(['all', 'past', 'upcoming'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                filter === type
                  ? 'bg-lime-400 text-zinc-900 font-medium'
                  : 'text-zinc-400 hover:text-zinc-300'
              }`}
            >
              {type === 'all' ? 'All' : type === 'past' ? 'Past' : 'Upcoming'}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="p-4 pt-0">
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
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#a3e635" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Stats */}
        <div className="mt-3 pt-3 border-t border-zinc-800">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-zinc-400 text-xs">
                {filter === 'all'
                  ? 'This Year'
                  : filter === 'past'
                  ? 'Past Months'
                  : 'Upcoming'}
              </p>
              <p className="text-lime-400 font-semibold text-sm">
                {filteredTotalEvents}
              </p>
            </div>
            <div>
              <p className="text-zinc-400 text-xs">Peak Month</p>
              <p className="text-lime-400 font-semibold text-sm">
                {chartData.length > 0
                  ? chartData.reduce((max, current) =>
                      current.count > max.count ? current : max
                    ).monthName
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MonthlyEventsChart;
