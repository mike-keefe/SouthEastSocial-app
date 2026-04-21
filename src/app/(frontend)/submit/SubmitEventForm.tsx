'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { VenueSelector } from '@/components/VenueSelector'
import type { Category, Venue } from '@/payload-types'

type Props = {
  categories: Category[]
  venues: Venue[]
}

const minDateTime = () => new Date(Date.now() - 60_000).toISOString().slice(0, 16)

export function SubmitEventForm({ categories, venues }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    venue: '',
    postcode: '',
    startDate: '',
    endDate: '',
    price: '',
    ticketUrl: '',
  })

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const body: Record<string, unknown> = {
        title: form.title,
        description: {
          root: {
            type: 'root',
            children: form.description
              .split('\n\n')
              .filter(Boolean)
              .map((para) => ({
                type: 'paragraph',
                version: 1,
                children: [{ type: 'text', text: para.trim(), version: 1 }],
                direction: 'ltr',
                format: '',
                indent: 0,
              })),
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
        postcode: form.postcode,
        startDate: form.startDate,
        price: form.price,
        ticketUrl: form.ticketUrl,
      }
      if (form.category) body.category = Number(form.category)
      if (form.venue) body.venue = Number(form.venue)
      if (form.endDate) body.endDate = form.endDate

      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        const message = data?.errors?.[0]?.message ?? 'Could not submit event'
        toast.error(message)
        return
      }

      toast.success("Event submitted! We'll review it shortly.")
      router.push('/account')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputCls =
    'w-full h-11 px-4 rounded border border-neutral-200 dark:border-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-900 text-neutral-950 dark:text-neutral-50 placeholder:text-neutral-400 transition-colors'
  const labelCls = 'block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1.5'
  const sectionHeadingCls =
    'text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-600 border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-5'

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Event details */}
      <fieldset className="space-y-5">
        <p className={sectionHeadingCls}>Event details</p>

        <div>
          <label htmlFor="title" className={labelCls}>
            Event title <span className="text-primary-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            required
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            className={inputCls}
            placeholder="e.g. Peckham Night Market"
          />
        </div>

        <div>
          <label htmlFor="description" className={labelCls}>
            Description <span className="text-primary-500">*</span>
          </label>
          <textarea
            id="description"
            required
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={6}
            className="w-full px-4 py-3 rounded border border-neutral-200 dark:border-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-900 text-neutral-950 dark:text-neutral-50 placeholder:text-neutral-400 resize-y transition-colors"
            placeholder="Tell people what to expect. Separate paragraphs with a blank line."
          />
        </div>

        <div>
          <label htmlFor="category" className={labelCls}>
            Category
          </label>
          <select
            id="category"
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
            className={inputCls}
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </fieldset>

      {/* Date & time */}
      <fieldset className="space-y-5">
        <p className={sectionHeadingCls}>Date &amp; time</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="startDate" className={labelCls}>
              Start <span className="text-primary-500">*</span>
            </label>
            <input
              id="startDate"
              type="datetime-local"
              required
              min={minDateTime()}
              value={form.startDate}
              onChange={(e) => set('startDate', e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="endDate" className={labelCls}>
              End
            </label>
            <input
              id="endDate"
              type="datetime-local"
              min={form.startDate || minDateTime()}
              value={form.endDate}
              onChange={(e) => set('endDate', e.target.value)}
              className={inputCls}
            />
          </div>
        </div>
      </fieldset>

      {/* Location */}
      <fieldset className="space-y-5">
        <p className={sectionHeadingCls}>Location</p>

        <div>
          <label htmlFor="postcode" className={labelCls}>
            Postcode <span className="text-primary-500">*</span>
          </label>
          <input
            id="postcode"
            type="text"
            required
            value={form.postcode}
            onChange={(e) => set('postcode', e.target.value)}
            className={`${inputCls} max-w-xs`}
            placeholder="e.g. SE15 4NX"
          />
          <p className="text-xs text-neutral-400 mt-1.5">Must be an SE postcode</p>
        </div>

        {venues.length > 0 && (
          <div>
            <label className={labelCls}>Venue</label>
            <VenueSelector
              venues={venues}
              value={form.venue}
              onChange={(id) => set('venue', id)}
            />
          </div>
        )}
      </fieldset>

      {/* Tickets */}
      <fieldset className="space-y-5">
        <p className={sectionHeadingCls}>Tickets &amp; info</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="price" className={labelCls}>
              Price
            </label>
            <input
              id="price"
              type="text"
              value={form.price}
              onChange={(e) => set('price', e.target.value)}
              className={inputCls}
              placeholder="e.g. Free or £5–£15"
            />
          </div>
          <div>
            <label htmlFor="ticketUrl" className={labelCls}>
              Ticket / info URL
            </label>
            <input
              id="ticketUrl"
              type="url"
              value={form.ticketUrl}
              onChange={(e) => set('ticketUrl', e.target.value)}
              className={inputCls}
              placeholder="https://…"
            />
          </div>
        </div>
      </fieldset>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-bold text-sm rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          {loading ? 'Submitting…' : 'Submit event for review →'}
        </button>
        <p className="text-center text-xs text-neutral-400 mt-3">
          Submissions are reviewed before going live. You&apos;ll get an email when approved.
        </p>
      </div>
    </form>
  )
}
