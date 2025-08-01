'use client';

import {
  ChartContainer,
  ChartFilter,
  ChartHeader,
} from '@/components/presenters/charts/chart-components';
import { FilterType, useEvents } from '@/hooks/use-events';
import { useCalendar, useUser } from '@/providers';
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
  const user = useUser();
  const userEmail = user?.email;

  const getFilteredEvents = () => {
    const now = new Date();

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

  const responseData = useMemo(() => {
    if (!events || events.length === 0 || !userEmail) return [];

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

    const responseCounts = eventsToAnalyze.reduce((acc, event) => {
      const attendees = event.attendees || [];
      const targetAttendee = attendees.find(
        (attendee) => attendee.email === userEmail
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

    return Object.entries(responseCounts)
      .map(([response, count]) => ({
        name:
          response === 'accepted'
            ? 'Accepted (Yes)'
            : response === 'declined'
            ? 'Declined (No)'
            : response === 'tentative'
            ? 'Tentative (Maybe)'
            : response.charAt(0).toUpperCase() + response.slice(1),
        value: count,
        color: RESPONSE_COLORS[response as AttendeeResponse],
        percentage: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0,
      }))
      .filter((item) => item.value > 0) as ChartData[];
  }, [events, filter, userEmail]);

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
      } else if (durationHours < 3) {
        durationCounts.medium++;
      } else {
        durationCounts.long++;
      }
    });

    const totalCount = Object.values(durationCounts).reduce(
      (sum, count) => sum + count,
      0
    );

    return Object.entries(durationCounts)
      .map(([duration, count]) => ({
        name:
          duration === 'short'
            ? 'Short (<1hr)'
            : duration === 'medium'
            ? 'Medium (1-3hrs)'
            : 'Long (3+hrs)',
        value: count,
        color: DURATION_COLORS[duration as EventDuration],
        percentage: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0,
      }))
      .filter((item) => item.value > 0) as ChartData[];
  }, [filteredEvents]);

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

    return Object.entries(timeCounts)
      .map(([time, count]) => ({
        name:
          time === 'morning'
            ? 'Morning (6-12)'
            : time === 'afternoon'
            ? 'Afternoon (12-18)'
            : 'Evening (18-24)',
        value: count,
        color: TIME_COLORS[time as EventTime],
        percentage: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0,
      }))
      .filter((item) => item.value > 0) as ChartData[];
  }, [filteredEvents]);

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
        title="Response Breakdown"
      >
        <ChartFilter filter={filter} onFilterChange={setFilter} />
      </ChartHeader>

      <div className="p-4 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Response Status Distribution */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <h3 className="text-sm font-medium">RSVP Status</h3>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  {responseData.length === 0 ? (
                    // Empty pie chart - just the border/circle
                    <Pie
                      data={[{ value: 1 }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={20}
                      outerRadius={50}
                      dataKey="value"
                      fill="transparent"
                      stroke="#3f3f46"
                      strokeWidth={2}
                    />
                  ) : (
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
                  )}
                  {responseData.length > 0 && (
                    <Tooltip content={<PieChartTooltip />} />
                  )}
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 space-y-1">
              {responseData.length === 0 ? (
                <div className="text-xs text-zinc-500">No data available</div>
              ) : (
                responseData.map((item) => (
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
                ))
              )}
            </div>
          </div>

          {/* Event Lengths */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <h3 className="text-sm font-medium">Event Lengths</h3>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  {durationData.length === 0 ? (
                    // Empty pie chart - just the border/circle
                    <Pie
                      data={[{ value: 1 }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={20}
                      outerRadius={50}
                      dataKey="value"
                      fill="transparent"
                      stroke="#3f3f46"
                      strokeWidth={2}
                    />
                  ) : (
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
                  )}
                  {durationData.length > 0 && (
                    <Tooltip content={<PieChartTooltip />} />
                  )}
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 space-y-1">
              {durationData.length === 0 ? (
                <div className="text-xs text-zinc-500">No data available</div>
              ) : (
                durationData.map((item) => (
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
                ))
              )}
            </div>
          </div>

          {/* Time of Day */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <h3 className="text-sm font-medium">Time of Day</h3>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  {timeData.length === 0 ? (
                    // Empty pie chart - just the border/circle
                    <Pie
                      data={[{ value: 1 }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={20}
                      outerRadius={50}
                      dataKey="value"
                      fill="transparent"
                      stroke="#3f3f46"
                      strokeWidth={2}
                    />
                  ) : (
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
                  )}
                  {timeData.length > 0 && (
                    <Tooltip content={<PieChartTooltip />} />
                  )}
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 space-y-1">
              {timeData.length === 0 ? (
                <div className="text-xs text-zinc-500">No data available</div>
              ) : (
                timeData.map((item) => (
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
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </ChartContainer>
  );
};

export default EventAnalyticsChart;
