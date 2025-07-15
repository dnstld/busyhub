'use client';

import { useCalendar } from '@/app/context/events-provider-client';
import { useAchievements } from '@/hooks/useAchievements';
import { useDate } from '@/hooks/useDate';
import { useEvents } from '@/hooks/useEvents';
import Image from 'next/image';
import { use } from 'react';

const Achievements = () => {
  const events = use(useCalendar());
  const { dailyEvents, totalEvents } = useEvents(events);
  const { totalWeekdays } = useDate();

  const achievements = useAchievements({
    dailyEvents,
    totalEvents,
    totalWeekdays,
  });

  return (
    <div className="flex gap-2">
      <Image
        src="/images/achievement-welcome.png"
        alt="Welcome badge"
        className={`w-12 h-12 ${!achievements.welcome ? 'opacity-15' : ''}`}
        width={48}
        height={48}
        title="Welcome badge"
      />

      <Image
        src="/images/achievement-beginner.png"
        alt="Beginner badge"
        className={`w-12 h-12 ${!achievements.beginner ? 'opacity-15' : ''}`}
        width={48}
        height={48}
        title="Beginner badge"
      />

      <Image
        src="/images/achievement-on-fire.png"
        alt="On fire badge"
        className={`w-12 h-12 ${!achievements.onFire ? 'opacity-15' : ''}`}
        width={48}
        height={48}
        title="On fire badge"
      />

      <Image
        src="/images/achievement-king.png"
        alt="The king badge"
        className={`w-12 h-12 ${!achievements.king ? 'opacity-15' : ''}`}
        width={48}
        height={48}
        title="The king badge"
      />
    </div>
  );
};

export default Achievements;
