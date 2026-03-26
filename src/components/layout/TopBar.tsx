'use client'

import { usePathname } from 'next/navigation'
import { useUser, useProfile } from '@/hooks/useProfile'
import { WordmarkLogo } from '@/components/ui/WordmarkLogo'

const pageTitles: Record<string, string> = {
  '/expenses':  'Expenses',
  '/analytics': 'Analytics',
  '/settings':  'Settings',
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export function TopBar() {
  const pathname = usePathname()
  const { user } = useUser()
  const { data: profile } = useProfile(user?.id)

  const isDashboard = pathname === '/dashboard'

  let title: React.ReactNode

  if (isDashboard && profile) {
    const firstName = profile.full_name?.split(' ')[0] ?? 'there'
    const avatar = profile.avatar_url ?? ''
    title = (
      <span>
        {getGreeting()}, {firstName}{avatar && <span className="ml-1">{avatar}</span>}
      </span>
    )
  } else {
    title = pageTitles[pathname] ?? 'Dashboard'
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-100 bg-white px-4 md:px-6">
      {/* Logo — mobile only (sidebar carries it on desktop) */}
      <WordmarkLogo size="sm" className="md:hidden shrink-0" />
      <h1 className="text-base font-semibold text-gray-900 truncate md:text-lg">{title}</h1>
    </header>
  )
}
