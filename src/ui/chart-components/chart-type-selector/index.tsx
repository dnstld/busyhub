'use client';

import { ButtonGroup } from '../button-group';

export type ChartType = 'daily' | 'weekly' | 'monthly';

interface ChartTypeSelectorProps {
  chartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
  className?: string;
}

const chartTypeOptions = [
  { value: 'daily' as const, label: 'Daily' },
  { value: 'weekly' as const, label: 'Weekly' },
  { value: 'monthly' as const, label: 'Monthly' },
];

export const ChartTypeSelector = ({
  chartType,
  onChartTypeChange,
  className = '',
}: ChartTypeSelectorProps) => {
  return (
    <ButtonGroup
      options={chartTypeOptions}
      value={chartType}
      onChange={onChartTypeChange}
      className={className}
    />
  );
};
