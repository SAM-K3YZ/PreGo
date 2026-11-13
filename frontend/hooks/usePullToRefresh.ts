import { useState } from 'react';

/**
 * Spinner state for a user-initiated pull. Kept separate from a query's
 * isRefetching so background refetches don't show the spinner.
 */
export function usePullToRefresh(...refetchers: (() => Promise<unknown>)[]) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all(refetchers.map((refetch) => refetch()));
    } finally {
      setRefreshing(false);
    }
  };

  return { refreshing, onRefresh };
}
