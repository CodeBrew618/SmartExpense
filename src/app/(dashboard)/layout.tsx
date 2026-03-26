import type { Metadata } from 'next'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { MobileNav } from '@/components/layout/MobileNav'
import { ThemeProvider } from '@/components/providers/ThemeProvider'

export const metadata: Metadata = {
  title: 'SmartXpense — Finance Tracker',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <ThemeProvider />
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 pb-20 md:p-6 md:pb-6">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
