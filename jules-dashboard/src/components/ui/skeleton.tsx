/**
 * GOSPEL UI - Skeleton Loading Component
 * Provides smooth loading animations for dashboard cards
 */
import * as React from "react"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Width of the skeleton element
   * Can be a string (e.g., "100px", "50%") or undefined for full width
   */
  width?: string;
  /**
   * Height of the skeleton element
   * Can be a string (e.g., "20px", "2rem") or undefined for auto height
   */
  height?: string;
  /**
   * Border radius variant
   */
  variant?: "default" | "rounded" | "circle";
  /**
   * Animation speed
   */
  speed?: "slow" | "normal" | "fast";
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, width, height, variant = "default", speed = "normal", style, ...props }, ref) => {
    const speedClass = {
      slow: "animate-pulse duration-2000",
      normal: "animate-pulse",
      fast: "animate-pulse duration-700"
    }[speed];

    const variantClass = {
      default: "rounded",
      rounded: "rounded-lg", 
      circle: "rounded-full"
    }[variant];

    const inlineStyles = {
      width,
      height,
      ...style
    };

    return (
      <div
        ref={ref}
        className={`bg-gradient-to-r from-slate-800/40 via-slate-700/60 to-slate-800/40 skeleton-animate ${speedClass} ${variantClass} ${className || ''}`}
        style={inlineStyles}
        role="status"
        aria-label="Loading content..."
        {...props}
      />
    )
  }
)
Skeleton.displayName = "Skeleton"

/**
 * Pre-configured skeleton for text lines
 */
const SkeletonText = React.forwardRef<HTMLDivElement, Pick<SkeletonProps, "className" | "width">>(
  ({ className, width = "100%", ...props }, ref) => (
    <Skeleton
      ref={ref}
      height="1rem"
      width={width}
      className={className}
      {...props}
    />
  )
)
SkeletonText.displayName = "SkeletonText"

/**
 * Pre-configured skeleton for dashboard metric cards
 */
const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`glass-card p-4 space-y-3 ${className || ''}`}>
    {/* Header/Label skeleton */}
    <SkeletonText width="60%" />
    
    {/* Main value skeleton */}
    <Skeleton height="2rem" width="80%" />
    
    {/* Optional secondary text */}
    <SkeletonText width="40%" />
  </div>
)

/**
 * Skeleton for financial metric cards in dashboard
 */
const SkeletonFinancialCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`p-4 bg-slate-800/50 rounded-xl border border-white/5 space-y-3 ${className || ''}`}>
    {/* Label skeleton */}
    <div className="flex items-center gap-2">
      <Skeleton width="1rem" height="1rem" variant="circle" />
      <SkeletonText width="70%" />
    </div>
    
    {/* Value skeleton */}
    <Skeleton height="2rem" width="60%" />
  </div>
)

/**
 * Skeleton for activity log entries
 */
const SkeletonActivityLog: React.FC = () => (
  <div className="space-y-2">
    {[1, 2, 3].map((item) => (
      <div key={item} className="flex items-start gap-3 p-2 bg-slate-800/30 rounded-lg">
        <Skeleton width="4rem" height="1.5rem" variant="rounded" />
        <div className="flex-1 space-y-2">
          <SkeletonText width="80%" />
          <SkeletonText width="60%" />
        </div>
      </div>
    ))}
  </div>
)

export { 
  Skeleton, 
  SkeletonText, 
  SkeletonCard, 
  SkeletonFinancialCard, 
  SkeletonActivityLog 
}