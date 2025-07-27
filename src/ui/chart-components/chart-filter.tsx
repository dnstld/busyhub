'use client';

export type FilterType = 'all' | 'past' | 'upcoming';

interface ChartFilterProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  className?: string;
}

export const ChartFilter = ({
  filter,
  onFilterChange,
  className = '',
}: ChartFilterProps) => {
  return (
    <div className={`flex gap-1 bg-zinc-800 rounded-lg p-2 w-fit ${className}`}>
      {(['all', 'past', 'upcoming'] as const).map((type) => (
        <button
          key={type}
          onClick={() => onFilterChange(type)}
          className={`px-1.5 py-0.5 rounded text-sm capitalize transition-colors cursor-pointer ${
            filter === type
              ? 'bg-lime-400 text-zinc-900 font-medium'
              : 'text-zinc-400 hover:text-zinc-300'
          }`}
        >
          {type === 'all' ? 'All' : type}
        </button>
      ))}
    </div>
  );
};
