'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { X } from 'lucide-react'
import type { Category } from '@/payload-types'
import type { NeighbourhoodSeed } from '@/lib/neighbourhoods'

type Props = {
  categories: Category[]
  neighbourhoods: NeighbourhoodSeed[]
}

export function EventFilters({ categories, neighbourhoods }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const q        = searchParams.get('q') ?? ''
  const area     = searchParams.get('area') ?? ''
  const category = searchParams.get('category') ?? ''
  const free     = searchParams.get('free') ?? ''

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) params.set(key, value)
      else params.delete(key)
      params.delete('page')
      router.push(`${pathname}?${params.toString()}`)
    },
    [searchParams, pathname, router],
  )

  const clearAll = () => router.push(pathname)

  const activePills: { label: string; key: string }[] = []
  if (area) {
    const name = neighbourhoods.find((n) => n.slug === area)?.name ?? area
    activePills.push({ label: name, key: 'area' })
  }
  if (category) {
    const name = categories.find((c) => c.slug === category)?.name ?? category
    activePills.push({ label: name, key: 'category' })
  }
  if (free) activePills.push({ label: 'Free only', key: 'free' })
  if (q) activePills.push({ label: `"${q}"`, key: 'q' })

  const inputCls =
    'h-9 px-3 border border-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-neutral-900 text-neutral-100 placeholder:text-neutral-600 w-full'
  const labelCls = 'text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-600 mb-1.5 block'

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-end">
        {/* Search */}
        <div className="flex flex-col min-w-[160px] flex-1">
          <label htmlFor="filter-q" className={labelCls}>Search</label>
          <input
            id="filter-q"
            type="text"
            placeholder="Event name or keyword"
            value={q}
            onChange={(e) => updateParam('q', e.target.value)}
            className={inputCls}
          />
        </div>

        {/* Area */}
        <div className="flex flex-col min-w-[150px]">
          <label htmlFor="filter-area" className={labelCls}>Area</label>
          <select
            id="filter-area"
            value={area}
            onChange={(e) => updateParam('area', e.target.value)}
            className={inputCls}
          >
            <option value="">All areas</option>
            {neighbourhoods.map((n) => (
              <option key={n.slug} value={n.slug}>
                {n.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div className="flex flex-col min-w-[140px]">
          <label htmlFor="filter-category" className={labelCls}>Category</label>
          <select
            id="filter-category"
            value={category}
            onChange={(e) => updateParam('category', e.target.value)}
            className={inputCls}
          >
            <option value="">All categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug ?? ''}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Free */}
        <label className="flex items-center gap-2 text-sm cursor-pointer self-end h-9 shrink-0">
          <input
            type="checkbox"
            checked={free === 'true'}
            onChange={(e) => updateParam('free', e.target.checked ? 'true' : '')}
            className="w-4 h-4 accent-primary-400"
          />
          <span className="text-neutral-400 font-medium text-[13px]">Free only</span>
        </label>
      </div>

      {/* Active filter pills */}
      {activePills.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-600">
            Filtering by:
          </span>
          {activePills.map(({ label, key }) => (
            <button
              key={key}
              onClick={() => updateParam(key, '')}
              className="inline-flex items-center gap-1.5 h-7 px-2.5 text-[11px] font-bold bg-primary-400/10 text-primary-400 border border-primary-400/20 hover:bg-primary-400/20 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400"
            >
              {label}
              <X size={10} />
            </button>
          ))}
          <button
            onClick={clearAll}
            className="text-[11px] font-bold text-neutral-600 hover:text-neutral-300 uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  )
}
