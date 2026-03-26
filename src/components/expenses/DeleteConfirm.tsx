'use client'

import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useDeleteExpense } from '@/hooks/useExpenses'
import { useToast } from '@/components/providers/ToastProvider'
import { formatCurrency } from '@/lib/utils'
import type { Expense } from '@/types'

interface DeleteConfirmProps {
  open: boolean
  onClose: () => void
  expense: Expense | null
  userId: string
}

export function DeleteConfirm({ open, onClose, expense, userId }: DeleteConfirmProps) {
  const deleteExpense = useDeleteExpense()
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!expense) return
    try {
      await deleteExpense.mutateAsync({ id: expense.id, userId })
      toast('Expense deleted')
      onClose()
    } catch {
      toast('Failed to delete expense. Please try again.', 'error')
    }
  }

  if (!expense) return null

  return (
    <Modal open={open} onClose={onClose} title="Delete Expense">
      <p className="text-sm text-gray-600">
        Are you sure you want to delete this expense of{' '}
        <span className="font-semibold text-gray-900">
          {formatCurrency(expense.amount, expense.currency)}
        </span>
        ? This action cannot be undone.
      </p>
      <div className="mt-6 flex gap-3">
        <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="button"
          variant="danger"
          className="flex-1"
          loading={deleteExpense.isPending}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </div>
    </Modal>
  )
}
