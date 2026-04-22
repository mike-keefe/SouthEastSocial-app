'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { VenueSelector } from '@/components/VenueSelector'
import type { Category, Event, Venue } from '@/payload-types'

type Props = {
  event: Event
  categories: Category[]
  venues: Venue[]
}

function extractText(content: unknown): string {
  if (!content || typeof content !== 'object') return ''
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const root = (content as any).root
  if (!root?.children) return ''
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return root.children.map((node: any) => {
    if (node.type === 'paragraph') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (node.children ?? []).map((c: any) => c.text ?? '').join('')
    }
    return ''
  }).filter(Boolean).join('\n\n')
}

function toISO(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  return new Date(dateStr).toISOString().slice(0, 16)
}

export function EditEventForm({ event, categories, venues }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const initialVenueId =
    typeof event.venue === 'object' && event.venue ? String(event.venue.id) : event.venue ? String(event.venue) : ''
  const initialCategoryId =
    typeof event.category === 'object' && event.category ? String(event.category.id) : event.category ? String(event.category) : ''

  const [form, setForm] = useState({
    title: event.title ?? '',
    description: extractText(event.description),
    category: initialCategoryId,
    venue: initialVenueId,
    postcode: event.postcode ?? '',
    startDate: toISO(event.startDate),
    endDate: toISO(event.endDate),
    price: event.price ?? '',
    ticketUrl: event.ticketUrl ?? '',
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
        endDate: form.endDate || null,
        category: form.category ? Number(form.category) : null,
        venue: form.venue ? Number(form.venue) : null,
      }

      const res = await fetch(`/api/events/${event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        const message = data?.errors?.[0]?.message ?? 'Could not save event'
        toast.error(message)
        return
      }

      toast.success('Event updated.')
      router.push(`/events/${event.slug}`)
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
  const sectionHeadingCls =
    'text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-600 border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-5'

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
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
            <option value="">No category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </fieldset>

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
              min={form.startDate}
              value={form.endDate}
              onChange={(e) => set('endDate', e.target.value)}
              className={inputCls}
            />
          </div>
        </div>
      </fieldset>

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
        </div>

        {venues.length > 0 && (
          <div>
            <label className={labelCls}>Venue</label>
            <VenueSelector venues={venues} value={form.venue} onChange={(id) => set('venue', id)} />
          </div>
        )}
      </fieldset>

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
          {loading ? 'Saving…' : 'Save changes →'}
        </button>
      </div>
    </form>
  )
}
