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
    <div className="bg-neutral-950 min-h-screen flex items-center">
      <PageWrapper narrow>
        <div className="max-w-sm mx-auto py-16">
          <div className="mb-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-600 mb-3">
              SouthEastSocial
            </p>
            <h1 className="font-display font-bold text-3xl text-white">Reset password</h1>
          </div>

          {sent ? (
            <div className="border border-neutral-800 bg-neutral-900 p-6">
              <p className="font-bold text-white mb-1">Check your inbox</p>
              <p className="text-neutral-400 text-sm">
                If an account exists for <strong className="text-white">{email}</strong>, we&apos;ve
                sent a reset link. It may take a minute or two.
              </p>
              <Link
                href="/login"
                className="mt-5 inline-block text-sm text-primary-400 hover:text-primary-300 transition-colors"
              >
                ← Back to login
              </Link>
            </div>
          ) : (
            <>
              <p className="text-neutral-500 text-sm mb-8">
                Enter your email and we&apos;ll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-[9px] font-bold uppercase tracking-[0.15em] text-neutral-500 mb-1.5"
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
                    className="w-full h-11 px-4 border border-neutral-700 bg-neutral-800 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-400 transition-colors"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-primary-400 hover:bg-primary-300 disabled:opacity-40 text-black font-bold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400"
                  >
                    {loading ? 'Sending…' : 'Send reset link'}
                  </button>
                </div>

                <p className="text-center text-sm">
                  <Link href="/login" className="text-neutral-500 hover:text-neutral-300 transition-colors">
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
