import Link from 'next/link'
import { BarChart2, Shield, Zap } from 'lucide-react'
import { WordmarkLogo } from '@/components/ui/WordmarkLogo'

const bullets = [
  { icon: BarChart2, text: 'Visualize spending with real-time charts' },
  { icon: Shield, text: 'Your data, always private and secure' },
  { icon: Zap, text: 'Set budgets and get alerts before you overspend' },
]

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Left brand panel — desktop only */}
      <div className="hidden lg:flex lg:w-1/2 bg-accent flex-col justify-center items-center p-12 overflow-hidden">
        <div className="max-w-sm w-full">
          <WordmarkLogo variant="white" size="lg" className="mb-8 block" />
          <h1 className="text-3xl font-semibold text-white mb-3 tracking-tight">
            Track smarter.<br />Spend wiser.
          </h1>
          <p className="text-white/70 mb-10 text-sm leading-relaxed">
            The personal finance tracker that gives you clarity on every dollar.
          </p>
          <ul className="space-y-5">
            {bullets.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-white/90 text-sm">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/20">
                  <Icon className="h-4 w-4" />
                </div>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 min-h-screen bg-white px-6 py-12">
        <div className="mx-auto w-full max-w-sm">
          {/* Logo — always shown above form */}
          <div className="mb-8">
            <WordmarkLogo size="md" />
          </div>
          {children}
        </div>
        <p className="mt-8 text-center text-xs text-gray-400">
          By continuing, you agree to our{' '}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-gray-600 transition-colors">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}
