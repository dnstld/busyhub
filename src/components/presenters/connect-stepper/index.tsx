'use client';

import { CalendarIcon, CheckCircleIcon, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export default function ConnectStepper() {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      const res = await fetch('/api/calendar/connect');
      const { authUrl } = await res.json();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to connect calendar:', error);
      setIsConnecting(false);
    }
  };

  return (
    <div className="border border-zinc-800 rounded-xl p-6 bg-zinc-900/30">
      <div className="space-y-6">
        {/* Stepper */}
        <ul className="relative flex flex-col md:flex-row gap-2">
          {/* Step 1: Completed */}
          <li className="md:shrink md:basis-0 flex-1 group flex gap-x-2 md:block">
            <div className="min-w-7 min-h-7 flex flex-col items-center md:w-full md:inline-flex md:flex-wrap md:flex-row text-xs align-middle">
              <span className="size-7 flex justify-center items-center shrink-0 bg-lime-400 font-medium text-zinc-900 rounded-full">
                <CheckCircleIcon size={16} />
              </span>
              <div className="mt-2 w-px h-full md:mt-0 md:ms-2 md:w-full md:h-px md:flex-1 bg-lime-400 group-last:hidden"></div>
            </div>
            <div className="grow md:grow-0 md:mt-3 pb-5">
              <span className="block text-sm font-medium text-zinc-100">
                Google Account
              </span>
              <p className="text-sm text-zinc-400">Securely connected</p>
            </div>
          </li>

          {/* Step 2: Current */}
          <li className="md:shrink md:basis-0 flex-1 group flex gap-x-2 md:block">
            <div className="min-w-7 min-h-7 flex flex-col items-center md:w-full md:inline-flex md:flex-wrap md:flex-row text-xs align-middle">
              <span className="size-7 flex justify-center items-center shrink-0 bg-zinc-700 border-2 border-lime-400 font-medium text-lime-400 rounded-full">
                <CalendarIcon size={16} />
              </span>
              <div className="mt-2 w-px h-full md:mt-0 md:ms-2 md:w-full md:h-px md:flex-1 bg-zinc-700 group-last:hidden"></div>
            </div>
            <div className="grow md:grow-0 md:mt-3 pb-5">
              <span className="block text-sm font-medium text-zinc-100">
                Calendar Access
              </span>
              <p className="text-sm text-zinc-400 mb-3">
                Grant permission to continue
              </p>
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="bg-lime-400 hover:bg-lime-300 disabled:bg-lime-400/50 disabled:cursor-not-allowed text-zinc-900 font-medium py-2.5 px-5 rounded-lg transition-colors text-sm"
              >
                {isConnecting ? 'Connecting...' : 'Connect Calendar'}
              </button>
            </div>
          </li>

          {/* Step 3: Timeline Ready */}
          <li className="md:shrink md:basis-0 flex-1 group flex gap-x-2 md:block">
            <div className="min-w-7 min-h-7 flex flex-col items-center md:w-full md:inline-flex md:flex-wrap md:flex-row text-xs align-middle">
              <span className="size-7 flex justify-center items-center shrink-0 bg-zinc-700 border border-zinc-600 font-medium text-zinc-400 rounded-full">
                <TrendingUp size={16} />
              </span>
              <div className="mt-2 w-px h-full md:mt-0 md:ms-2 md:w-full md:h-px md:flex-1 bg-zinc-700 group-last:hidden"></div>
            </div>
            <div className="grow md:grow-0 md:mt-3 pb-5">
              <span className="block text-sm font-medium text-zinc-400">
                Timeline Ready
              </span>
              <p className="text-sm text-zinc-500">
                View your calendar visualization
              </p>
            </div>
          </li>
        </ul>

        {/* Security Information */}
        <div className="border-t border-zinc-800 pt-4">
          <div className="text-center space-y-2">
            <p className="text-xs text-zinc-500">
              🔒 Read-only access • Secure OAuth 2.0 • No data stored
              permanently
            </p>
            <p className="text-xs text-zinc-400">
              We only access your calendar events to create visualizations. You
              can revoke access anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
