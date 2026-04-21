'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import type { Category } from '@/payload-types'

type Props = {
  categories: Category[]
}

export function EventFilters({ categories }: Props) {
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
      params.delete('page') // reset pagination on filter change
      router.push(`${pathname}?${params.toString()}`)
    },
    [searchParams, pathname, router],
  )

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-4 flex flex-wrap gap-3 items-end">
      {/* Keyword search */}
      <div className="flex flex-col gap-1 min-w-[160px] flex-1">
        <label htmlFor="filter-q" className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
          Search
        </label>
        <input
          id="filter-q"
          type="text"
          placeholder="Event name or keyword"
          defaultValue={searchParams.get('q') ?? ''}
          onChange={(e) => updateParam('q', e.target.value)}
          className="h-9 px-3 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
        />
      </div>

      {/* Category */}
      <div className="flex flex-col gap-1">
        <label htmlFor="filter-category" className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
          Category
        </label>
        <select
          id="filter-category"
          defaultValue={searchParams.get('category') ?? ''}
          onChange={(e) => updateParam('category', e.target.value)}
          className="h-9 px-3 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug ?? ''}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Postcode */}
      <div className="flex flex-col gap-1">
        <label htmlFor="filter-postcode" className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
          Postcode
        </label>
        <input
          id="filter-postcode"
          type="text"
          placeholder="e.g. SE15"
          defaultValue={searchParams.get('postcode') ?? ''}
          onChange={(e) => updateParam('postcode', e.target.value)}
          className="h-9 px-3 w-28 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
        />
      </div>

      {/* Free only */}
      <label className="flex items-center gap-2 text-sm cursor-pointer self-end h-9">
        <input
          type="checkbox"
          defaultChecked={searchParams.get('free') === 'true'}
          onChange={(e) => updateParam('free', e.target.checked ? 'true' : '')}
          className="w-4 h-4 accent-primary-500"
        />
        <span className="text-neutral-700 font-medium">Free only</span>
      </label>

      {/* Clear */}
      {(searchParams.get('q') || searchParams.get('category') || searchParams.get('postcode') || searchParams.get('free')) && (
        <button
          onClick={() => router.push(pathname)}
          className="h-9 px-3 text-sm text-neutral-500 hover:text-neutral-800 underline self-end"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}
