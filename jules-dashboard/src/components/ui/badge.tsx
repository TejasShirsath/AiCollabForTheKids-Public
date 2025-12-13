/**
 * GOSPEL UI - Badge Component
 * Part of the immutable foundation
 */
import * as React from "react"

const Badge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' }
>(({ className, variant = 'default', ...props }, ref) => {
  const variantClasses = {
    default: 'border-purple-400/30 bg-purple-500/20 text-purple-300',
    secondary: 'border-slate-400/30 bg-slate-500/20 text-slate-300',
    destructive: 'border-red-400/30 bg-red-500/20 text-red-300',
    outline: 'border-white/20 bg-transparent text-white',
    success: 'border-green-400/30 bg-green-500/20 text-green-300',
    warning: 'border-yellow-400/30 bg-yellow-500/20 text-yellow-300',
  }

  return (
    <div
      ref={ref}
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${variantClasses[variant]} ${className || ''}`}
      {...props}
    />
  )
})
Badge.displayName = "Badge"

export { Badge }
