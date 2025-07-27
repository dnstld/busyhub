'use client';

interface StatItem {
  label: string;
  value: string | number;
}

interface ChartSummaryStatsProps {
  stats: StatItem[];
  columns?: 2 | 3;
  className?: string;
}

export const ChartSummaryStats = ({
  stats,
  columns = 2,
  className = '',
}: ChartSummaryStatsProps) => {
  const gridClass = columns === 3 ? 'grid-cols-3' : 'grid-cols-2';

  return (
    <div className={`mt-3 pt-3 border-t border-zinc-800 ${className}`}>
      <div className={`grid ${gridClass} gap-4 text-center`}>
        {stats.map((stat, index) => (
          <div key={index}>
            <p className="text-zinc-400 text-xs">{stat.label}</p>
            <p className="text-lime-400 font-semibold text-sm">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
