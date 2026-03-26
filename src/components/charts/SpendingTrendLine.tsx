'use client'

import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format, subDays, eachDayOfInterval } from 'date-fns'
import type { Expense } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface Props {
  expenses: Expense[]
}

export function SpendingTrendLine({ expenses }: Props) {
  const data = useMemo(() => {
    const now = new Date()
    const start = subDays(now, 29)
    const days = eachDayOfInterval({ start, end: now })

    return days.map((day) => {
      const dayKey = format(day, 'yyyy-MM-dd')
      const total = expenses
        .filter((e) => e.date === dayKey)
        .reduce((sum, e) => sum + e.amount, 0)
      return { day: format(day, 'MMM d'), total }
    })
  }, [expenses])

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
        <XAxis
          dataKey="day"
          tick={{ fontSize: 11, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
          interval={6}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${v}`}
          width={52}
        />
        <Tooltip
          formatter={(value: unknown) => [formatCurrency(Number(value)), 'Spent']}
          contentStyle={{
            borderRadius: 8,
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            fontSize: 13,
          }}
        />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#6366f1"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
