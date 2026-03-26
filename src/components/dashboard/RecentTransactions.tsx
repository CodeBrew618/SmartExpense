import Link from 'next/link'
import { parseISO, format } from 'date-fns'
import { formatCurrency } from '@/lib/utils'
import type { Expense } from '@/types'

interface RecentTransactionsProps {
  expenses: Expense[]
  currency: string
}

export function RecentTransactions({ expenses, currency }: RecentTransactionsProps) {
  const recent = [...expenses]
    .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime())
    .slice(0, 5)

  if (recent.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <p className="text-sm text-gray-400">No expenses yet</p>
        <Link
          href="/expenses"
          className="mt-2 text-xs font-medium text-accent-dark hover:underline"
        >
          Add your first one →
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <ul className="divide-y divide-gray-50">
        {recent.map((expense) => (
          <li key={expense.id} className="flex items-center gap-3 py-2.5">
            {/* Category emoji badge */}
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm"
              style={{
                backgroundColor: expense.category?.color
                  ? `${expense.category.color}20`
                  : '#f3f4f6',
              }}
            >
              {expense.category?.icon ?? '📦'}
            </div>

            {/* Name + note */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">
                {expense.category?.name ?? 'Uncategorized'}
              </p>
              {expense.note && (
                <p className="truncate text-xs text-gray-400">{expense.note}</p>
              )}
            </div>

            {/* Amount + date */}
            <div className="shrink-0 text-right">
              <p className="text-sm font-semibold text-gray-900">
                {formatCurrency(expense.amount, expense.currency ?? currency)}
              </p>
              <p className="text-xs text-gray-400">
                {format(parseISO(expense.date), 'MMM d')}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <Link
        href="/expenses"
        className="mt-3 text-xs font-medium text-accent-dark hover:underline"
      >
        View all expenses →
      </Link>
    </div>
  )
}
