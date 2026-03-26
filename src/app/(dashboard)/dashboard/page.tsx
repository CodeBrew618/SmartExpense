'use client'

import { useMemo } from 'react'
import { format, startOfMonth, endOfMonth, subMonths, parseISO } from 'date-fns'
import { Card } from '@/components/ui/Card'
import { useUser, useProfile } from '@/hooks/useProfile'
import { useExpenses } from '@/hooks/useExpenses'
import { useCategories } from '@/hooks/useCategories'
import { formatCurrency } from '@/lib/utils'
import { MonthlyBarChart } from '@/components/charts/MonthlyBarChart'
import { CategoryDonutChart } from '@/components/charts/CategoryDonutChart'
import { SpendingTrendLine } from '@/components/charts/SpendingTrendLine'

export default function DashboardPage() {
  const { user } = useUser()
  const { data: expenses, isLoading } = useExpenses(user?.id)
  const { data: categories } = useCategories(user?.id)
  const { data: profile } = useProfile(user?.id)

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
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[88px] animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-[300px] animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary cards */}
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

      {/* Budget progress */}
      {profile?.monthly_budget != null && stats && (
        <Card>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-medium text-gray-500">Monthly budget</p>
              <p className="mt-0.5 text-sm font-semibold text-gray-900">
                {formatCurrency(stats.thisMonthTotal, profile.currency)} of{' '}
                {formatCurrency(profile.monthly_budget, profile.currency)}
              </p>
            </div>
            <p className={`text-sm font-semibold ${
              stats.thisMonthTotal > profile.monthly_budget ? 'text-red-500' : 'text-gray-500'
            }`}>
              {stats.thisMonthTotal > profile.monthly_budget
                ? `Over by ${formatCurrency(stats.thisMonthTotal - profile.monthly_budget, profile.currency)}`
                : `${formatCurrency(profile.monthly_budget - stats.thisMonthTotal, profile.currency)} left`}
            </p>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full transition-all ${
                stats.thisMonthTotal > profile.monthly_budget ? 'bg-red-500' : 'bg-accent'
              }`}
              style={{
                width: `${Math.min((stats.thisMonthTotal / profile.monthly_budget) * 100, 100)}%`,
              }}
            />
          </div>
          <p className="mt-1.5 text-xs text-gray-400">
            {Math.min(Math.round((stats.thisMonthTotal / profile.monthly_budget) * 100), 100)}% used this month
          </p>
        </Card>
      )}

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Monthly Spending</h2>
            <p className="mt-0.5 text-xs text-gray-500">Last 6 months</p>
          </div>
          <MonthlyBarChart expenses={expenses ?? []} />
        </Card>

        <Card>
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Spending by Category</h2>
            <p className="mt-0.5 text-xs text-gray-500">{format(new Date(), 'MMMM yyyy')}</p>
          </div>
          <CategoryDonutChart expenses={expenses ?? []} />
        </Card>

        <Card className="lg:col-span-2">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Daily Spending Trend</h2>
            <p className="mt-0.5 text-xs text-gray-500">Last 30 days</p>
          </div>
          <SpendingTrendLine expenses={expenses ?? []} />
        </Card>
      </div>
    </div>
  )
}
