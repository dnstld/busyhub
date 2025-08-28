import { auth } from '@/auth/next';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'BusyHub — Your Dashboard',
  description: 'AI-Powered calendar insights',
  keywords: [
    'calendar heatmap',
    'Google Calendar visualization',
    'productivity tracker',
    'calendar analytics',
    'busyhub',
    'calendar app for busy people',
    'AI productivity insights',
    'time management',
    'meeting optimization',
    'calendar productivity',
    'visualize calendar events',
    'calendar insights',
    'busy schedule management',
    'AI calendar assistant',
    'calendar heatmap app',
    'productivity analytics',
    'busyhub app',
    'calendar heatmap visualization',
    'calendar event analysis',
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
