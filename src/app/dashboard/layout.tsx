import EventsProvider from '@/app/context/events-provider-server';

export const metadata = {
  title: 'Dashboard',
  description: 'Your personal dashboard with calendar events',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EventsProvider>
      <div className="w-full relative min-h-screen bg-zinc-950 text-zinc-100">
        {children}

        <div className="absolute inset-0 bg-gradient-to-br from-lime-300/7 to-transparent"></div>
      </div>
    </EventsProvider>
  );
}
