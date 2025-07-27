import { JSX } from 'react';

export type FilterType = 'past' | 'upcoming' | 'all';

export function HistoryFilter({
  value,
  onChange,
}: {
  value: FilterType;
  onChange: (value: FilterType) => void;
}): JSX.Element {
  const options = [
    { value: 'past' as FilterType, label: 'Past Events' },
    { value: 'all' as FilterType, label: 'All Events' },
    { value: 'upcoming' as FilterType, label: 'Upcoming Events' },
  ];

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as FilterType)}
      className="bg-zinc-800 hover:bg-zinc-700 transition-colors p-4 rounded-lg shadow-md cursor-pointer border-r-16 border-r-transparent"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
