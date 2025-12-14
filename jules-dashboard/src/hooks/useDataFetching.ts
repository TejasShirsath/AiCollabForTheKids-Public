/**
 * Hook for managing data fetching with loading states
 * Provides realistic loading simulation for dashboard metrics
 */
import { useState, useEffect, useCallback } from 'react';

interface UseDataFetchingOptions<T> {
  /**
   * Initial data to show after loading
   */
  initialData: T;
  /**
   * Simulated fetch delay in milliseconds
   */
  fetchDelay?: number;
  /**
   * Whether to start fetching immediately
   */
  fetchOnMount?: boolean;
}

export function useDataFetching<T>(options: UseDataFetchingOptions<T>) {
  const { initialData, fetchDelay = 1000, fetchOnMount = true } = options;
  
  const [data, setData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState(fetchOnMount);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, fetchDelay));
      setData(initialData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [initialData, fetchDelay]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (fetchOnMount) {
      fetchData();
    }
  }, [fetchData, fetchOnMount]);

  return {
    data,
    isLoading,
    error,
    refresh
  };
}