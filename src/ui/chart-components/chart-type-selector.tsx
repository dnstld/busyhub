'use client';

export type ChartType = 'daily' | 'weekly' | 'monthly';

interface ChartTypeSelectorProps {
  chartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
  className?: string;
}

export const ChartTypeSelector = ({
  chartType,
  onChartTypeChange,
  className = '',
}: ChartTypeSelectorProps) => {
  return (
    <div className={`flex gap-1 bg-zinc-800 rounded-lg p-2 w-fit ${className}`}>
      {(['daily', 'weekly', 'monthly'] as const).map((type) => (
        <button
          key={type}
          onClick={() => onChartTypeChange(type)}
          className={`px-3 p-1.5 rounded text-sm capitalize transition-colors cursor-pointer ${
            chartType === type
              ? 'bg-lime-400 text-zinc-900 font-medium'
              : 'text-zinc-400 hover:text-zinc-300'
          }`}
        >
          {type}
        </button>
      ))}
    </div>
  );
};
