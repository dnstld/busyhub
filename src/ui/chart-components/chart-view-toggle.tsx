'use client';

import { BarChart3, TrendingUp } from 'lucide-react';

export type ChartView = 'bar' | 'line';

interface ChartViewToggleProps {
  chartView: ChartView;
  onChartViewChange: (view: ChartView) => void;
}

export const ChartViewToggle = ({
  chartView,
  onChartViewChange,
}: ChartViewToggleProps) => {
  return (
    <div className="flex bg-zinc-800 rounded-lg p-2">
      <button
        onClick={() => onChartViewChange('bar')}
        className={`p-1.5 rounded cursor-pointer ${
          chartView === 'bar'
            ? 'bg-lime-400 text-zinc-900'
            : 'text-zinc-400 hover:text-zinc-300'
        }`}
        aria-label="Bar Chart View"
      >
        <BarChart3 size={16} aria-hidden="true" />
      </button>
      <button
        onClick={() => onChartViewChange('line')}
        className={`p-1.5 rounded cursor-pointer ${
          chartView === 'line'
            ? 'bg-lime-400 text-zinc-900'
            : 'text-zinc-400 hover:text-zinc-300'
        }`}
        aria-label="Line Chart View"
      >
        <TrendingUp size={16} aria-hidden="true" />
      </button>
    </div>
  );
};
