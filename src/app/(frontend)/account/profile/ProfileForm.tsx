'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type Props = {
  userId: number
  displayName: string
  bio: string
  email: string
}

export function ProfileForm({ userId, displayName, bio, email }: Props) {
  const router = useRouter()
  const [form, setForm] = useState({ displayName, bio, email })
  const [loading, setLoading] = useState(false)

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: form.displayName,
          bio: form.bio,
          email: form.email,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        const message = data?.errors?.[0]?.message ?? 'Could not save profile'
        toast.error(message)
        return
      }
      toast.success('Profile saved')
      router.refresh()
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputCls =
    'w-full h-11 px-4 rounded border border-neutral-200 dark:border-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-900 text-neutral-950 dark:text-neutral-50 placeholder:text-neutral-400 transition-colors'
  const labelCls = 'block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-800 p-6 space-y-5">
        <div>
          <label htmlFor="displayName" className={labelCls}>
            Display name
          </label>
          <input
            id="displayName"
            type="text"
            value={form.displayName}
            onChange={(e) => set('displayName', e.target.value)}
            className={inputCls}
            placeholder="Your public name"
          />
        </div>

        <div>
          <label htmlFor="email" className={labelCls}>
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            className={inputCls}
          />
        </div>

        <div>
          <label htmlFor="bio" className={labelCls}>
            Bio
          </label>
          <textarea
            id="bio"
            value={form.bio}
            onChange={(e) => set('bio', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded border border-neutral-200 dark:border-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-900 text-neutral-950 dark:text-neutral-50 placeholder:text-neutral-400 resize-y transition-colors"
            placeholder="A few words about yourself"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-bold text-sm rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-950"
      >
        {loading ? 'Saving…' : 'Save profile'}
      </button>
    </form>
  )
}
