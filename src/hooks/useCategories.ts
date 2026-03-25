'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Category } from '@/types'

export const DEFAULT_CATEGORIES = [
  { name: 'Food & Dining', icon: '🍔', color: '#f97316' },
  { name: 'Transport', icon: '🚗', color: '#3b82f6' },
  { name: 'Housing', icon: '🏠', color: '#8b5cf6' },
  { name: 'Entertainment', icon: '🎬', color: '#ec4899' },
  { name: 'Health', icon: '💊', color: '#10b981' },
  { name: 'Shopping', icon: '🛍️', color: '#f59e0b' },
  { name: 'Other', icon: '📦', color: '#6b7280' },
]

export function useCategories(userId: string | undefined) {
  return useQuery<Category[]>({
    queryKey: ['categories', userId],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId!)
        .order('name')

      if (error) throw error

      // Auto-seed defaults if user has no categories
      if (data.length === 0) {
        const categories = DEFAULT_CATEGORIES.map((cat) => ({
          ...cat,
          user_id: userId!,
          is_default: true,
        }))
        const { data: seeded, error: seedError } = await supabase
          .from('categories')
          .insert(categories)
          .select('*')
          .order('name')

        if (seedError) throw seedError
        return seeded
      }

      return data
    },
    enabled: !!userId,
  })
}

export function useAddCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, name, icon, color }: { userId: string; name: string; icon: string; color: string }) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('categories')
        .insert({ user_id: userId, name, icon, color })
        .select('*')
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories', variables.userId] })
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId: string }) => {
      const supabase = createClient()
      const { error } = await supabase.from('categories').delete().eq('id', id)
      if (error) throw error
      return { userId }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories', variables.userId] })
    },
  })
}
