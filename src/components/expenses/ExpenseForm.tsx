'use client'

import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useAddExpense, useUpdateExpense } from '@/hooks/useExpenses'
import { useToast } from '@/components/providers/ToastProvider'
import type { Category, Expense } from '@/types'
import { format } from 'date-fns'

const expenseSchema = z.object({
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  category_id: z.string().min(1, 'Please select a category'),
  date: z.string().min(1, 'Please select a date'),
  note: z.string().optional(),
})

type FormValues = z.infer<typeof expenseSchema>

interface ExpenseFormProps {
  open: boolean
  onClose: () => void
  userId: string
  categories: Category[]
  expense?: Expense | null
}

export function ExpenseForm({ open, onClose, userId, categories, expense }: ExpenseFormProps) {
  const isEditing = !!expense
  const addExpense = useAddExpense()
  const updateExpense = useUpdateExpense()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(expenseSchema) as Resolver<FormValues>,
    defaultValues: expense
      ? {
          amount: expense.amount,
          category_id: expense.category_id ?? '',
          date: expense.date,
          note: expense.note ?? '',
        }
      : {
          amount: undefined,
          category_id: '',
          date: format(new Date(), 'yyyy-MM-dd'),
          note: '',
        },
  })

  const onSubmit = async (data: FormValues) => {
    try {
      if (isEditing && expense) {
        await updateExpense.mutateAsync({ id: expense.id, userId, data })
        toast('Expense updated')
      } else {
        await addExpense.mutateAsync({ userId, data })
        toast('Expense added')
      }
      reset()
      onClose()
    } catch {
      toast('Something went wrong. Please try again.', 'error')
    }
  }

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: `${c.icon} ${c.name}`,
  }))

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? 'Edit Expense' : 'Add Expense'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="amount"
          label="Amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          error={errors.amount?.message}
          {...register('amount')}
        />

        <Select
          id="category_id"
          label="Category"
          options={categoryOptions}
          placeholder="Select a category"
          error={errors.category_id?.message}
          {...register('category_id')}
        />

        <Input
          id="date"
          label="Date"
          type="date"
          error={errors.date?.message}
          {...register('date')}
        />

        <Input
          id="note"
          label="Note (optional)"
          type="text"
          placeholder="What was this for?"
          error={errors.note?.message}
          {...register('note')}
        />

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" loading={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Add Expense'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
