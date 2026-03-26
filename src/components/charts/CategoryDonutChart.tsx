'use client'

import { useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { startOfMonth, endOfMonth, parseISO } from 'date-fns'
import type { Expense } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface Props {
  expenses: Expense[]
}

export function CategoryDonutChart({ expenses }: Props) {
  const data = useMemo(() => {
    const now = new Date()
    const start = startOfMonth(now)
    const end = endOfMonth(now)

    const thisMonth = expenses.filter((e) => {
      const d = parseISO(e.date)
      return d >= start && d <= end
    })

    const totals = new Map<string, { name: string; icon: string; color: string; total: number }>()
    for (const e of thisMonth) {
      if (e.category) {
        const existing = totals.get(e.category.id)
        if (existing) {
          existing.total += e.amount
        } else {
          totals.set(e.category.id, {
            name: e.category.name,
            icon: e.category.icon,
            color: e.category.color,
            total: e.amount,
          })
        }
      }
    }

    return Array.from(totals.values()).sort((a, b) => b.total - a.total)
  }, [expenses])

  if (data.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center text-sm text-gray-400">
        No expenses this month
      </div>
    )
  }

  const totalAmount = data.reduce((s, d) => s + d.total, 0)

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <div className="shrink-0">
        <ResponsiveContainer width={200} height={200}>
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={90}
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: unknown) => [formatCurrency(Number(value)), '']}
              contentStyle={{
                borderRadius: 8,
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                fontSize: 13,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 min-w-0">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="truncate text-sm text-gray-700">
                {entry.icon} {entry.name}
              </span>
            </div>
            <div className="shrink-0 text-right">
              <span className="text-sm font-medium text-gray-900">{formatCurrency(entry.total)}</span>
              <span className="ml-1.5 text-xs text-gray-400">
                {((entry.total / totalAmount) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
