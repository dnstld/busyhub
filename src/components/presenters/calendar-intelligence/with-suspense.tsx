'use client';

import type { CalendarToken } from '@/app/actions/get-calendar-token';
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
const CalendarIntelligenceContainer = ({
  calendarToken,
}: {
  calendarToken: CalendarToken;
}) => {
  const insightData = useInsight();
  const { analysis, isLoading, error, generateAnalysis } = useAIAnalysis();

  const handleGenerateAnalysis = () => {
    if (insightData?.aiPrompt) {
      // Normal case: user has events, use the generated AI prompt
      generateAnalysis(insightData.aiPrompt);
    } else if (calendarToken && !insightData) {
      // Special case: user has calendar connected but no events
      const emptyCalendarPrompt =
        'Act as a productivity and time management consultant. The user has successfully connected their calendar but currently has no scheduled events or meetings for this time period. Write a natural, encouraging paragraph that acknowledges their fresh start and provides practical guidance. Focus on the opportunity for intentional planning, time blocking for deep work, and building sustainable scheduling habits. Suggest starting with personal time blocks, gradual meeting scheduling, and protecting focused work periods. Avoid lists or bullet points. Keep it conversational, under 500 characters, and inspiring for someone beginning their organized calendar journey.';
      generateAnalysis(emptyCalendarPrompt);
    }
  };

  return (
    <CalendarIntelligence
      insightData={insightData}
      analysis={analysis}
      isLoading={isLoading}
      error={error}
      onGenerateAnalysis={handleGenerateAnalysis}
      calendarToken={calendarToken}
    />
  );
};

// Main export with Suspense wrapper
const CalendarIntelligenceWithSuspense = ({
  calendarToken,
}: {
  calendarToken: CalendarToken;
}) => (
  <Suspense fallback={<CalendarIntelligenceFallback />}>
    <CalendarIntelligenceContainer calendarToken={calendarToken} />
  </Suspense>
);

export default CalendarIntelligenceWithSuspense;
export { CalendarIntelligence, CalendarIntelligenceContainer };
