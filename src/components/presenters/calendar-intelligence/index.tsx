'use client';

import { InsightData } from '@/hooks/use-insight';
import { AlertCircle, Brain } from 'lucide-react';
import { useEffect } from 'react';

interface CalendarIntelligenceProps {
  insightData: InsightData | null;
  analysis: string | null;
  isLoading: boolean;
  error: string | null;
  onGenerateAnalysis: () => void;
}

const CalendarIntelligence: React.FC<CalendarIntelligenceProps> = ({
  insightData,
  analysis,
  isLoading,
  error,
  onGenerateAnalysis,
}) => {
  useEffect(() => {
    if (insightData && !analysis && !isLoading && !error) {
      onGenerateAnalysis();
    }
  }, [insightData, analysis, isLoading, error, onGenerateAnalysis]);

  if (!insightData) {
    return (
      <section className="flex flex-col gap-4 p-6 bg-zinc-900/50 rounded-lg border border-zinc-800">
        <div className="flex items-center gap-3">
          <Brain className="text-lime-400" size={20} aria-hidden="true" />
          <h2 className="text-lg font-semibold">Calendar Intelligence</h2>
        </div>
        <p className="text-sm text-zinc-400">
          Connect your calendar to enable AI-powered schedule analysis and get
          personalized productivity insights
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4 p-6 bg-zinc-900/50 rounded-lg border border-zinc-800 min-w-0 w-full overflow-hidden">
      <div className="flex items-center gap-3">
        <Brain className="text-lime-400" size={20} aria-hidden="true" />
        <h2 className="text-lg font-semibold">Calendar Intelligence</h2>
      </div>

      {error && (
        <div className="p-3 bg-red-900/20 border border-red-700/50 rounded-lg">
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle
              className="text-lime-400"
              size={20}
              aria-hidden="true"
            />
            <span className="text-sm">Error: {error}</span>
          </div>
          <button
            onClick={onGenerateAnalysis}
            className="mt-2 text-xs text-red-300 hover:text-red-200 underline"
          >
            Try again
          </button>
        </div>
      )}

      {isLoading && !analysis && !error && (
        <div role="status" className="animate-pulse">
          <div className="h-2 bg-zinc-700 rounded-full w-[95%] mb-2.5"></div>
          <div className="h-2 bg-zinc-700 rounded-full w-full mb-2.5"></div>
          <div className="h-2 bg-zinc-700 rounded-full w-[97%] mb-2.5"></div>
          <div className="h-2 bg-zinc-700 rounded-full w-[90%] mb-2.5"></div>
          <div className="h-2 bg-zinc-700 rounded-full w-[50%] mb-2.5"></div>
          <span className="sr-only">Loading AI analysis...</span>
        </div>
      )}

      {analysis && (
        <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line break-words max-w-full overflow-hidden">
          {analysis}
        </p>
      )}
    </section>
  );
};

export default CalendarIntelligence;
