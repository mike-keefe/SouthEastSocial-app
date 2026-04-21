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
      params.delete('page')
      router.push(`${pathname}?${params.toString()}`)
    },
    [searchParams, pathname, router],
  )

  const inputCls =
    'h-9 px-3 rounded border border-neutral-200 dark:border-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-900 text-neutral-950 dark:text-neutral-50 placeholder:text-neutral-400'
  const labelCls = 'text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1 block'

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded p-4 flex flex-wrap gap-4 items-end">
      <div className="flex flex-col gap-1 min-w-[160px] flex-1">
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

      <div className="flex flex-col gap-1">
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

      <div className="flex flex-col gap-1">
        <label htmlFor="filter-postcode" className={labelCls}>
          Postcode
        </label>
        <input
          id="filter-postcode"
          type="text"
          placeholder="e.g. SE15"
          defaultValue={searchParams.get('postcode') ?? ''}
          onChange={(e) => updateParam('postcode', e.target.value)}
          className={`${inputCls} w-28`}
        />
      </div>

      <label className="flex items-center gap-2 text-sm cursor-pointer self-end h-9">
        <input
          type="checkbox"
          defaultChecked={searchParams.get('free') === 'true'}
          onChange={(e) => updateParam('free', e.target.checked ? 'true' : '')}
          className="w-4 h-4 accent-primary-500"
        />
        <span className="text-neutral-700 dark:text-neutral-300 font-medium">Free only</span>
      </label>

      {(searchParams.get('q') ||
        searchParams.get('category') ||
        searchParams.get('postcode') ||
        searchParams.get('free')) && (
        <button
          onClick={() => router.push(pathname)}
          className="h-9 px-3 text-sm text-neutral-500 hover:text-neutral-950 dark:hover:text-white underline self-end transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  )
}
