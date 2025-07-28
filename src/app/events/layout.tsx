import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'BusyHub | Your events',
  description: 'Your events timeline and analytics',
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
