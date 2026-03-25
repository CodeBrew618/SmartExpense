'use client'

import { useMemo } from 'react'
import { Card } from '@/components/ui/Card'
import { useUser } from '@/hooks/useProfile'
import { useExpenses } from '@/hooks/useExpenses'
import { useCategories } from '@/hooks/useCategories'
import { formatCurrency } from '@/lib/utils'
import { startOfMonth, endOfMonth, subMonths, parseISO } from 'date-fns'

export default function DashboardPage() {
  const { user } = useUser()
  const { data: expenses, isLoading } = useExpenses(user?.id)
  const { data: categories } = useCategories(user?.id)

  const stats = useMemo(() => {
    if (!expenses) return null

    const now = new Date()
    const thisMonthStart = startOfMonth(now)
    const thisMonthEnd = endOfMonth(now)
    const lastMonthStart = startOfMonth(subMonths(now, 1))
    const lastMonthEnd = endOfMonth(subMonths(now, 1))

    const thisMonthExpenses = expenses.filter((e) => {
      const d = parseISO(e.date)
      return d >= thisMonthStart && d <= thisMonthEnd
    })

    const lastMonthExpenses = expenses.filter((e) => {
      const d = parseISO(e.date)
      return d >= lastMonthStart && d <= lastMonthEnd
    })

    const thisMonthTotal = thisMonthExpenses.reduce((s, e) => s + e.amount, 0)
    const lastMonthTotal = lastMonthExpenses.reduce((s, e) => s + e.amount, 0)

    const percentChange =
      lastMonthTotal > 0
        ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
        : null

    // Top category this month
    const categoryTotals = new Map<string, number>()
    for (const e of thisMonthExpenses) {
      if (e.category_id) {
        categoryTotals.set(e.category_id, (categoryTotals.get(e.category_id) ?? 0) + e.amount)
      }
    }
    let topCategoryId: string | null = null
    let topCategoryAmount = 0
    for (const [catId, total] of categoryTotals) {
      if (total > topCategoryAmount) {
        topCategoryId = catId
        topCategoryAmount = total
      }
    }
    const topCategory = categories?.find((c) => c.id === topCategoryId)

    return {
      thisMonthTotal,
      percentChange,
      topCategory,
      expenseCount: thisMonthExpenses.length,
    }
  }, [expenses, categories])

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-[88px] animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-xs font-medium text-gray-500">Total this month</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">
            {formatCurrency(stats?.thisMonthTotal ?? 0)}
          </p>
        </Card>
        <Card>
          <p className="text-xs font-medium text-gray-500">vs. last month</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">
            {stats?.percentChange !== null && stats?.percentChange !== undefined ? (
              <span className={stats.percentChange > 0 ? 'text-red-500' : 'text-emerald-500'}>
                {stats.percentChange > 0 ? '+' : ''}
                {stats.percentChange.toFixed(1)}%
              </span>
            ) : (
              '—'
            )}
          </p>
        </Card>
        <Card>
          <p className="text-xs font-medium text-gray-500">Top category</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">
            {stats?.topCategory ? `${stats.topCategory.icon} ${stats.topCategory.name}` : '—'}
          </p>
        </Card>
        <Card>
          <p className="text-xs font-medium text-gray-500">Expenses</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">
            {stats?.expenseCount ?? 0}
          </p>
        </Card>
      </div>
    </div>
  )
}
