'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import type { EmailSubscription } from '@/payload-types'

type Props = { prefs: EmailSubscription }

type Prefs = {
  weeklyDigest: boolean
  eventApproved: boolean
  welcomeEmail: boolean
}

const PREF_LABELS: { key: keyof Prefs; label: string; description: string }[] = [
  {
    key: 'weeklyDigest',
    label: 'Weekly digest',
    description: 'A curated list of upcoming events, including personalised picks from venues and organisers you follow.',
  },
  {
    key: 'eventApproved',
    label: 'Event approved',
    description: "An email when one of your submitted events is approved and goes live.",
  },
  {
    key: 'welcomeEmail',
    label: 'Welcome email',
    description: 'A welcome email when you create a new account.',
  },
]

export function EmailPreferencesForm({ prefs }: Props) {
  const [values, setValues] = useState<Prefs>({
    weeklyDigest: prefs.weeklyDigest ?? true,
    eventApproved: prefs.eventApproved ?? true,
    welcomeEmail: prefs.welcomeEmail ?? true,
  })
  const [loading, setLoading] = useState(false)

  async function handleSave() {
    setLoading(true)
    try {
      const res = await fetch(`/api/email-subscriptions/${prefs.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!res.ok) throw new Error()
      toast.success('Preferences saved')
    } catch {
      toast.error('Could not save preferences. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 space-y-6">
      {PREF_LABELS.map(({ key, label, description }) => (
        <label key={key} className="flex items-start gap-4 cursor-pointer group">
          <div className="relative mt-0.5">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={values[key]}
              onChange={(e) => setValues((prev) => ({ ...prev, [key]: e.target.checked }))}
            />
            <div className="w-11 h-6 rounded-full bg-neutral-200 peer-checked:bg-primary-500 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 peer-focus-visible:ring-offset-2" />
            <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
          </div>
          <div>
            <p className="font-semibold text-neutral-900 group-hover:text-neutral-700">{label}</p>
            <p className="text-sm text-neutral-500 mt-0.5">{description}</p>
          </div>
        </label>
      ))}

      <button
        onClick={handleSave}
        disabled={loading}
        className="mt-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      >
        {loading ? 'Saving…' : 'Save preferences'}
      </button>
    </div>
  )
}
