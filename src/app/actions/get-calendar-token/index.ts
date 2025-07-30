import { cookies } from 'next/headers';

export async function getCalendarAccessToken() {
  return (await cookies()).get('calendarAccessToken')?.value ?? null;
}