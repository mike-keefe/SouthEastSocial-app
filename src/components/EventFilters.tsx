'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
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

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete('page')
      router.push(`${pathname}?${params.toString()}`)
    },
    [searchParams, pathname, router],
  )

  const inputCls =
    'h-9 px-3 border border-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-neutral-900 text-neutral-100 placeholder:text-neutral-600'
  const labelCls = 'text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-600 mb-1.5 block'

  return (
    <div className="flex flex-wrap gap-4 items-end">
      <div className="flex flex-col min-w-[160px] flex-1">
        <label htmlFor="filter-q" className={labelCls}>
          Search
        </label>
        <input
          id="filter-q"
          type="text"
          placeholder="Event name or keyword"
          defaultValue={searchParams.get('q') ?? ''}
          onChange={(e) => updateParam('q', e.target.value)}
          className={inputCls}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="filter-area" className={labelCls}>
          Area
        </label>
        <select
          id="filter-area"
          defaultValue={searchParams.get('area') ?? ''}
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

      <div className="flex flex-col">
        <label htmlFor="filter-category" className={labelCls}>
          Category
        </label>
        <select
          id="filter-category"
          defaultValue={searchParams.get('category') ?? ''}
          onChange={(e) => updateParam('category', e.target.value)}
          className={inputCls}
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug ?? ''}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm cursor-pointer self-end h-9">
        <input
          type="checkbox"
          defaultChecked={searchParams.get('free') === 'true'}
          onChange={(e) => updateParam('free', e.target.checked ? 'true' : '')}
          className="w-4 h-4 accent-primary-400"
        />
        <span className="text-neutral-400 font-medium text-[13px]">Free only</span>
      </label>

      {(searchParams.get('q') ||
        searchParams.get('area') ||
        searchParams.get('category') ||
        searchParams.get('free')) && (
        <button
          onClick={() => router.push(pathname)}
          aria-label="Clear all filters"
          className="h-9 px-3 text-[12px] font-bold text-neutral-600 hover:text-neutral-300 uppercase tracking-wider self-end transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400"
        >
          Clear
        </button>
      )}
    </div>
  )
}
