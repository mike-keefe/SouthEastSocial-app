'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { VenueSelector } from '@/components/VenueSelector'
import { StyledSelect } from '@/components/StyledSelect'
import { DateTimePicker } from '@/components/DateTimePicker'
import { RichTextEditor } from '@/components/RichTextEditor'
import { ImageUpload } from '@/components/ImageUpload'
import { htmlToLexical } from '@/lib/richtext'
import type { Category, Venue } from '@/payload-types'

type Props = {
  categories: Category[]
  venues: Venue[]
}

const minDateTime = () => new Date(Date.now() - 60_000).toISOString().slice(0, 16)

export function SubmitEventForm({ categories, venues }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [descHtml, setDescHtml] = useState('')
  const [imageId, setImageId] = useState<number | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageUploading, setImageUploading] = useState(false)
  const [form, setForm] = useState({
    title: '',
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

  async function handleImageFile(file: File) {
    setImageUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('alt', form.title || file.name.replace(/\.[^.]+$/, ''))
      const res = await fetch('/api/media', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.errors?.[0]?.message ?? 'Upload failed')
      setImageId(data.doc.id)
      setImagePreview(URL.createObjectURL(file))
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Image upload failed')
    } finally {
      setImageUploading(false)
    }
  }

  function clearImage() {
    setImageId(null)
    setImagePreview(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const body: Record<string, unknown> = {
        title: form.title,
        description: htmlToLexical(descHtml),
        postcode: form.postcode,
        startDate: form.startDate,
        price: form.price,
        ticketUrl: form.ticketUrl,
      }
      if (form.category) body.category = Number(form.category)
      if (form.venue)    body.venue    = Number(form.venue)
      if (form.endDate)  body.endDate  = form.endDate
      if (imageId)       body.image    = imageId

      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data?.errors?.[0]?.message ?? 'Could not submit event')
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
    'w-full h-11 px-4 border border-neutral-700 bg-neutral-800 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-400 transition-colors'
  const labelCls = 'block text-[9px] font-bold uppercase tracking-[0.15em] text-neutral-500 mb-1.5'
  const sectionHeadingCls =
    'text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-600 border-b border-neutral-800 pb-3 mb-5'

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Event details */}
      <fieldset className="space-y-5">
        <p className={sectionHeadingCls}>Event details</p>

        <div>
          <label htmlFor="title" className={labelCls}>
            Event title <span className="text-primary-400">*</span>
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
          <span className={labelCls}>
            Description <span className="text-primary-400">*</span>
          </span>
          <RichTextEditor
            value={descHtml}
            onChange={setDescHtml}
            placeholder="Tell people what to expect…"
          />
        </div>

        <div>
          <label htmlFor="category" className={labelCls}>Category</label>
          <StyledSelect
            id="category"
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </StyledSelect>
        </div>

        <div>
          <span className={labelCls}>Event image</span>
          <ImageUpload
            imagePreview={imagePreview}
            uploading={imageUploading}
            onFile={handleImageFile}
            onClear={clearImage}
          />
        </div>
      </fieldset>

      {/* Date & time */}
      <fieldset className="space-y-5">
        <p className={sectionHeadingCls}>Date &amp; time</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="startDate" className={labelCls}>
              Start <span className="text-primary-400">*</span>
            </label>
            <DateTimePicker
              id="startDate"
              required
              min={minDateTime()}
              value={form.startDate}
              onChange={(v) => set('startDate', v)}
            />
          </div>
          <div>
            <label htmlFor="endDate" className={labelCls}>End</label>
            <DateTimePicker
              id="endDate"
              min={form.startDate || minDateTime()}
              value={form.endDate}
              onChange={(v) => set('endDate', v)}
            />
          </div>
        </div>
      </fieldset>

      {/* Location */}
      <fieldset className="space-y-5">
        <p className={sectionHeadingCls}>Location</p>

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

        {form.venue ? (
          <p className="text-xs text-neutral-600">
            Location will be taken from the selected venue.
          </p>
        ) : (
          <div>
            <label htmlFor="postcode" className={labelCls}>
              Postcode <span className="text-primary-400">*</span>
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
            <p className="text-xs text-neutral-600 mt-1.5">Must be an SE postcode</p>
          </div>
        )}
      </fieldset>

      {/* Tickets */}
      <fieldset className="space-y-5">
        <p className={sectionHeadingCls}>Tickets &amp; info</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="price" className={labelCls}>Price</label>
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
            <label htmlFor="ticketUrl" className={labelCls}>Ticket / info URL</label>
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
          disabled={loading || imageUploading}
          className="w-full py-3.5 bg-primary-400 hover:bg-primary-300 disabled:opacity-40 text-black font-bold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400"
        >
          {loading ? 'Submitting…' : 'Submit event for review'}
        </button>
      </div>
    </form>
  )
}
