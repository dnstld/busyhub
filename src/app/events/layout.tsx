import { auth } from '@/auth/next';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'BusyHub — Your Dashboard',
  description: 'AI-Powered calendar insights',
  keywords: [
    'Google Calendar visualization',
    'productivity tracker',
    'calendar analytics',
    'busyhub',
    'AI productivity insights',
    'time management',
    'calendar productivity',
    'visualize calendar events',
    'calendar insights',
    'AI calendar assistant',
    'calendar heatmap app',
    'productivity analytics',
    'busyhub app',
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
