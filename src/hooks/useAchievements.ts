import { useMemo } from 'react';

interface UseAchievementsProps {
  dailyEvents: Map<string, any[]>;
  totalEvents: number;
  totalWeekdays: number;
}

export const useAchievements = ({ dailyEvents, totalEvents, totalWeekdays }: UseAchievementsProps) => {
  return useMemo(() => {
    const countDaysWithMinEvents = (minEvents: number) => {
      let count = 0;
      for (const dayEvents of dailyEvents.values()) {
        if (dayEvents.length >= minEvents) count++;
      }
      return count;
    };

    const quarter = Math.floor(totalWeekdays * 0.25);
    const half = Math.floor(totalWeekdays * 0.5);

    return {
      welcome: true,
      beginner: totalEvents < quarter,
      onFire: 
        totalEvents >= quarter && 
        totalEvents < half && 
        countDaysWithMinEvents(2) >= quarter,
      king: 
        totalEvents >= half && 
        countDaysWithMinEvents(3) >= half,
    };
  }, [dailyEvents, totalEvents, totalWeekdays]);
};