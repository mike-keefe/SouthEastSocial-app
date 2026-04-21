'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { Category, Venue } from '@/payload-types'

type Props = {
  categories: Category[]
  venues: Venue[]
}

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
        // Plain text description — stored as minimal Lexical document
        description: {
          root: {
            type: 'root',
            children: form.description.split('\n\n').filter(Boolean).map((para) => ({
              type: 'paragraph',
              version: 1,
              children: [{ type: 'text', text: para.trim(), version: 1 }],
              direction: 'ltr', format: '', indent: 0,
            })),
            direction: 'ltr', format: '', indent: 0, version: 1,
          },
        },
        postcode: form.postcode,
        startDate: form.startDate,
        price: form.price,
        ticketUrl: form.ticketUrl,
      }
      if (form.category) body.category = form.category
      if (form.venue) body.venue = form.venue
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

      toast.success('Event submitted! We\'ll review it shortly.')
      router.push('/account')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'w-full h-11 px-4 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white'
  const labelCls = 'block text-sm font-medium text-neutral-700 mb-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8">
      <div>
        <label htmlFor="title" className={labelCls}>Event title <span className="text-primary-500">*</span></label>
        <input id="title" type="text" required value={form.title} onChange={(e) => set('title', e.target.value)} className={inputCls} placeholder="e.g. Peckham Night Market" />
      </div>

      <div>
        <label htmlFor="description" className={labelCls}>Description <span className="text-primary-500">*</span></label>
        <textarea
          id="description" required value={form.description} onChange={(e) => set('description', e.target.value)}
          rows={6}
          className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white resize-y"
          placeholder="Tell people what to expect. Separate paragraphs with a blank line."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="category" className={labelCls}>Category</label>
          <select id="category" value={form.category} onChange={(e) => set('category', e.target.value)} className={inputCls}>
            <option value="">Select a category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="venue" className={labelCls}>Venue</label>
          <select id="venue" value={form.venue} onChange={(e) => set('venue', e.target.value)} className={inputCls}>
            <option value="">Select a venue (optional)</option>
            {venues.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="postcode" className={labelCls}>Postcode <span className="text-primary-500">*</span></label>
        <input id="postcode" type="text" required value={form.postcode} onChange={(e) => set('postcode', e.target.value)} className={`${inputCls} max-w-xs`} placeholder="e.g. SE15 4NX" />
        <p className="text-xs text-neutral-400 mt-1">Must be an SE postcode</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="startDate" className={labelCls}>Start date &amp; time <span className="text-primary-500">*</span></label>
          <input id="startDate" type="datetime-local" required value={form.startDate} onChange={(e) => set('startDate', e.target.value)} className={inputCls} />
        </div>
        <div>
          <label htmlFor="endDate" className={labelCls}>End date &amp; time</label>
          <input id="endDate" type="datetime-local" value={form.endDate} onChange={(e) => set('endDate', e.target.value)} className={inputCls} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="price" className={labelCls}>Price</label>
          <input id="price" type="text" value={form.price} onChange={(e) => set('price', e.target.value)} className={inputCls} placeholder="e.g. Free or £5–£15" />
        </div>
        <div>
          <label htmlFor="ticketUrl" className={labelCls}>Ticket / info URL</label>
          <input id="ticketUrl" type="url" value={form.ticketUrl} onChange={(e) => set('ticketUrl', e.target.value)} className={inputCls} placeholder="https://..." />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-12 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      >
        {loading ? 'Submitting…' : 'Submit event for review'}
      </button>
    </form>
  )
}
