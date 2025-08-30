'use client';

import {
  AlertTriangleIcon,
  BarChart2Icon,
  CalendarIcon,
  CalendarPlusIcon,
  CheckIcon,
  Loader2Icon,
  RefreshCwIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function ConnectStepper() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        router.replace('/events');
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [error, router]);

  const handleConnect = useCallback(async () => {
    try {
      setIsConnecting(true);
      setError(null);

      const response = await fetch('/api/calendar/connect', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.authUrl) {
        throw new Error('No authorization URL received from server');
      }

      window.location.href = data.authUrl;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to connect calendar. Please try again.';

      setError(errorMessage);
      console.error('Calendar connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  return (
    <ul
      className="flex flex-col md:flex-row gap-4 rounded-lg border border-zinc-800 p-4"
      aria-labelledby="connect-your-calendar"
      aria-describedby="connect-your-calendar-description"
    >
      <li className="flex gap-2 md:flex-col md:flex-1">
        <div
          className="min-w-7 min-h-7 flex flex-col items-center md:w-full md:inline-flex md:flex-wrap md:flex-row text-xs align-middle"
          aria-hidden="true"
        >
          <span className="size-7 flex justify-center items-center shrink-0 bg-lime-400 font-medium text-zinc-900 rounded-full">
            <CheckIcon size={16} />
          </span>
          <div className="mt-2 w-px h-full md:mt-0 md:ms-2 md:w-full md:h-px md:flex-1 bg-lime-400"></div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="block font-semibold">Signed in with Google</p>
          <p className="text-sm text-zinc-400">
            Private by default, protected by Google
          </p>
        </div>
      </li>

      <li className="flex gap-2 md:flex-col md:flex-1">
        <div
          className="min-w-7 min-h-7 flex flex-col items-center md:w-full md:inline-flex md:flex-wrap md:flex-row text-xs align-middle"
          aria-hidden="true"
        >
          <span
            className={`size-7 flex justify-center items-center shrink-0 font-medium rounded-full ${
              error
                ? 'bg-amber-950/20 border border-amber-800/30 text-amber-400'
                : 'bg-zinc-700 border-1 border-lime-400 text-lime-400'
            }`}
          >
            {error ? (
              <AlertTriangleIcon size={16} />
            ) : (
              <CalendarIcon size={16} />
            )}
          </span>
          <div
            className={`mt-2 w-px h-full md:mt-0 md:ms-2 md:w-full md:h-px md:flex-1 ${
              error ? 'bg-amber-800/30' : 'bg-zinc-700'
            }`}
          ></div>
        </div>

        <div className="flex flex-col gap-2">
          <p id="connect-your-calendar" className="block font-semibold">
            Connect your calendar
          </p>
          <p
            id="connect-your-calendar-description"
            className="text-sm text-zinc-400"
          >
            {error
              ? 'Calendar connection failed. Please try again.'
              : 'We only read — never edit or write'}
          </p>
          <div className="mt-4">
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className={`text-sm font-semibold py-2 px-4 rounded-md inline-flex items-center gap-2 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                error
                  ? 'bg-amber-600 hover:bg-amber-500 text-white hover:shadow-amber-500/20'
                  : 'bg-lime-400 hover:bg-lime-300 text-zinc-900 hover:shadow-lime-500/20'
              }`}
            >
              {isConnecting ? (
                <Loader2Icon
                  className="animate-spin mr-2"
                  size={16}
                  aria-hidden="true"
                />
              ) : error ? (
                <RefreshCwIcon size={16} aria-hidden="true" />
              ) : (
                <CalendarPlusIcon size={16} aria-hidden="true" />
              )}
              {error ? 'Try Again' : 'Connect Calendar'}
            </button>
          </div>
        </div>
      </li>

      <li className="flex gap-2 md:flex-col md:flex-1">
        <div
          className="min-w-7 min-h-7 flex flex-col items-center md:w-full md:inline-flex md:flex-wrap md:flex-row text-xs align-middle"
          aria-hidden="true"
        >
          <span className="size-7 flex justify-center items-center shrink-0 bg-zinc-700 border border-zinc-600 font-medium text-zinc-400 rounded-full">
            <BarChart2Icon size={16} />
          </span>
          <div className="mt-2 w-px h-full md:mt-0 md:ms-2 md:w-full md:h-px md:flex-1 bg-zinc-700"></div>
        </div>

        <div className="flex flex-col gap-2 text-zinc-500">
          <p className="block font-semibold">See your year</p>
          <p className="text-sm">
            Your events, transformed into interactive charts
          </p>
        </div>
      </li>
    </ul>
  );
}
