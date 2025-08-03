'use client';

import { refreshCalendarTokens } from '@/utils/refresh-calendar-tokens';
import { useState } from 'react';

interface TokenRefreshButtonProps {
  onRefreshComplete?: () => void;
}

export default function TokenRefreshButton({
  onRefreshComplete,
}: TokenRefreshButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const success = await refreshCalendarTokens();
      if (success && onRefreshComplete) {
        onRefreshComplete();
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
    >
      {isRefreshing ? 'Refreshing...' : 'Refresh Calendar Access'}
    </button>
  );
}
