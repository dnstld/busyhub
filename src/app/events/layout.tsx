import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'BusyHub - Your Calendar, Beautifully Visualized',
  description: 'Your events, transformed into interactive charts',
  keywords: [
    'calendar heatmap',
    'Google Calendar visualization',
    'productivity tracker',
    'calendar analytics',
    'busyhub',
    'calendar app for busy people',
  ],
};

export default async function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect('/');

  return <>{children}</>;
}
