'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAchievements } from '@/hooks/use-achievements';
import { useDate } from '@/hooks/use-date';
import { useEvents } from '@/hooks/use-events';
import { useCalendar } from '@/providers/events-provider';
import Image from 'next/image';

const badgeData = [
  {
    id: 'welcome',
    src: '/images/achievement-welcome.png',
    title: 'Welcome badge',
    description: 'You joined the timeline club. Welcome aboard!',
  },
  {
    id: 'beginner',
    src: '/images/achievement-beginner.png',
    title: 'Beginner badge',
    description: '50+ days with at least 2 events — nice!',
  },
  {
    id: 'onFire',
    src: '/images/achievement-on-fire.png',
    title: 'On Fire badge',
    description: 'You are on a roll! 10-day streak and 100 active days!',
  },
  {
    id: 'king',
    src: '/images/achievement-king.png',
    title: 'The King badge',
    description: '200+ busy days and 50 days with 3+ events? You rule!',
  },
] as const;

const Achievements = () => {
  const events = useCalendar();
  const { dailyEvents, totalEvents } = useEvents(events);
  const { totalWeekdays } = useDate();

  const achievements = useAchievements({
    dailyEvents,
    totalEvents,
    totalWeekdays,
  });

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Your Badges</h2>

      <div className="flex gap-2">
        {badgeData.map(({ id, src, title, description }) => {
          const isEarned = achievements[id as keyof typeof achievements];

          return (
            <Tooltip key={id}>
              <TooltipTrigger asChild>
                <Image
                  key={id}
                  src={src}
                  alt={title}
                  width={48}
                  height={48}
                  className={`w-12 h-12 ${!isEarned ? 'opacity-15' : ''}`}
                />
              </TooltipTrigger>
              <TooltipContent>{description}</TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </section>
  );
};

export default Achievements;
