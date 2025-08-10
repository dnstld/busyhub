'use client';

import CalendarIntelligence from '@/components/presenters/calendar-intelligence';
import { useInsight } from '@/hooks/use-insight';
import { useCallback, useEffect, useState } from 'react';

interface CalendarIntelligenceContainerProps {
  onAnalysisGenerated?: (analysis: string) => void;
}

function CalendarIntelligenceContainer({
  onAnalysisGenerated,
}: CalendarIntelligenceContainerProps) {
  const insightData = useInsight();
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAnalysis = useCallback(async () => {
    if (!insightData?.aiPrompt || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/insights/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: insightData.aiPrompt }),
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
  }, [insightData?.aiPrompt, isLoading, onAnalysisGenerated]);

  useEffect(() => {
    // Auto-generate analysis when insight data is available
    if (insightData && !analysis && !isLoading) {
      generateAnalysis();
    }
  }, [insightData, analysis, isLoading, generateAnalysis]);
  return (
    <CalendarIntelligence
      insightData={insightData}
      analysis={analysis}
      isLoading={isLoading}
      error={error}
      onGenerateAnalysis={generateAnalysis}
    />
  );
}

export default CalendarIntelligenceContainer;
