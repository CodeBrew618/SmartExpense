'use client'

import { usePathname } from 'next/navigation'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/expenses': 'Expenses',
  '/analytics': 'Analytics',
}

export function TopBar() {
  const pathname = usePathname()
  const title = pageTitles[pathname] || 'Dashboard'

  return (
    <header className="flex h-14 items-center border-b border-gray-100 bg-white px-4 md:px-6">
      <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
    </header>
  )
}
