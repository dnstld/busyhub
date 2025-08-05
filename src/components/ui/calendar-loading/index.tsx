interface Props {
  title: string;
  active?: boolean;
}

export default function CalendarLoading({ title, active = true }: Props) {
  const activeClass = active ? 'bg-lime-500' : 'bg-zinc-400';
  return (
    <div
      className="flex items-center justify-center min-h-screen"
      role="status"
      aria-live="polite"
      aria-label={`Loading: ${title}`}
    >
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto" aria-hidden="true">
          <div className="w-16 h-16 bg-white rounded-lg shadow-lg border-2 border-gray-200 animate-pulse">
            <div className={`w-full h-4 ${activeClass} rounded-t-md`}></div>

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
                  className={`w-2 h-2 rounded-full animate-bounce ${activeClass}`}
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

        <p className="font-semibold mt-4">{title}</p>
      </div>
    </div>
  );
}
