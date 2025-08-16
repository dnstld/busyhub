'use client';

import CalendarIntelligence from '@/components/presenters/calendar-intelligence';
import { useInsight } from '@/hooks/use-insight';
import { useCalendar } from '@/providers/events-provider';
import { useCallback, useEffect, useState } from 'react';

interface CalendarIntelligenceContainerProps {
  onAnalysisGenerated?: (analysis: string) => void;
}

function CalendarIntelligenceContainer({
  onAnalysisGenerated,
}: CalendarIntelligenceContainerProps) {
  const insightData = useInsight();
  const events = useCalendar();
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasCalendarToken = events !== null;

  const generateAnalysis = useCallback(async () => {
    if (isLoading) return;

    let promptToUse: string;

    if (insightData?.aiPrompt) {
      // Normal case: user has events, use the generated AI prompt
      promptToUse = insightData.aiPrompt;
    } else if (hasCalendarToken && !insightData) {
      // Special case: user has calendar connected but no events
      promptToUse = 'Act as a productivity and time management consultant. The user has successfully connected their calendar but currently has no scheduled events or meetings for this time period. Write a natural, encouraging paragraph that acknowledges their fresh start and provides practical guidance. Focus on the opportunity for intentional planning, time blocking for deep work, and building sustainable scheduling habits. Suggest starting with personal time blocks, gradual meeting scheduling, and protecting focused work periods. Avoid lists or bullet points. Keep it conversational, under 500 characters, and inspiring for someone beginning their organized calendar journey.';
    } else {
      // No calendar token or other edge case
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/insights/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: promptToUse }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate analysis');
      }

      const data = await response.json();
      setAnalysis(data.analysis);

      // Call the optional callback
      if (onAnalysisGenerated) {
        onAnalysisGenerated(data.analysis);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('AI Analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [hasCalendarToken, insightData, isLoading, onAnalysisGenerated]);

  useEffect(() => {
    // Auto-generate analysis when conditions are met
    if (hasCalendarToken && !analysis && !isLoading) {
      // Either has insightData (events) or doesn't (empty calendar) - both should trigger analysis
      generateAnalysis();
    }
  }, [hasCalendarToken, insightData, analysis, isLoading, generateAnalysis]);
  return (
    <CalendarIntelligence
      insightData={insightData}
      analysis={analysis}
      isLoading={isLoading}
      error={error}
      onGenerateAnalysis={generateAnalysis}
      hasCalendarToken={hasCalendarToken}
    />
  );
}

export default CalendarIntelligenceContainer;
