'use client'

import { useState } from 'react'
import { Search, X, MapPin, Check } from 'lucide-react'
import type { Venue } from '@/payload-types'

type Props = {
  venues: Venue[]
  value: string
  onChange: (id: string) => void
}

export function VenueSelector({ venues, value, onChange }: Props) {
  const [search, setSearch] = useState('')

  const filtered = venues.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      (v.postcode ?? '').toLowerCase().includes(search.toLowerCase()),
  )

  const selected = venues.find((v) => String(v.id) === value)

  return (
    <div className="space-y-2.5">
      {/* Search */}
      <div className="relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="text"
          placeholder="Search venues…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 pl-9 pr-4 rounded border border-neutral-200 dark:border-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-900 text-neutral-950 dark:text-neutral-50 placeholder:text-neutral-400"
        />
      </div>

      {/* Selected venue */}
      {selected && (
        <div className="flex items-center justify-between bg-primary-950/30 border border-primary-800/40 rounded px-3 py-2">
          <div className="flex items-center gap-2 min-w-0">
            <Check size={13} className="text-primary-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-primary-200 truncate">{selected.name}</p>
              {selected.postcode && (
                <p className="text-xs text-primary-400 flex items-center gap-1">
                  <MapPin size={9} />
                  {selected.postcode}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Remove venue selection"
            className="shrink-0 ml-2 text-primary-400 hover:text-primary-200 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Venue tiles */}
      {venues.length > 0 && (
        <div className="grid grid-cols-2 gap-1.5 max-h-52 overflow-y-auto">
          {filtered.map((venue) => {
            const isSelected = String(venue.id) === value
            return (
              <button
                key={venue.id}
                type="button"
                onClick={() => onChange(isSelected ? '' : String(venue.id))}
                className={`text-left px-3 py-2.5 rounded border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  isSelected
                    ? 'border-primary-500 bg-primary-500/10 text-primary-300'
                    : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-500'
                }`}
              >
                <p className="font-medium truncate text-xs">{venue.name}</p>
                {venue.postcode && (
                  <p className="text-[10px] text-neutral-400 mt-0.5 flex items-center gap-1">
                    <MapPin size={9} />
                    {venue.postcode}
                  </p>
                )}
              </button>
            )
          })}
          {filtered.length === 0 && (
            <p className="col-span-2 text-sm text-neutral-400 py-4 text-center">
              No venues match &ldquo;{search}&rdquo;
            </p>
          )}
        </div>
      )}
    </div>
  )
}
