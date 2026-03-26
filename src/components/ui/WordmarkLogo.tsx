import { cn } from '@/lib/utils'

interface WordmarkLogoProps {
  className?: string
  variant?: 'default' | 'white'
  size?: 'sm' | 'md' | 'lg'
}

export function WordmarkLogo({
  className,
  variant = 'default',
  size = 'md',
}: WordmarkLogoProps) {
  const sizeClass = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-3xl',
  }[size]

  if (variant === 'white') {
    return (
      <span className={cn('font-bold tracking-tight text-white', sizeClass, className)}>
        Smart<span className="text-white/75">Xpense</span>
      </span>
    )
  }

  return (
    <span
      className={cn('font-bold tracking-tight', sizeClass, className)}
      style={{
        background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      SmartXpense
    </span>
  )
}
