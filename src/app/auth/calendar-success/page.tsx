'use client';

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
          console.error('Failed to store calendar tokens');
          router.push('/events?error=calendar_auth_failed');
        }
      } catch (error) {
        console.error('Error storing calendar tokens:', error);
        router.push('/events?error=calendar_auth_failed');
      }
    };

    storeCalendarTokens();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-xl font-semibold mb-2">
          Setting up Calendar Access
        </h1>
        <p className="text-gray-600">
          Please wait while we complete the setup...
        </p>
      </div>
    </div>
  );
}
