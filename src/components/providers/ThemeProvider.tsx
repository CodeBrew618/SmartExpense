'use client'

import { useEffect } from 'react'
import { useUser, useProfile } from '@/hooks/useProfile'

export function ThemeProvider() {
  const { user } = useUser()
  const { data: profile } = useProfile(user?.id)

  useEffect(() => {
    if (profile?.theme_color) {
      document.documentElement.setAttribute('data-theme', profile.theme_color)
    }
  }, [profile?.theme_color])

  return null
}
