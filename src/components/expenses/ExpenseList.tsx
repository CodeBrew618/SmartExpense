'use client'

import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { ExpenseItem } from './ExpenseItem'
import { ExpenseForm } from './ExpenseForm'
import { DeleteConfirm } from './DeleteConfirm'
import { useExpenses } from '@/hooks/useExpenses'
import { useCategories } from '@/hooks/useCategories'
import { useUser } from '@/hooks/useProfile'
import { format, startOfMonth, endOfMonth, parseISO } from 'date-fns'
import type { Expense } from '@/types'

export function ExpenseList() {
  const { user, loading: userLoading } = useUser()
  const { data: expenses, isLoading: expensesLoading } = useExpenses(user?.id)
  const { data: categories } = useCategories(user?.id)

  const [showForm, setShowForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null)

  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'))
  const [selectedCategory, setSelectedCategory] = useState('')

  const monthOptions = useMemo(() => {
    const months: { value: string; label: string }[] = []
    const now = new Date()
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push({
        value: format(d, 'yyyy-MM'),
        label: format(d, 'MMMM yyyy'),
      })
    }
    return months
  }, [])

  const categoryOptions = useMemo(() => {
    return [
      { value: '', label: 'All Categories' },
      ...(categories?.map((c) => ({ value: c.id, label: `${c.icon} ${c.name}` })) ?? []),
    ]
  }, [categories])

  const filtered = useMemo(() => {
    if (!expenses) return []
    const monthStart = startOfMonth(parseISO(`${selectedMonth}-01`))
    const monthEnd = endOfMonth(monthStart)

    return expenses.filter((e) => {
      const expDate = parseISO(e.date)
      const inMonth = expDate >= monthStart && expDate <= monthEnd
      const inCategory = !selectedCategory || e.category_id === selectedCategory
      return inMonth && inCategory
    })
  }, [expenses, selectedMonth, selectedCategory])

  const total = useMemo(
    () => filtered.reduce((sum, e) => sum + e.amount, 0),
    [filtered]
  )

  if (userLoading || expensesLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-[72px] animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Select
            options={monthOptions}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-44"
          />
          <Select
            options={categoryOptions}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-44"
          />
        </div>
        <Button onClick={() => setShowForm(true)} size="sm">
          <Plus className="mr-1.5 h-4 w-4" />
          Add Expense
        </Button>
      </div>

      {/* Summary */}
      <div className="text-sm text-gray-500">
        {filtered.length} expense{filtered.length !== 1 ? 's' : ''} &middot;{' '}
        <span className="font-medium text-gray-900">
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total)}
        </span>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm text-gray-500">No expenses for this period.</p>
          <p className="mt-1 text-xs text-gray-400">Add your first expense to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((expense) => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              onEdit={(e) => setEditingExpense(e)}
              onDelete={(e) => setDeletingExpense(e)}
            />
          ))}
        </div>
      )}

      {/* Add Modal */}
      {user && categories && showForm && (
        <ExpenseForm
          open={showForm}
          onClose={() => setShowForm(false)}
          userId={user.id}
          categories={categories}
        />
      )}

      {/* Edit Modal */}
      {user && categories && editingExpense && (
        <ExpenseForm
          key={editingExpense.id}
          open={!!editingExpense}
          onClose={() => setEditingExpense(null)}
          userId={user.id}
          categories={categories}
          expense={editingExpense}
        />
      )}

      {/* Delete Confirm */}
      {user && (
        <DeleteConfirm
          open={!!deletingExpense}
          onClose={() => setDeletingExpense(null)}
          expense={deletingExpense}
          userId={user.id}
        />
      )}
    </div>
  )
}
