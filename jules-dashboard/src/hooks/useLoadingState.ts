/**
 * Custom hook for managing dashboard loading states
 * Simulates API loading delays and provides smooth transitions
 */
import { useState, useEffect } from 'react';

interface UseLoadingStateOptions {
  /**
   * Minimum loading time in milliseconds (for UX consistency)
   */
  minimumLoadTime?: number;
  /**
   * Whether to start in loading state
   */
  initialLoading?: boolean;
}

export const useLoadingState = (options: UseLoadingStateOptions = {}) => {
  const { minimumLoadTime = 1200, initialLoading = true } = options;
  const [isLoading, setIsLoading] = useState(initialLoading);

  useEffect(() => {
    if (initialLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, minimumLoadTime);

      return () => clearTimeout(timer);
    }
  }, [minimumLoadTime, initialLoading]);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  return {
    isLoading,
    startLoading,
    stopLoading
  };
};