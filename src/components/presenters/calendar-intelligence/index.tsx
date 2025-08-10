'use client';

import { InsightData } from '@/hooks/use-insight';
import { AlertCircle, Brain, Loader2 } from 'lucide-react';
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
  // Automatically trigger analysis when component loads and data is available
  useEffect(() => {
    if (insightData && !analysis && !isLoading && !error) {
      onGenerateAnalysis();
    }
  }, [insightData, analysis, isLoading, error, onGenerateAnalysis]);

  if (!insightData) {
    return (
      <section className="flex flex-col gap-4 p-6 bg-zinc-900/50 rounded-lg border border-zinc-800">
        <div className="flex items-center gap-3">
          <Brain className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold">Calendar Intelligence</h2>
        </div>
        <div className="flex items-center justify-center p-8 text-zinc-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Loading calendar data...
        </div>
      </section>
    );
  }

  // Show loading state while generating analysis
  if (isLoading || (!analysis && !error)) {
    return (
      <section className="flex flex-col gap-4 p-6 bg-zinc-900/50 rounded-lg border border-zinc-800">
        <div className="flex items-center gap-3">
          <Brain className="text-lime-400" size={20} aria-hidden="true" />
          <h2 className="text-lg font-semibold">Calendar Intelligence</h2>
        </div>
        <div className="flex items-center justify-center p-8 text-zinc-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Generating AI insights...
        </div>
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

      {analysis && (
        <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line break-words max-w-full overflow-hidden">
          {analysis}
        </div>
      )}
    </section>
  );
};

export default CalendarIntelligence;
