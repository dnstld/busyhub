'use client';

import {
  ChartContainer,
  ChartEmptyState,
  ChartFilter,
  ChartHeader,
  ChartSummaryStats,
} from '@/components/presenters/charts/chart-components';
import { FilterType, useEvents } from '@/hooks/use-events';
import { useCalendar } from '@/providers/events-provider';
import { PieChart as PieChartIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

// Define colors for each chart
const RESPONSE_COLORS = {
  accepted: '#22c55e', // green
  tentative: '#f59e0b', // amber
  declined: '#ef4444', // red
  needsAction: '#6b7280', // gray
} as const;

const DURATION_COLORS = {
  short: '#3b82f6', // blue
  medium: '#8b5cf6', // purple
  long: '#f97316', // orange
} as const;

const TIME_COLORS = {
  morning: '#fbbf24', // yellow
  afternoon: '#06b6d4', // cyan
  evening: '#7c3aed', // violet
} as const;

type AttendeeResponse = keyof typeof RESPONSE_COLORS;
type EventDuration = keyof typeof DURATION_COLORS;
type EventTime = keyof typeof TIME_COLORS;

interface ChartData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

const EventAnalyticsChart = () => {
  const events = useCalendar();
  const { sanitized } = useEvents(events);
  const [filter, setFilter] = useState<FilterType>('all');

  // Get filtered events based on filter - use sanitized events (all statuses) but with valid dates
  const getFilteredEvents = () => {
    const now = new Date();

    // First filter to events with valid dates only
    const validEvents = sanitized.filter((event) => {
      const startTime = event.start.dateTime;
      return startTime && !isNaN(new Date(startTime).getTime());
    });

    return validEvents.filter((event) => {
      const eventDate = new Date(event.start.dateTime || '');

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

  const filteredEvents = getFilteredEvents();

  // Response Status Distribution Data - analyze attendee responses for a specific email
  const responseData = useMemo(() => {
    if (!events || events.length === 0) return [];

    const targetEmail = 'contato@denistoledo.com.br'; // The email we're tracking

    // Apply time filtering to raw events for status consistency
    const now = new Date();
    let eventsToAnalyze = events;

    if (filter !== 'all') {
      eventsToAnalyze = events.filter((event) => {
        const startTime = event.start?.dateTime;
        if (!startTime) return false;

        const eventDate = new Date(startTime);
        if (isNaN(eventDate.getTime())) return false;

        switch (filter) {
          case 'past':
            return eventDate < now;
          case 'upcoming':
            return eventDate >= now;
          default:
            return true;
        }
      });
    }

    // Count responses for the target email across all events
    const responseCounts = eventsToAnalyze.reduce((acc, event) => {
      const attendees = event.attendees || [];
      const targetAttendee = attendees.find(
        (attendee) => attendee.email === targetEmail
      );

      if (targetAttendee && targetAttendee.responseStatus) {
        const response = targetAttendee.responseStatus as AttendeeResponse;
        acc[response] = (acc[response] || 0) + 1;
      }

      return acc;
    }, {} as Record<AttendeeResponse, number>);

    const totalCount = Object.values(responseCounts).reduce(
      (sum, count) => sum + count,
      0
    );

    return Object.entries(responseCounts).map(([response, count]) => ({
      name: response.charAt(0).toUpperCase() + response.slice(1),
      value: count,
      color: RESPONSE_COLORS[response as AttendeeResponse],
      percentage: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0,
    })) as ChartData[];
  }, [events, filter]);

  // Duration Distribution Data
  const durationData = useMemo(() => {
    if (!filteredEvents || filteredEvents.length === 0) return [];

    const durationCounts = { short: 0, medium: 0, long: 0 };

    filteredEvents.forEach((event) => {
      const start = new Date(event.start.dateTime || '');
      const end = new Date(event.end.dateTime || '');
      const durationHours =
        (end.getTime() - start.getTime()) / (1000 * 60 * 60);

      if (durationHours < 1) {
        durationCounts.short++;
      } else if (durationHours <= 4) {
        durationCounts.medium++;
      } else {
        durationCounts.long++;
      }
    });

    const totalCount = Object.values(durationCounts).reduce(
      (sum, count) => sum + count,
      0
    );

    return Object.entries(durationCounts).map(([duration, count]) => ({
      name:
        duration === 'short'
          ? 'Short (<1hr)'
          : duration === 'medium'
          ? 'Medium (1-4hrs)'
          : 'Long (4+hrs)',
      value: count,
      color: DURATION_COLORS[duration as EventDuration],
      percentage: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0,
    })) as ChartData[];
  }, [filteredEvents]);

  // Time of Day Distribution Data
  const timeData = useMemo(() => {
    if (!filteredEvents || filteredEvents.length === 0) return [];

    const timeCounts = { morning: 0, afternoon: 0, evening: 0 };

    filteredEvents.forEach((event) => {
      const start = new Date(event.start.dateTime || '');
      const hour = start.getHours();

      if (hour < 12) {
        timeCounts.morning++;
      } else if (hour < 18) {
        timeCounts.afternoon++;
      } else {
        timeCounts.evening++;
      }
    });

    const totalCount = Object.values(timeCounts).reduce(
      (sum, count) => sum + count,
      0
    );

    return Object.entries(timeCounts).map(([time, count]) => ({
      name:
        time === 'morning'
          ? 'Morning (6-12)'
          : time === 'afternoon'
          ? 'Afternoon (12-18)'
          : 'Evening (18-24)',
      value: count,
      color: TIME_COLORS[time as EventTime],
      percentage: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0,
    })) as ChartData[];
  }, [filteredEvents]);

  const totalEvents = filteredEvents.length;

  // Custom tooltip for pie charts - follows ChartTooltip styling
  const PieChartTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ payload: ChartData }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 shadow-xl">
          <p className="text-zinc-300 text-sm">{data.name}</p>
          <p className="text-lime-400 font-semibold">
            {data.value} event{data.value !== 1 ? 's' : ''} ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  if (totalEvents === 0) {
    return (
      <ChartEmptyState
        title="No Events Data"
        description="Add some events to see your analytics charts"
      />
    );
  }

  return (
    <ChartContainer>
      <ChartHeader
        icon={
          <PieChartIcon
            className="text-lime-400"
            size={20}
            aria-hidden="true"
          />
        }
        title="Response Analytics"
      >
        <ChartFilter filter={filter} onFilterChange={setFilter} />
      </ChartHeader>

      <div className="px-4 pb-2">
        <p className="text-sm text-zinc-400">
          Tracking responses for{' '}
          <span className="text-lime-400 font-mono">
            contato@denistoledo.com.br
          </span>
        </p>
      </div>

      <div className="p-4 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Response Status Distribution */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-zinc-300">
              Response Status
            </h3>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={responseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={20}
                    outerRadius={50}
                    dataKey="value"
                  >
                    {responseData.map((entry, index) => (
                      <Cell key={`response-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Duration Distribution */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-zinc-300">
              Duration Distribution
            </h3>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={durationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={20}
                    outerRadius={50}
                    dataKey="value"
                  >
                    {durationData.map((entry, index) => (
                      <Cell key={`duration-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Time Distribution */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-zinc-300">
              Time Distribution
            </h3>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={timeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={20}
                    outerRadius={50}
                    dataKey="value"
                  >
                    {timeData.map((entry, index) => (
                      <Cell key={`time-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Response Status Legend */}
          <div>
            <h4 className="text-xs font-medium text-zinc-400 mb-2">
              RESPONSE STATUS
            </h4>
            <div className="space-y-1">
              {responseData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-zinc-300">{item.name}</span>
                  </div>
                  <span className="text-zinc-400">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Duration Legend */}
          <div>
            <h4 className="text-xs font-medium text-zinc-400 mb-2">DURATION</h4>
            <div className="space-y-1">
              {durationData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-zinc-300">{item.name}</span>
                  </div>
                  <span className="text-zinc-400">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Time Legend */}
          <div>
            <h4 className="text-xs font-medium text-zinc-400 mb-2">
              TIME OF DAY
            </h4>
            <div className="space-y-1">
              {timeData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-zinc-300">{item.name}</span>
                  </div>
                  <span className="text-zinc-400">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <ChartSummaryStats
          columns={3}
          stats={[
            { label: 'Total Events', value: totalEvents },
            {
              label: 'Most Common Response',
              value:
                responseData.length > 0
                  ? responseData.reduce((max, current) =>
                      current.value > max.value ? current : max
                    ).name
                  : 'N/A',
            },
            {
              label: 'Most Common Duration',
              value:
                durationData.length > 0
                  ? durationData
                      .reduce((max, current) =>
                        current.value > max.value ? current : max
                      )
                      .name.split(' ')[0]
                  : 'N/A',
            },
          ]}
        />
      </div>
    </ChartContainer>
  );
};

export default EventAnalyticsChart;
