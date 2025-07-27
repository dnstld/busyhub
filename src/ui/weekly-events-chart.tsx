'use client';

import { useEvents } from '@/hooks/use-events';
import { useWeekdayStats } from '@/hooks/use-weekday-stats';
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
      dayName: string;
      dayIndex: number;
      count: number;
      events: unknown[];
    };
  }>;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 shadow-xl">
        <p className="text-zinc-300 text-sm">{data.dayName}</p>
        <p className="text-lime-400 font-semibold">
          {data.count} event{data.count !== 1 ? 's' : ''}
        </p>
      </div>
    );
  }
  return null;
};

const WeeklyEventsChart = () => {
  const events = useCalendar();
  const { confirmedEvents } = useEvents(events);
  const [filter, setFilter] = useState<FilterType>('all');

  // Get events based on filter
  const getFilteredEvents = () => {
    const now = new Date();
    const currentYear = now.getFullYear();

    return confirmedEvents.filter((event) => {
      const eventDate = new Date(event.start.dateTime || '');

      // Always filter to current year
      if (eventDate.getFullYear() !== currentYear) return false;

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
            Add some events to see your weekday activity chart
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="border border-zinc-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="text-lime-400" size={20} aria-hidden="true" />
            <h2 className="text-lg font-semibold text-zinc-100">
              Weekday Activity
            </h2>
          </div>
        </div>

        {/* Filter Selector */}
        <div className="flex gap-1 bg-zinc-800 rounded-lg p-1 w-fit">
          {(['all', 'past', 'upcoming'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-2 py-1 rounded text-xs capitalize transition-colors ${
                filter === type
                  ? 'bg-lime-400 text-zinc-900 font-medium'
                  : 'text-zinc-400 hover:text-zinc-300'
              }`}
            >
              {type === 'all' ? 'All' : type}
            </button>
          ))}
        </div>
      </div>

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
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#a3e635" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Stats */}
        <div className="mt-3 pt-3 border-t border-zinc-800">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-zinc-400 text-xs">Total Events</p>
              <p className="text-lime-400 font-semibold text-sm">
                {totalEvents}
              </p>
            </div>
            <div>
              <p className="text-zinc-400 text-xs">Most Active</p>
              <p className="text-lime-400 font-semibold text-sm">
                {weekdayStats.length > 0
                  ? weekdayStats
                      .reduce((max, current) =>
                        current.count > max.count ? current : max
                      )
                      .dayName.slice(0, 3)
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeeklyEventsChart;
