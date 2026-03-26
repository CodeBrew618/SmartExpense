'use client'

import { useEffect, useState } from 'react'
import { useUser, useProfile } from '@/hooks/useProfile'
import { createClient } from '@/lib/supabase/client'
import { SettingsNav, type SettingsSection } from '@/components/settings/SettingsNav'
import { ProfileSection } from '@/components/settings/ProfileSection'
import { SecuritySection } from '@/components/settings/SecuritySection'
import { PreferencesSection } from '@/components/settings/PreferencesSection'
import { AppearanceSection } from '@/components/settings/AppearanceSection'

export default function SettingsPage() {
  const { user } = useUser()
  const { data: profile, isLoading } = useProfile(user?.id)
  const [section, setSection] = useState<SettingsSection>('profile')
  const [email, setEmail] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setEmail(data.user.email)
    })
  }, [])

  // Apply saved theme on mount
  useEffect(() => {
    if (profile?.theme_color) {
      document.documentElement.setAttribute('data-theme', profile.theme_color)
    }
  }, [profile?.theme_color])

  if (isLoading || !profile) {
    return (
      <div className="space-y-4 max-w-3xl">
        <div className="h-6 w-32 animate-pulse rounded-lg bg-gray-100" />
        <div className="h-64 animate-pulse rounded-xl bg-gray-100" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Mobile: section tabs */}
      <div className="mb-6 flex gap-1 overflow-x-auto md:hidden">
        {(['profile', 'security', 'preferences', 'appearance'] as SettingsSection[]).map((s) => (
          <button
            key={s}
            onClick={() => setSection(s)}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
              section === s
                ? 'bg-accent text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Desktop: two-column */}
      <div className="flex gap-8">
        <aside className="hidden w-44 shrink-0 md:block">
          <SettingsNav active={section} onSelect={setSection} />
        </aside>

        <div className="min-w-0 flex-1 rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          {section === 'profile' && (
            <ProfileSection profile={profile} email={email} />
          )}
          {section === 'security' && (
            <SecuritySection email={email} />
          )}
          {section === 'preferences' && (
            <PreferencesSection profile={profile} />
          )}
          {section === 'appearance' && (
            <AppearanceSection profile={profile} />
          )}
        </div>
      </div>
    </div>
  )
}
