import { CalendarEvent } from '@/app/actions/get-events';
import { JSX } from 'react';

export function HistoryDetails({
  event,
}: {
  event: CalendarEvent;
}): JSX.Element {
  const formatDate = (
    dateInput: string | { dateTime?: string | null } | null | undefined
  ) => {
    if (!dateInput) return 'No date';

    let dateString: string | undefined;

    if (typeof dateInput === 'string') {
      dateString = dateInput;
    } else if (dateInput.dateTime) {
      dateString = dateInput.dateTime;
    }

    if (!dateString) return 'No date';

    const date = new Date(dateString);

    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (
    dateInput: string | { dateTime?: string | null } | null | undefined
  ) => {
    if (!dateInput) return '';

    let dateString: string | undefined;

    if (typeof dateInput === 'string') {
      dateString = dateInput;
    } else if (dateInput.dateTime) {
      dateString = dateInput.dateTime;
    }

    if (!dateString) return '';

    const date = new Date(dateString);

    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDuration = () => {
    if (!event.start?.dateTime || !event.end?.dateTime) return null;

    const start = new Date(event.start.dateTime);
    const end = new Date(event.end.dateTime);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours === 0) {
      return `${diffMinutes}m`;
    } else if (diffMinutes === 0) {
      return `${diffHours}h`;
    } else {
      return `${diffHours}h ${diffMinutes}m`;
    }
  };

  const duration = formatDuration();

  return (
    <div className="py-3 hover:bg-zinc-800/30 transition-colors border-b border-zinc-800/50 last:border-b-0">
      {/* Event Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm text-zinc-100 leading-tight font-medium truncate">
            {event.summary}
          </h4>
          <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
            <span>{formatDate(event.start)}</span>
            {formatTime(event.start) && (
              <>
                <span>•</span>
                <span>{formatTime(event.start)}</span>
              </>
            )}
            {duration && (
              <>
                <span>•</span>
                <span>{duration}</span>
              </>
            )}
          </div>
        </div>
        <div
          className={`text-xs px-2 py-0.5 rounded-full bg-zinc-800 ${
            event.status === 'confirmed'
              ? 'text-lime-400'
              : event.status === 'tentative'
              ? 'text-yellow-400'
              : 'text-red-400'
          } ml-2 flex-shrink-0`}
        >
          {event.status === 'confirmed'
            ? 'Confirmed'
            : event.status === 'tentative'
            ? 'Tentative'
            : 'Cancelled'}
        </div>
      </div>

      {/* Event Details Grid */}
      <div className="space-y-1.5">
        {/* Attendees */}
        {event.attendees && event.attendees.length > 0 && (
          <div className="flex flex-col gap-1">
            <span className="text-xs text-lime-400 font-medium">
              Attendees ({event.attendees.length})
            </span>
            <div className="text-xs text-zinc-400 leading-relaxed">
              {event.attendees.map((attendee, index) => (
                <span key={attendee.email}>
                  {attendee.email}
                  {index < event.attendees!.length - 1 && ', '}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Location */}
        {event.location && (
          <div className="flex flex-col gap-1">
            <span className="text-xs text-lime-400 font-medium">Location</span>
            <span className="text-xs text-zinc-400">{event.location}</span>
          </div>
        )}

        {/* Organizer */}
        {event.organizer?.email && (
          <div className="flex flex-col gap-1">
            <span className="text-xs text-lime-400 font-medium">Organizer</span>
            <span className="text-xs text-zinc-400">
              {event.organizer.email}
            </span>
          </div>
        )}

        {/* Description */}
        {event.description && (
          <div className="flex flex-col gap-1">
            <span className="text-xs text-lime-400 font-medium">
              Description
            </span>
            <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
              {event.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
