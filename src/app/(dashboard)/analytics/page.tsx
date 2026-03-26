'use client'

import { format } from 'date-fns'
import { useUser } from '@/hooks/useProfile'
import { useExpenses } from '@/hooks/useExpenses'
import { Card } from '@/components/ui/Card'
import { MonthlyBarChart } from '@/components/charts/MonthlyBarChart'
import { CategoryDonutChart } from '@/components/charts/CategoryDonutChart'
import { SpendingTrendLine } from '@/components/charts/SpendingTrendLine'

export default function AnalyticsPage() {
  const { user } = useUser()
  const { data: expenses, isLoading } = useExpenses(user?.id)

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-[320px] animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
    )
  }

  if (!expenses || expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm text-gray-500">No data to display yet.</p>
        <p className="mt-1 text-xs text-gray-400">Start adding expenses to see your analytics.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Monthly Spending</h2>
          <p className="mt-0.5 text-xs text-gray-500">Last 6 months</p>
        </div>
        <MonthlyBarChart expenses={expenses} />
      </Card>

      <Card>
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Spending by Category</h2>
          <p className="mt-0.5 text-xs text-gray-500">{format(new Date(), 'MMMM yyyy')}</p>
        </div>
        <CategoryDonutChart expenses={expenses} />
      </Card>

      <Card>
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Daily Spending Trend</h2>
          <p className="mt-0.5 text-xs text-gray-500">Last 30 days</p>
        </div>
        <SpendingTrendLine expenses={expenses} />
      </Card>
    </div>
  )
}
