import { CalendarEvent } from '@/app/actions/getEvents';
import { MapPin, User, Users } from 'lucide-react';
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

  return (
    <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 hover:border-lime-400/20 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-zinc-100 mb-1 leading-tight">
            {event.summary}
          </h4>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span>{formatDate(event.start)}</span>
            {formatTime(event.start) && (
              <>
                <span>•</span>
                <span>{formatTime(event.start)}</span>
              </>
            )}
          </div>
        </div>
        <div className="w-2 h-2 bg-lime-400 rounded-full flex-shrink-0 mt-2"></div>
      </div>

      {/* Details */}
      <div className="space-y-2">
        {event.organizer?.email && (
          <div className="flex items-center gap-2 text-sm">
            <User className="text-zinc-500 flex-shrink-0" size={14} />
            <span className="text-zinc-400">
              <span className="text-zinc-500">Organizer:</span>{' '}
              {event.organizer.email}
            </span>
          </div>
        )}

        {event.location && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="text-zinc-500 flex-shrink-0" size={14} />
            <span className="text-zinc-400">
              <span className="text-zinc-500">Location:</span> {event.location}
            </span>
          </div>
        )}

        {event.attendees && event.attendees.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Users className="text-zinc-500 flex-shrink-0" size={14} />
              <span className="text-zinc-500">
                Attendees ({event.attendees.length}):
              </span>
            </div>
            <div className="flex flex-wrap gap-1 ml-6">
              {event.attendees.map((attendee) => (
                <span
                  key={attendee.email}
                  className="text-xs bg-zinc-700 hover:bg-zinc-600 px-2 py-1 rounded text-zinc-300 transition-colors"
                >
                  {attendee.email}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
