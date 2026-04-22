'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data?.errors?.[0]?.message ?? 'Invalid email or password')
        return
      }

      toast.success('Welcome back!')
      router.push('/account')
      router.refresh()
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
    <div className="bg-neutral-950 min-h-screen flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-lg py-16">
          <div className="mb-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-600 mb-3">
              SouthEastSocial
            </p>
            <h1 className="font-display font-bold text-3xl text-white">Log in</h1>
            <p className="text-neutral-500 text-sm mt-2">
              No account?{' '}
              <Link href="/signup" className="text-primary-400 hover:text-primary-300 transition-colors">
                Sign up free
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className={labelCls.replace('mb-1.5', '')}>
                  Password
                </label>
                <Link href="/forgot-password" className="text-[10px] text-neutral-600 hover:text-neutral-400 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputCls}
                placeholder="••••••••"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-primary-400 hover:bg-primary-300 disabled:opacity-40 text-black font-bold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                {loading ? 'Logging in…' : 'Log in'}
              </button>
            </div>
          </form>
      </div>
    </div>
  )
}
