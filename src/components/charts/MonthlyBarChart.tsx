'use client'

import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format, startOfMonth, subMonths } from 'date-fns'
import type { Expense } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface Props {
  expenses: Expense[]
}

export function MonthlyBarChart({ expenses }: Props) {
  const data = useMemo(() => {
    const now = new Date()
    return Array.from({ length: 6 }, (_, i) => {
      const monthDate = subMonths(startOfMonth(now), 5 - i)
      const monthKey = format(monthDate, 'yyyy-MM')
      const total = expenses
        .filter((e) => e.date.startsWith(monthKey))
        .reduce((sum, e) => sum + e.amount, 0)
      return { month: format(monthDate, 'MMM'), total }
    })
  }, [expenses])

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${v}`}
          width={52}
        />
        <Tooltip
          formatter={(value: unknown) => [formatCurrency(Number(value)), 'Total']}
          contentStyle={{
            borderRadius: 8,
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            fontSize: 13,
          }}
          cursor={{ fill: '#f9fafb' }}
        />
        <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
