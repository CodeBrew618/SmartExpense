'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useChangePassword } from '@/hooks/useProfileUpdate'

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Required'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Required'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

interface SecuritySectionProps {
  email: string
}

export function SecuritySection({ email }: SecuritySectionProps) {
  const [saved, setSaved] = useState(false)
  const { mutateAsync: changePassword, isPending, error } = useChangePassword()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    await changePassword({
      email,
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    })
    reset()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-gray-900">Security</h2>
        <p className="mt-0.5 text-sm text-gray-500">Update your password to keep your account safe.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm">
        {error && (
          <div className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600">
            {error instanceof Error ? error.message : 'Something went wrong'}
          </div>
        )}

        <Input
          id="currentPassword"
          type="password"
          label="Current password"
          error={errors.currentPassword?.message}
          {...register('currentPassword')}
        />
        <Input
          id="newPassword"
          type="password"
          label="New password"
          error={errors.newPassword?.message}
          {...register('newPassword')}
        />
        <Input
          id="confirmPassword"
          type="password"
          label="Confirm new password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" loading={isPending}>
            Update password
          </Button>
          {saved && (
            <span className="text-sm text-emerald-600 font-medium">Password updated ✓</span>
          )}
        </div>
      </form>
    </div>
  )
}
