import { CalendarEvent } from '@/app/actions/getEvents';
import { JSX } from 'react';

export function HistoryDetails({
  event,
}: {
  event: CalendarEvent;
}): JSX.Element {
  const formatDate = (dateInput: any) => {
    if (!dateInput) return 'No date';

    const date = new Date(
      typeof dateInput === 'string' ? dateInput : dateInput.dateTime
    );

    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <li
      key={event.id}
      className="flex flex-col gap-1 border-l-4 border-lime-300 pl-4 py-2"
    >
      <header className="flex items-center justify-between">
        <h4 className="font-bold">{event.summary}</h4>
        <span className="text-xs text-zinc-500">{formatDate(event.start)}</span>
      </header>

      <div className="text-xs text-zinc-400 overflow-hidden text-ellipsis">
        {event.organizer?.email && (
          <p className="text-xs">
            <b>Organizer: </b>
            {event.organizer.email}
          </p>
        )}
        {event.location && (
          <p className="">
            <b>Location: </b>
            {event.location}
          </p>
        )}
      </div>
      {event.attendees && event.attendees.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-zinc-500 mb-1">
            Attendees ({event.attendees.length}):
          </p>
          <div className="flex flex-wrap gap-1">
            {event.attendees.map((attendee) => (
              <span
                key={attendee.email}
                className="text-xs bg-zinc-800 px-2 py-1 rounded text-zinc-300"
              >
                {attendee.email}
              </span>
            ))}
          </div>
        </div>
      )}
    </li>
  );
}
