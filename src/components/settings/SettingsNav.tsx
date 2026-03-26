'use client'

import { User, Lock, SlidersHorizontal, Palette } from 'lucide-react'
import { cn } from '@/lib/utils'

export type SettingsSection = 'profile' | 'security' | 'preferences' | 'appearance'

const sections: { id: SettingsSection; label: string; icon: React.ElementType }[] = [
  { id: 'profile',     label: 'Profile',     icon: User },
  { id: 'security',   label: 'Security',    icon: Lock },
  { id: 'preferences', label: 'Preferences', icon: SlidersHorizontal },
  { id: 'appearance', label: 'Appearance',  icon: Palette },
]

interface SettingsNavProps {
  active: SettingsSection
  onSelect: (section: SettingsSection) => void
}

export function SettingsNav({ active, onSelect }: SettingsNavProps) {
  return (
    <nav className="flex flex-col gap-0.5">
      {sections.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onSelect(id)}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-left transition-colors',
            active === id
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
          )}
        >
          <Icon className="h-4 w-4 shrink-0" />
          {label}
        </button>
      ))}
    </nav>
  )
}
