/**
 * Higher-Order Component for Skeleton Loading
 * Wraps components with automatic skeleton loading states
 */
import React from 'react';
import { Skeleton } from './skeleton';

interface WithSkeletonProps {
  isLoading: boolean;
  children: React.ReactNode;
  skeletonHeight?: string;
  skeletonWidth?: string;
  skeletonVariant?: 'default' | 'rounded' | 'circle';
  className?: string;
}

/**
 * Simple wrapper that shows skeleton while loading
 */
export const WithSkeleton: React.FC<WithSkeletonProps> = ({
  isLoading,
  children,
  skeletonHeight = '2rem',
  skeletonWidth = '100%',
  skeletonVariant = 'default',
  className
}) => {
  if (isLoading) {
    return (
      <Skeleton
        height={skeletonHeight}
        width={skeletonWidth}
        variant={skeletonVariant}
        className={className}
      />
    );
  }

  return <>{children}</>;
};

/**
 * HOC factory for creating components with built-in skeleton loading
 */
export function withSkeletonLoading<P extends object>(
  Component: React.ComponentType<P>,
  skeletonProps?: {
    height?: string;
    width?: string;
    variant?: 'default' | 'rounded' | 'circle';
  }
) {
  const WrappedComponent = (props: P & { isLoading?: boolean }) => {
    const { isLoading = false, ...componentProps } = props;
    
    if (isLoading) {
      return (
        <Skeleton
          height={skeletonProps?.height || '2rem'}
          width={skeletonProps?.width || '100%'}
          variant={skeletonProps?.variant || 'default'}
        />
      );
    }

    return <Component {...(componentProps as P)} />;
  };

  WrappedComponent.displayName = `withSkeletonLoading(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

/**
 * Hook for creating skeleton loading states for multiple items
 */
export function useSkeletonList(count: number, isLoading: boolean) {
  return React.useMemo(() => {
    if (isLoading) {
      return Array.from({ length: count }, (_, index) => (
        <Skeleton key={`skeleton-${index}`} height="2rem" width="100%" />
      ));
    }
    return [];
  }, [count, isLoading]);
}