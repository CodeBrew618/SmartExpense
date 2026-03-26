'use client'

import { useState } from 'react'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useUpdateProfile } from '@/hooks/useProfileUpdate'
import type { Profile } from '@/types'

const CURRENCIES = [
  { value: 'USD', label: 'USD — US Dollar ($)' },
  { value: 'EUR', label: 'EUR — Euro (€)' },
  { value: 'GBP', label: 'GBP — British Pound (£)' },
  { value: 'JPY', label: 'JPY — Japanese Yen (¥)' },
  { value: 'CNY', label: 'CNY — Chinese Yuan (¥)' },
  { value: 'HKD', label: 'HKD — Hong Kong Dollar (HK$)' },
  { value: 'SGD', label: 'SGD — Singapore Dollar (S$)' },
  { value: 'AUD', label: 'AUD — Australian Dollar (A$)' },
  { value: 'CAD', label: 'CAD — Canadian Dollar (C$)' },
]

interface PreferencesSectionProps {
  profile: Profile
}

export function PreferencesSection({ profile }: PreferencesSectionProps) {
  const [currency, setCurrency] = useState(profile.currency)
  const [budget, setBudget] = useState(
    profile.monthly_budget !== null ? String(profile.monthly_budget) : ''
  )
  const [currencySaved, setCurrencySaved] = useState(false)
  const [budgetSaved, setBudgetSaved] = useState(false)

  const { mutateAsync: updateProfile, isPending } = useUpdateProfile(profile.id)

  const saveCurrency = async (value: string) => {
    setCurrency(value)
    await updateProfile({ currency: value })
    setCurrencySaved(true)
    setTimeout(() => setCurrencySaved(false), 2000)
  }

  const saveBudget = async () => {
    const parsed = budget === '' ? null : parseFloat(budget)
    if (budget !== '' && (isNaN(parsed!) || parsed! <= 0)) return
    await updateProfile({ monthly_budget: parsed })
    setBudgetSaved(true)
    setTimeout(() => setBudgetSaved(false), 2000)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-base font-semibold text-gray-900">Preferences</h2>
        <p className="mt-0.5 text-sm text-gray-500">Control how the app behaves for you.</p>
      </div>

      {/* Currency */}
      <div className="space-y-3 max-w-sm">
        <div>
          <p className="text-sm font-semibold text-gray-800">Currency</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Changes the symbol shown on amounts — does not convert values.
          </p>
        </div>
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <Select
              id="currency"
              options={CURRENCIES}
              value={currency}
              onChange={(e) => saveCurrency(e.target.value)}
            />
          </div>
          {currencySaved && (
            <span className="pb-2.5 text-sm text-emerald-600 font-medium whitespace-nowrap">Saved ✓</span>
          )}
        </div>
      </div>

      {/* Monthly budget */}
      <div className="space-y-3 max-w-sm">
        <div>
          <p className="text-sm font-semibold text-gray-800">Monthly budget</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Set a spending target. A progress bar will appear on your dashboard.
          </p>
        </div>
        <Input
          id="budget"
          type="number"
          min="1"
          step="0.01"
          placeholder="e.g. 2000"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={saveBudget} loading={isPending}>
            Save budget
          </Button>
          {budget !== '' && (
            <Button
              variant="ghost"
              onClick={() => {
                setBudget('')
                updateProfile({ monthly_budget: null })
              }}
            >
              Remove
            </Button>
          )}
          {budgetSaved && (
            <span className="text-sm text-emerald-600 font-medium">Saved ✓</span>
          )}
        </div>
      </div>
    </div>
  )
}
