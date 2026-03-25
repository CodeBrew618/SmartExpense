import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-white p-4 shadow-sm border border-gray-100',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
