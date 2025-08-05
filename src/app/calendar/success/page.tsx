'use client';

import CalendarLoading from '@/components/ui/calendar-loading';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CalendarSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const storeCalendarTokens = async () => {
      try {
        const response = await fetch('/api/calendar/store-tokens', {
          method: 'POST',
        });

        if (response.ok) {
          router.push('/events');
        } else {
          console.error(
            'Failed to store calendar tokens',
            response.status,
            response.statusText
          );
          const errorType =
            response.status === 401
              ? 'calendar_auth_failed'
              : 'calendar_auth_failed';
          router.push(`/events?error=${errorType}`);
        }
      } catch (error) {
        console.error('Error storing calendar tokens:', error);
        router.push('/events?error=calendar_auth_failed');
      }
    };

    storeCalendarTokens();
  }, [router]);

  return <CalendarLoading title="Setting up Calendar Access" active={false} />;
}
