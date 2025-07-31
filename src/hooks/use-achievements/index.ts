import { useMemo } from 'react';
import { SanitizedEvent } from '../use-events/useEventsSanitization';

interface UseAchievementsProps {
  dailyEvents: Map<string, SanitizedEvent[]>;
  totalEvents: number;
  totalWeekdays: number;
}

export const useAchievements = ({
  dailyEvents,
}: UseAchievementsProps) => {
  return useMemo(() => {
    const countDaysWithMinEvents = (min: number) => {
      let count = 0;
      for (const events of dailyEvents.values()) {
        if (events.length >= min) count++;
      }
      return count;
    };

    const hasStreak = (minEvents: number, streakLength: number) => {
      const sorted = Array.from(dailyEvents.entries()).sort(([a], [b]) =>
        a.localeCompare(b)
      );
      let streak = 0;

      for (const [, events] of sorted) {
        if (events.length >= minEvents) {
          streak++;
          if (streak >= streakLength) return true;
        } else {
          streak = 0;
        }
      }

      return false;
    };

    const daysWith2Plus = countDaysWithMinEvents(2);
    const daysWith3Plus = countDaysWithMinEvents(3);

    return {
      welcome: true,
      beginner: daysWith2Plus >= 50,
      onFire: hasStreak(3, 10) && daysWith2Plus >= 100,
      king: daysWith2Plus >= 200 && daysWith3Plus >= 50,
    };
  }, [dailyEvents]);
};
