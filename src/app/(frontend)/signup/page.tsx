'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { PageWrapper } from '@/components/PageWrapper'

export default function SignupPage() {
  const router = useRouter()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        const message = data?.errors?.[0]?.message ?? 'Could not create account'
        toast.error(message)
        return
      }

      const loginRes = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (loginRes.ok) {
        toast.success('Account created — welcome!')
        router.push('/account')
        router.refresh()
      } else {
        toast.success('Account created! Please log in.')
        router.push('/login')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputCls =
    'w-full h-11 px-4 border border-neutral-700 bg-neutral-800 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-400 transition-colors'
  const labelCls = 'block text-[9px] font-bold uppercase tracking-[0.15em] text-neutral-500 mb-1.5'

  return (
    <div className="bg-neutral-950 min-h-screen flex items-center">
      <PageWrapper narrow>
        <div className="max-w-sm mx-auto py-16">
          <div className="mb-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-600 mb-3">
              SouthEastSocial
            </p>
            <h1 className="font-display font-bold text-3xl text-white">Create account</h1>
            <p className="text-neutral-500 text-sm mt-2">
              Already have one?{' '}
              <Link href="/login" className="text-primary-400 hover:text-primary-300 transition-colors">
                Log in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="displayName" className={labelCls}>Display name</label>
              <input
                id="displayName"
                type="text"
                autoComplete="name"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className={inputCls}
                placeholder="Your public name"
              />
            </div>

            <div>
              <label htmlFor="email" className={labelCls}>Email address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className={labelCls}>Password</label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputCls}
                placeholder="At least 8 characters"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-primary-400 hover:bg-primary-300 disabled:opacity-40 text-black font-bold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                {loading ? 'Creating account…' : 'Create account'}
              </button>
            </div>
          </form>
        </div>
      </PageWrapper>
    </div>
  )
}
