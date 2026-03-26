import type { Metadata } from 'next'
import { LoginForm } from '@/components/auth/LoginForm'
import { AuthLayout } from '@/components/auth/AuthLayout'

export const metadata: Metadata = {
  title: 'Sign In — SmartXpense',
}

export default function LoginPage() {
  return (
    <AuthLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Sign in to your account
        </p>
      </div>
      <LoginForm />
    </AuthLayout>
  )
}
