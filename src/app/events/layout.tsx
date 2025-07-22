import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Your events',
  description: 'Your personal calendar with events',
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
