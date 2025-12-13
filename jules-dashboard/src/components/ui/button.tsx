/**
 * GOSPEL UI - Button Component
 * Part of the immutable foundation
 */
import * as React from "react"

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link',
    size?: 'default' | 'sm' | 'lg' | 'icon'
  }
>(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  const variantClasses = {
    default: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600',
    destructive: 'bg-red-500 text-white hover:bg-red-600',
    outline: 'border border-white/20 bg-transparent text-white hover:bg-white/10',
    secondary: 'bg-slate-700 text-white hover:bg-slate-600',
    ghost: 'bg-transparent text-white hover:bg-white/10',
    link: 'text-purple-400 underline-offset-4 hover:underline bg-transparent',
  }

  const sizeClasses = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3 text-sm',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  }

  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className || ''}`}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
