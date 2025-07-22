'use client';

import { AlertTriangleIcon } from 'lucide-react';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-200 px-4">
      <div className="text-center max-w-md space-y-6">
        <div className="inline-flex items-center gap-3 text-lime-400">
          <AlertTriangleIcon size={28} />
          <h2 className="text-2xl font-bold">Something went wrong</h2>
        </div>

        <p className="text-zinc-500 text-sm">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>

        <button
          onClick={reset}
          className="group bg-lime-400 hover:bg-lime-300 text-zinc-900 font-bold py-3 px-6 rounded-lg inline-flex items-center gap-2 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-lime-500/20"
        >
          <span>Try again</span>
        </button>
      </div>
    </div>
  );
}
