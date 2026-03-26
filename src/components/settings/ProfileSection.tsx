'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useUpdateProfile } from '@/hooks/useProfileUpdate'
import type { Profile } from '@/types'

const AVATAR_OPTIONS = [
  '😀','😎','🐱','🐶','🦊','🐻','🐼','🐨','🐯','🦁',
  '🐸','🐧','🦋','🌸','🌟','⚡','🔥','💎','🎯','🎨',
  '🎵','🚀','🌈','🍀','🎃','👾','🤖','💫','🌙','☀️',
]

const schema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  username: z
    .string()
    .min(2, 'Username must be at least 2 characters')
    .max(20, 'Username must be 20 characters or less')
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores')
    .or(z.literal('')),
})

type FormData = z.infer<typeof schema>

interface ProfileSectionProps {
  profile: Profile
  email: string
}

export function ProfileSection({ profile, email }: ProfileSectionProps) {
  const [avatar, setAvatar] = useState(profile.avatar_url ?? '')
  const [saved, setSaved] = useState(false)
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile(profile.id)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: profile.full_name ?? '',
      username: profile.username ?? '',
    },
  })

  const onSubmit = async (data: FormData) => {
    await updateProfile({
      full_name: data.full_name,
      username: data.username || null,
      avatar_url: avatar || null,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-gray-900">Profile</h2>
        <p className="mt-0.5 text-sm text-gray-500">Your personal details and avatar.</p>
      </div>

      {/* Avatar picker */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Avatar</p>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-3xl">
            {avatar || '👤'}
          </div>
          <div className="grid grid-cols-10 gap-1">
            {AVATAR_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setAvatar(emoji)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-lg transition-colors hover:bg-gray-100 ${
                  avatar === emoji ? 'bg-accent-light ring-1 ring-accent' : ''
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="full_name"
          label="Display name"
          placeholder="Your full name"
          error={errors.full_name?.message}
          {...register('full_name')}
        />

        <div className="space-y-1">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <div className="flex rounded-lg border border-gray-200 bg-white focus-within:border-accent focus-within:ring-2 focus-within:ring-accent transition-colors overflow-hidden">
            <span className="flex items-center px-3 text-sm text-gray-400 border-r border-gray-200 bg-gray-50">
              @
            </span>
            <input
              id="username"
              placeholder="yourhandle"
              className="flex-1 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none bg-white"
              {...register('username')}
            />
          </div>
          {errors.username && (
            <p className="text-xs text-red-500">{errors.username.message}</p>
          )}
        </div>

        {/* Read-only fields */}
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-700">Email</p>
          <p className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-500">
            {email}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-700">Member since</p>
          <p className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-500">
            {format(new Date(profile.created_at), 'MMMM yyyy')}
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" loading={isPending}>
            Save changes
          </Button>
          {saved && (
            <span className="text-sm text-emerald-600 font-medium">Saved ✓</span>
          )}
        </div>
      </form>
    </div>
  )
}
