'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Expense, ExpenseFormData } from '@/types'

export function useExpenses(userId: string | undefined) {
  return useQuery<Expense[]>({
    queryKey: ['expenses', userId],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('expenses')
        .select('*, category:categories(*)')
        .eq('user_id', userId!)
        .order('date', { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!userId,
  })
}

export function useAddExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: ExpenseFormData }) => {
      const supabase = createClient()
      const { data: expense, error } = await supabase
        .from('expenses')
        .insert({
          user_id: userId,
          amount: data.amount,
          category_id: data.category_id,
          date: data.date,
          note: data.note || null,
        })
        .select('*, category:categories(*)')
        .single()

      if (error) throw error
      return expense
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['expenses', variables.userId] })
    },
  })
}

export function useUpdateExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, userId, data }: { id: string; userId: string; data: ExpenseFormData }) => {
      const supabase = createClient()
      const { data: expense, error } = await supabase
        .from('expenses')
        .update({
          amount: data.amount,
          category_id: data.category_id,
          date: data.date,
          note: data.note || null,
        })
        .eq('id', id)
        .select('*, category:categories(*)')
        .single()

      if (error) throw error
      return expense
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['expenses', variables.userId] })
    },
  })
}

export function useDeleteExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId: string }) => {
      const supabase = createClient()
      const { error } = await supabase.from('expenses').delete().eq('id', id)
      if (error) throw error
      return { userId }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['expenses', variables.userId] })
    },
  })
}
