'use client';

import { HistoryDetails } from '@/components/presenters/history/history-details';
import { FilterType, MonthData } from '@/hooks/use-events';
import { Calendar, Clock, Users } from 'lucide-react';

interface MonthEventsProps {
  monthData: MonthData;
  filter: FilterType;
}

export function MonthEvents({ monthData, filter }: MonthEventsProps) {
  const totalEvents = monthData.events.length;
  const totalAttendees = monthData.events.reduce(
    (sum, event) => sum + (event.attendees?.length || 0),
    0
  );

  const calculateTotalDuration = () => {
    let totalMinutes = 0;

    monthData.events.forEach((event) => {
      if (event.start?.dateTime && event.end?.dateTime) {
        const start = new Date(event.start.dateTime);
        const end = new Date(event.end.dateTime);
        totalMinutes += (end.getTime() - start.getTime()) / (1000 * 60);
      }
    });

    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);

    if (hours === 0) {
      return `${minutes}m`;
    } else if (minutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${minutes}m`;
    }
  };

  return (
    <div className="p-4">
      {/* Month Header */}
      <div className="mb-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-zinc-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-lime-400" />
              <span className="text-xs text-lime-400 font-medium">
                Total Events
              </span>
            </div>
            <div className="text-lg font-semibold text-zinc-100">
              {totalEvents}
            </div>
          </div>

          <div className="bg-zinc-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-blue-400 font-medium">
                Total Duration
              </span>
            </div>
            <div className="text-lg font-semibold text-zinc-100">
              {calculateTotalDuration()}
            </div>
          </div>

          <div className="bg-zinc-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-purple-400 font-medium">
                Total Attendees
              </span>
            </div>
            <div className="text-lg font-semibold text-zinc-100">
              {totalAttendees}
            </div>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-1">
        <div className="mb-3">
          <h3 className="text-sm font-medium text-zinc-300 mb-1">Events</h3>
          <div className="h-px bg-zinc-800"></div>
        </div>

        {monthData.events.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-center">
            <div>
              <Calendar className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
              <div className="text-zinc-500 text-sm mb-1">No events found</div>
              <div className="text-zinc-600 text-xs">
                {filter === 'past'
                  ? 'No past events for this month'
                  : filter === 'upcoming'
                  ? 'No upcoming events for this month'
                  : 'No events available for this month'}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-0">
            {monthData.events
              .sort((a, b) => {
                const dateA = new Date(
                  a.start?.dateTime || a.start?.date || ''
                );
                const dateB = new Date(
                  b.start?.dateTime || b.start?.date || ''
                );
                return dateA.getTime() - dateB.getTime();
              })
              .map((event) => (
                <HistoryDetails key={event.id} event={event} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
