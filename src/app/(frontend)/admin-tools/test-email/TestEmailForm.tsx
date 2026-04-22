'use client'

import { useState } from 'react'
import { toast } from 'sonner'

const EMAIL_TYPES = [
  { value: 'welcome', label: 'Welcome email' },
  { value: 'event-submitted', label: 'Event submitted' },
  { value: 'event-approved', label: 'Event approved' },
  { value: 'digest', label: 'Weekly digest' },
] as const

type EmailTypeValue = (typeof EMAIL_TYPES)[number]['value']

export function TestEmailForm({ defaultRecipient }: { defaultRecipient: string }) {
  const [type, setType] = useState<EmailTypeValue>('welcome')
  const [to, setTo] = useState(defaultRecipient)
  const [loading, setLoading] = useState(false)

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, to }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Unknown error')
      }
      toast.success(`Test email sent to ${to}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Send failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSend} className="space-y-4 max-w-md">
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">
          Email type
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full bg-neutral-900 border border-neutral-800 text-white text-sm px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {EMAIL_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">
          Send to
        </label>
        <input
          type="email"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          required
          className="w-full bg-neutral-900 border border-neutral-800 text-white text-sm px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-neutral-600"
          placeholder="you@example.com"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="text-sm font-bold text-white bg-primary-600 hover:bg-primary-500 disabled:opacity-50 px-5 py-2.5 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        {loading ? 'Sending…' : 'Send test email'}
      </button>
    </form>
  )
}
