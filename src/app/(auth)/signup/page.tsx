import type { Metadata } from 'next'
import { SignupForm } from '@/components/auth/SignupForm'
import { AuthLayout } from '@/components/auth/AuthLayout'

export const metadata: Metadata = {
  title: 'Create Account — SmartXpense',
}

export default function SignupPage() {
  return (
    <AuthLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Start tracking your expenses
        </p>
      </div>
      <SignupForm />
    </AuthLayout>
  )
}
