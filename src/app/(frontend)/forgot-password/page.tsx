'use client'

import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import { PageWrapper } from '@/components/PageWrapper'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        toast.error('Something went wrong. Please try again.')
        return
      }

      setSent(true)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-16">
      <PageWrapper>
        <div className="max-w-md mx-auto">
          <h1 className="font-display text-4xl font-bold text-neutral-950 mb-2">
            Reset your password
          </h1>

          {sent ? (
            <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6">
              <p className="font-semibold text-green-900 mb-1">Check your inbox</p>
              <p className="text-green-800 text-sm">
                If an account exists for <strong>{email}</strong>, we&apos;ve sent a password reset
                link. It may take a minute or two to arrive.
              </p>
              <Link
                href="/login"
                className="mt-4 inline-block text-sm font-medium text-primary-600 hover:underline"
              >
                ← Back to login
              </Link>
            </div>
          ) : (
            <>
              <p className="text-neutral-500 mb-8">
                Enter your email address and we&apos;ll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-neutral-700 mb-1"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                    placeholder="you@example.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-950"
                >
                  {loading ? 'Sending…' : 'Send reset link'}
                </button>

                <p className="text-center text-sm text-neutral-500">
                  <Link href="/login" className="text-primary-600 hover:underline font-medium">
                    ← Back to login
                  </Link>
                </p>
              </form>
            </>
          )}
        </div>
      </PageWrapper>
    </div>
  )
}
