export default function CalendarLoading() {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative" aria-hidden="true">
        <div className="w-16 h-16 bg-white rounded-lg shadow-lg border-2 border-gray-200 animate-pulse">
          <div className="w-full h-4 bg-lime-500 rounded-t-md"></div>

          <div className="absolute -top-1 left-3 w-2 h-4 bg-zinc-600 rounded-full"></div>
          <div className="absolute -top-1 right-3 w-2 h-4 bg-zinc-600 rounded-full"></div>

          <div className="p-2 pt-3">
            <div className="grid grid-cols-3 gap-1">
              <div
                className="w-2 h-2 bg-zinc-400 rounded-full animate-pulse"
                style={{ animationDelay: '0.1s' }}
              ></div>
              <div
                className="w-2 h-2 bg-zinc-400 rounded-full animate-pulse"
                style={{ animationDelay: '0.2s' }}
              ></div>
              <div
                className="w-2 h-2 bg-zinc-400 rounded-full animate-pulse"
                style={{ animationDelay: '0.3s' }}
              ></div>
              <div
                className="w-2 h-2 bg-lime-500 rounded-full animate-bounce"
                style={{ animationDelay: '0.5s' }}
              ></div>
              <div
                className="w-2 h-2 bg-zinc-400 rounded-full animate-pulse"
                style={{ animationDelay: '0.4s' }}
              ></div>
              <div
                className="w-2 h-2 bg-zinc-400 rounded-full animate-pulse"
                style={{ animationDelay: '0.6s' }}
              ></div>
            </div>
          </div>
        </div>

        <div className="absolute -inset-2 border-2 border-lime-500 rounded-xl opacity-30 animate-ping"></div>
      </div>

      <p className="sr-only">Loading events...</p>
    </div>
  );
}
