'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useUpdateTheme } from '@/hooks/useProfileUpdate'
import type { Profile, ThemeColor } from '@/types'

const THEMES: { value: ThemeColor; label: string; bg: string; ring: string }[] = [
  { value: 'indigo',  label: 'Indigo',  bg: 'bg-indigo-500',  ring: 'ring-indigo-500' },
  { value: 'violet',  label: 'Violet',  bg: 'bg-violet-500',  ring: 'ring-violet-500' },
  { value: 'rose',    label: 'Rose',    bg: 'bg-rose-500',    ring: 'ring-rose-500' },
  { value: 'amber',   label: 'Amber',   bg: 'bg-amber-500',   ring: 'ring-amber-500' },
  { value: 'emerald', label: 'Emerald', bg: 'bg-emerald-500', ring: 'ring-emerald-500' },
]

interface AppearanceSectionProps {
  profile: Profile
}

export function AppearanceSection({ profile }: AppearanceSectionProps) {
  const [selected, setSelected] = useState<ThemeColor>(profile.theme_color ?? 'indigo')
  const { mutateAsync: updateTheme, isPending } = useUpdateTheme(profile.id)

  const handleSelect = async (theme: ThemeColor) => {
    setSelected(theme)
    document.documentElement.setAttribute('data-theme', theme)
    await updateTheme(theme)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-gray-900">Appearance</h2>
        <p className="mt-0.5 text-sm text-gray-500">
          Pick an accent color — it applies across the entire app.
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700">Accent color</p>
        <div className="flex gap-3">
          {THEMES.map((theme) => (
            <button
              key={theme.value}
              onClick={() => handleSelect(theme.value)}
              disabled={isPending}
              title={theme.label}
              className={cn(
                'h-10 w-10 rounded-full transition-transform hover:scale-110 focus:outline-none',
                theme.bg,
                selected === theme.value
                  ? `ring-2 ring-offset-2 ${theme.ring} scale-110`
                  : ''
              )}
            />
          ))}
        </div>
        <p className="text-xs text-gray-400 capitalize">
          {THEMES.find((t) => t.value === selected)?.label} selected
        </p>
      </div>
    </div>
  )
}
