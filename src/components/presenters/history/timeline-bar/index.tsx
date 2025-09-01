'use client';

import { FilterType, MonthData } from '@/hooks/use-events';
import { ArrowDown, CalendarDays } from 'lucide-react';

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
  if (sortedMonths.length === 0) {
    return (
      <div className="flex items-center justify-center h-24 border border-zinc-800 rounded-lg">
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

  // Get current month key for highlighting (using same format as getMonthDisplayKey)
  const currentDate = new Date();
  const currentMonthKey = currentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  const getMonthDisplayName = (monthKey: string) => {
    // monthKey is in format "January 2024" from getMonthDisplayKey
    // Extract just the month name without the year
    try {
      const date = new Date(monthKey);
      if (isNaN(date.getTime())) return monthKey; // Return original if parsing fails

      return date.toLocaleDateString('en-US', {
        month: 'long',
      });
    } catch {
      return monthKey; // Return original if any error occurs
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="p-4 pt-16 min-w-[800px]">
        <div className="relative">
          {/* Timeline line - centered to dots */}
          <div className="absolute top-4 left-0 right-0 h-px bg-zinc-700 transform"></div>

          {/* Month dots with event counts - 12 column grid */}
          <div className="grid grid-cols-12 gap-0 relative z-10">
            {sortedMonths.map((month) => {
              const eventCount = monthlyEvents[month].events.length;
              const isSelected = selectedMonth === month;
              const isCurrentMonth = month === currentMonthKey;

              return (
                <div
                  key={month}
                  className="flex flex-col items-center relative"
                >
                  {/* "You are here" indicator for current month - positioned absolutely */}
                  {isCurrentMonth && (
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1 z-10">
                      <p className="text-center  whitespace-nowrap text-xs font-medium">
                        You are here
                      </p>
                      <ArrowDown
                        className="w-4 h-4 text-white"
                        aria-hidden="true"
                      />
                    </div>
                  )}

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
                    {/* Timeline dot with event count inside */}
                    <div
                      className={`relative w-8 h-8 rounded-full border-2 border-zinc-900 transition-all duration-200 flex items-center justify-center ${
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

                    {/* Month label */}
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
