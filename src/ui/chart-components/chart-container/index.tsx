'use client';

import { ReactNode } from 'react';

interface ChartContainerProps {
  children: ReactNode;
  className?: string;
}

export const ChartContainer = ({
  children,
  className = '',
}: ChartContainerProps) => {
  return (
    <section
      className={`border border-zinc-800 rounded-xl overflow-hidden ${className}`}
    >
      {children}
    </section>
  );
};
