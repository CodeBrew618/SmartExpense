'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Profile, ThemeColor } from '@/types'

type ProfileUpdateInput = Partial<
  Pick<Profile, 'full_name' | 'username' | 'avatar_url' | 'currency' | 'theme_color' | 'monthly_budget'>
>

export function useUpdateProfile(userId: string | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: ProfileUpdateInput) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('profiles')
        .update(input)
        .eq('id', userId!)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] })
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async ({
      email,
      currentPassword,
      newPassword,
    }: {
      email: string
      currentPassword: string
      newPassword: string
    }) => {
      const supabase = createClient()

      // Re-authenticate with current password first
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      })
      if (signInError) throw new Error('Current password is incorrect')

      // Update to new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })
      if (updateError) throw updateError
    },
  })
}

export function useUpdateTheme(userId: string | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (theme_color: ThemeColor) => {
      const supabase = createClient()
      const { error } = await supabase
        .from('profiles')
        .update({ theme_color })
        .eq('id', userId!)

      if (error) throw error
      return theme_color
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] })
    },
  })
}
