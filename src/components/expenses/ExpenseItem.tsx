'use client'

import { Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Expense } from '@/types'

interface ExpenseItemProps {
  expense: Expense
  onEdit: (expense: Expense) => void
  onDelete: (expense: Expense) => void
}

export function ExpenseItem({ expense, onEdit, onDelete }: ExpenseItemProps) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm border border-gray-100 transition-colors hover:border-gray-200">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg"
          style={{
            backgroundColor: expense.category ? `${expense.category.color}15` : '#f3f4f6',
          }}
        >
          {expense.category?.icon ?? '📦'}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {expense.note || expense.category?.name || 'Expense'}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-gray-500">{formatDate(expense.date)}</span>
            {expense.category && (
              <Badge color={expense.category.color}>{expense.category.name}</Badge>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 ml-4">
        <span className="text-sm font-semibold text-gray-900">
          {formatCurrency(expense.amount, expense.currency)}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(expense)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(expense)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
