import CalendarLoading from '@/ui/calendar-loading';

export default function Loading() {
  return (
    <div
      className="flex items-center justify-center min-h-screen"
      role="status"
    >
      <CalendarLoading />
    </div>
  );
}
