import type { Metadata } from 'next'
import Link from 'next/link'
import { WordmarkLogo } from '@/components/ui/WordmarkLogo'

export const metadata: Metadata = {
  title: 'Privacy Policy — SmartXpense',
  description: 'How SmartXpense collects, uses, and protects your personal data.',
}

const LAST_UPDATED = 'March 26, 2026'
const CONTACT_EMAIL = 'privacy@smartxpense.com' // TODO: replace with your real email

const sections = [
  {
    id: 'overview',
    title: '1. Overview',
    content: (
      <>
        <p>
          SmartXpense (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is a personal finance tracking app built and operated as an independent project. This Privacy Policy explains what data we collect when you use SmartXpense, how we use it, who can access it, and what rights you have over it.
        </p>
        <p className="mt-3">
          We believe in plain language over legal boilerplate. If something is unclear, email us.
        </p>
      </>
    ),
  },
  {
    id: 'data-collected',
    title: '2. What Data We Collect',
    content: (
      <>
        <p className="mb-3">We only collect data you explicitly provide:</p>
        <div className="overflow-hidden rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left font-medium text-gray-600">Data</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Why we collect it</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                ['Email address', 'Account creation, sign-in, and account recovery'],
                ['Full name & username', 'Displayed in your profile'],
                ['Profile avatar', 'Optional. Displayed in your profile'],
                ['Expense records (amount, date, category, note)', 'Core app function — tracking your spending'],
                ['Currency & theme preferences', 'Personalizing your experience'],
                ['Monthly budget (optional)', 'Showing budget progress on your dashboard'],
              ].map(([data, reason]) => (
                <tr key={data} className="bg-white">
                  <td className="px-4 py-3 font-medium text-gray-900">{data}</td>
                  <td className="px-4 py-3 text-gray-500">{reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          We do not collect payment information, location data, device identifiers, or any behavioral tracking data. We do not run analytics scripts (e.g. Google Analytics) on this app.
        </p>
      </>
    ),
  },
  {
    id: 'data-access',
    title: '3. Who Can Access Your Data',
    content: (
      <>
        <p className="mb-4">
          This is the most important section. We believe in being direct about it.
        </p>
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-100 bg-white p-4">
            <p className="font-medium text-gray-900 mb-1">You</p>
            <p className="text-sm text-gray-500">
              You have full access to your own data at all times. You can view, edit, export (CSV), and permanently delete it from within the app.
            </p>
          </div>
          <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
            <p className="font-medium text-gray-900 mb-1">The app operator (us)</p>
            <p className="text-sm text-gray-600">
              As the operator of this app, we have administrative access to the database via the Supabase dashboard. This is technically unavoidable for any hosted service — the infrastructure owner always has access at the infrastructure level.
            </p>
            <p className="mt-2 text-sm text-gray-600">
              <strong>Our commitment:</strong> We will not access, read, or use your individual expense data except in the specific case where you have reported a bug and explicitly asked us to investigate. We will tell you if we do. We do not browse user data for any other reason.
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-4">
            <p className="font-medium text-gray-900 mb-1">Supabase (our infrastructure provider)</p>
            <p className="text-sm text-gray-500">
              Your data is stored on servers managed by Supabase, Inc. Supabase is our data processor — they store and serve the data on our behalf but do not use it for any other purpose. Supabase encrypts data at rest (AES-256) and in transit (TLS). See{' '}
              <a
                href="https://supabase.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Supabase&apos;s Privacy Policy
              </a>
              .
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-4">
            <p className="font-medium text-gray-900 mb-1">No one else</p>
            <p className="text-sm text-gray-500">
              We do not sell, share, rent, or trade your data with any third parties. We do not use your data for advertising. We do not share it with data brokers.
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'security',
    title: '4. How We Protect Your Data',
    content: (
      <ul className="space-y-2 text-sm text-gray-600">
        {[
          ['Row Level Security (RLS)', 'Every database query is scoped to your user ID. No user can read another user\'s data, ever.'],
          ['TLS encryption in transit', 'All communication between your browser and our servers is encrypted.'],
          ['Encryption at rest', 'The database is encrypted at the storage layer by Supabase.'],
          ['No plaintext passwords', 'Passwords are hashed with bcrypt by Supabase Auth. We never store or see your password.'],
          ['Minimal permissions', 'The app\'s database keys only have the permissions required to serve the app — no admin-level keys run in your browser.'],
        ].map(([label, detail]) => (
          <li key={label} className="flex gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 text-xs">✓</span>
            <span><strong className="text-gray-900">{label}:</strong> {detail}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: 'data-retention',
    title: '5. Data Retention',
    content: (
      <p>
        We retain your data for as long as your account exists. When you delete your account, all associated data — expenses, categories, profile, and authentication credentials — is permanently deleted from our database. This deletion is irreversible. We do not keep backups of deleted accounts beyond Supabase&apos;s standard infrastructure backup window (up to 7 days), after which your data is unrecoverable.
      </p>
    ),
  },
  {
    id: 'your-rights',
    title: '6. Your Rights',
    content: (
      <>
        <p className="mb-3">You have the following rights over your data at any time:</p>
        <ul className="space-y-2 text-sm text-gray-600">
          {[
            ['Access', 'View all your data directly in the app.'],
            ['Correction', 'Edit any expense, category, or profile field.'],
            ['Export', 'Download all your expenses as a CSV file from the Expenses page.'],
            ['Deletion', 'Delete your account and all associated data from Settings → Security → Delete Account. This is immediate and permanent.'],
            ['Portability', 'The CSV export gives you a copy of your data in a standard, machine-readable format.'],
          ].map(([right, detail]) => (
            <li key={right} className="flex gap-3">
              <span className="shrink-0 font-medium text-gray-900 w-20">{right}</span>
              <span>{detail}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-gray-500">
          If you are located in the European Union, you may also have rights under the GDPR including the right to object to processing and the right to lodge a complaint with your local supervisory authority.
        </p>
      </>
    ),
  },
  {
    id: 'cookies',
    title: '7. Cookies & Local Storage',
    content: (
      <p>
        SmartXpense uses a single session cookie managed by Supabase Auth to keep you signed in. We do not use advertising cookies, tracking pixels, or third-party analytics cookies. No data is sold to or shared with ad networks.
      </p>
    ),
  },
  {
    id: 'changes',
    title: '8. Changes to This Policy',
    content: (
      <p>
        If we make material changes to this policy — such as sharing data with new third parties or changing how we store it — we will notify you by email before the change takes effect. Minor clarifications may be made without notice. The &quot;Last updated&quot; date at the top of this page always reflects the current version.
      </p>
    ),
  },
  {
    id: 'contact',
    title: '9. Contact',
    content: (
      <p>
        Questions, concerns, or data requests:{' '}
        <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-indigo-500 hover:text-indigo-600 underline underline-offset-2">
          {CONTACT_EMAIL}
        </a>
        . We aim to respond within 5 business days.
      </p>
    ),
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Minimal nav */}
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
          <Link href="/login">
            <WordmarkLogo size="sm" />
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            Back to app
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Privacy Policy</h1>
          <p className="mt-2 text-sm text-gray-500">Last updated: {LAST_UPDATED}</p>
          <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
            <strong>Plain language first.</strong> This policy is written to be read, not to obscure. We tell you exactly what we collect, who can see it, and what you can do about it.
          </div>
        </div>

        {/* Table of contents */}
        <nav className="mb-10 rounded-xl border border-gray-100 bg-white p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Contents</p>
          <ol className="space-y-1.5">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((s) => (
            <section key={s.id} id={s.id}>
              <h2 className="mb-4 text-lg font-semibold text-gray-900">{s.title}</h2>
              <div className="text-sm leading-relaxed text-gray-600">{s.content}</div>
            </section>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 border-t border-gray-100 pt-8 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} SmartXpense. All rights reserved.
        </div>
      </main>
    </div>
  )
}
