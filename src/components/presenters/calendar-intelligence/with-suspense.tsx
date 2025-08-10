'use client';

import { useAIAnalysis, useInsight } from '@/hooks';
import { Brain, Loader2 } from 'lucide-react';
import { Suspense } from 'react';
import CalendarIntelligence from './index';

// Loading fallback component for Suspense
const CalendarIntelligenceFallback = () => (
  <section className="flex flex-col gap-4 p-6 bg-zinc-900/50 rounded-lg border border-zinc-800">
    <div className="flex items-center gap-3">
      <Brain className="w-5 h-5 text-blue-400" />
      <h2 className="text-lg font-semibold">Calendar Intelligence</h2>
    </div>
    <div className="flex items-center justify-center p-8 text-zinc-400">
      <Loader2 className="w-6 h-6 animate-spin mr-2" />
      Loading...
    </div>
  </section>
);

// Container component that handles the AI analysis logic
const CalendarIntelligenceContainer = () => {
  const insightData = useInsight();
  const { analysis, isLoading, error, generateAnalysis } = useAIAnalysis();

  const handleGenerateAnalysis = () => {
    if (insightData?.aiPrompt) {
      generateAnalysis(insightData.aiPrompt);
    }
  };

  return (
    <CalendarIntelligence
      insightData={insightData}
      analysis={analysis}
      isLoading={isLoading}
      error={error}
      onGenerateAnalysis={handleGenerateAnalysis}
    />
  );
};

// Main export with Suspense wrapper
const CalendarIntelligenceWithSuspense = () => (
  <Suspense fallback={<CalendarIntelligenceFallback />}>
    <CalendarIntelligenceContainer />
  </Suspense>
);

export default CalendarIntelligenceWithSuspense;
export { CalendarIntelligence, CalendarIntelligenceContainer };
