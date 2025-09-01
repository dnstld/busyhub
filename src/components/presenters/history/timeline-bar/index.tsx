'use client';

import { useDate } from '@/hooks/use-date';
import { FilterType, MonthData } from '@/hooks/use-events';
import { CalendarDays } from 'lucide-react';

interface TimelineBarProps {
  sortedMonths: string[];
  monthlyEvents: { [monthKey: string]: MonthData };
  filter: FilterType;
  selectedMonth: string | null;
  onMonthClick: (month: string) => void;
}

export function TimelineBar({
  sortedMonths,
  monthlyEvents,
  filter,
  selectedMonth,
  onMonthClick,
}: TimelineBarProps) {
  const { getCurrentMonthKey, getMonthDisplayName } = useDate();

  if (sortedMonths.length === 0) {
    return (
      <div className="flex items-center justify-center border border-zinc-800 rounded-lg">
        <div className="text-center">
          <CalendarDays className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
          <div className="text-zinc-500 text-sm">No events found</div>
          <div className="text-zinc-600 text-xs">
            {filter === 'past'
              ? 'No past events to display'
              : filter === 'upcoming'
              ? 'No upcoming events to display'
              : 'No events available in your history'}
          </div>
        </div>
      </div>
    );
  }

  // Get current month key for highlighting
  const currentMonthKey = getCurrentMonthKey();

  return (
    <div className="overflow-x-auto">
      <div className="p-4 min-w-[800px]">
        <div className="relative">
          <div className="absolute top-4 left-0 right-0 h-px bg-zinc-700 transform"></div>

          <div className="grid grid-cols-12 gap-0 relative z-10">
            {sortedMonths.map((month) => {
              const eventCount = monthlyEvents[month].events.length;
              const isSelected = selectedMonth === month;
              const isCurrentMonth = month === currentMonthKey;

              return (
                <div key={month} className="flex flex-col items-center">
                  <button
                    onClick={() => onMonthClick(month)}
                    className={`group flex flex-col items-center transition-all duration-200 hover:scale-105 w-full cursor-pointer ${
                      isSelected ? 'scale-105' : ''
                    }`}
                    title={`${getMonthDisplayName(
                      month
                    )} - ${eventCount} event${eventCount !== 1 ? 's' : ''}${
                      isCurrentMonth ? ' (Current Month)' : ''
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full border-2 border-zinc-900 transition-all duration-200 flex items-center justify-center ${
                        eventCount > 0
                          ? isSelected
                            ? 'bg-lime-400'
                            : 'bg-lime-500 group-hover:bg-lime-400'
                          : 'bg-zinc-600 group-hover:bg-zinc-500'
                      } ${
                        isSelected
                          ? 'ring-2 ring-lime-400 ring-offset-2 ring-offset-zinc-900'
                          : ''
                      } ${
                        isCurrentMonth
                          ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-900'
                          : ''
                      }`}
                    >
                      <span
                        className={`text-xs font-bold ${
                          eventCount > 0 ? 'text-zinc-900' : 'text-zinc-400'
                        }`}
                      >
                        {eventCount}
                      </span>
                    </div>

                    <div
                      className={`mt-2 text-sm transition-colors duration-200 text-center ${
                        isSelected
                          ? 'text-lime-400 font-medium'
                          : 'text-zinc-400 group-hover:text-zinc-300'
                      } ${isCurrentMonth ? 'text-white font-medium' : ''}`}
                    >
                      {getMonthDisplayName(month)}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
