'use client';

import { Calendar } from 'lucide-react';

interface ChartEmptyStateProps {
  title?: string;
  description?: string;
}

export const ChartEmptyState = ({
  title = 'No Events Data',
  description = 'Add some events to see your activity chart',
}: ChartEmptyStateProps) => {
  return (
    <div className="border border-zinc-800 rounded-xl p-4">
      <div className="text-center space-y-4">
        <div
          className="w-12 h-12 bg-lime-500/10 rounded-xl mx-auto flex items-center justify-center"
          aria-hidden="true"
        >
          <Calendar className="text-lime-400" size={24} />
        </div>
        <h2 className="text-xl font-semibold text-zinc-100">{title}</h2>
        <p className="text-zinc-400">{description}</p>
      </div>
    </div>
  );
};
