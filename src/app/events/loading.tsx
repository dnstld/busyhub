import CalendarLoading from '@/components/ui/calendar-loading';

export default function Loading() {
  return (
    <div
      className="flex items-center justify-center min-h-screen"
      role="status"
    >
      <CalendarLoading
        title="Loading Events"
        subtitle="Please wait while we fetch your events"
      />
    </div>
  );
}
