'use client';

import { ReactNode } from 'react';

interface ChartHeaderProps {
  icon: ReactNode;
  title: string;
  children?: ReactNode;
  className?: string;
}

export const ChartHeader = ({
  icon,
  title,
  children,
  className = '',
}: ChartHeaderProps) => {
  return (
    <div className={`p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-lg font-semibold text-zinc-100">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
};
