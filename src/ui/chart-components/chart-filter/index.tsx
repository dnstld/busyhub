'use client';

import { ButtonGroup } from '../button-group';

export type FilterType = 'all' | 'past' | 'upcoming';

interface ChartFilterProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  className?: string;
}

const filterOptions = [
  { value: 'all' as const, label: 'All' },
  { value: 'past' as const, label: 'Past' },
  { value: 'upcoming' as const, label: 'Upcoming' },
];

export const ChartFilter = ({
  filter,
  onFilterChange,
  className = '',
}: ChartFilterProps) => {
  return (
    <ButtonGroup
      options={filterOptions}
      value={filter}
      onChange={onFilterChange}
      className={className}
    />
  );
};
