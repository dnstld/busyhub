'use client';

interface ButtonGroupOption<T> {
  value: T;
  label: string;
}

interface ButtonGroupProps<T> {
  options: ButtonGroupOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function ButtonGroup<T extends string>({
  options,
  value,
  onChange,
  className = '',
}: ButtonGroupProps<T>) {
  return (
    <div className={`flex gap-1 bg-zinc-800 rounded-lg p-2 w-fit ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`px-3 p-1.5 rounded text-sm capitalize transition-colors cursor-pointer ${
            value === option.value
              ? 'bg-lime-400 text-zinc-900 font-medium'
              : 'text-zinc-400 hover:text-zinc-300'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
