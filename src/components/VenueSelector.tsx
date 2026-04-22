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
    <div className="space-y-2">
      {/* Search */}
      <div className="relative">
        <Search
          size={13}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600 pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="text"
          placeholder="Search venues…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search venues"
          className="w-full h-10 pl-9 pr-4 border border-neutral-200 dark:border-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white dark:bg-neutral-900 text-neutral-950 dark:text-neutral-50 placeholder:text-neutral-500"
        />
      </div>

      {/* Selected venue */}
      {selected && (
        <div className="flex items-center justify-between bg-primary-400/10 border border-primary-400/30 px-3 py-2">
          <div className="flex items-center gap-2 min-w-0">
            <Check size={12} className="text-primary-400 shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-primary-300 truncate">{selected.name}</p>
              {selected.postcode && (
                <p className="text-[11px] text-primary-400/60 flex items-center gap-1">
                  <MapPin size={9} aria-hidden="true" />
                  {selected.postcode}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Remove venue selection"
            className="shrink-0 ml-2 text-primary-400 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Venue tiles */}
      {venues.length > 0 && (
        <div
          role="group"
          aria-label="Select a venue"
          className="grid grid-cols-2 gap-0.5 max-h-52 overflow-y-auto bg-neutral-800 dark:bg-neutral-700"
        >
          {filtered.map((venue) => {
            const isSelected = String(venue.id) === value
            return (
              <button
                key={venue.id}
                type="button"
                onClick={() => onChange(isSelected ? '' : String(venue.id))}
                aria-pressed={isSelected}
                className={`text-left px-3 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-400 ${
                  isSelected
                    ? 'bg-primary-400 text-black'
                    : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                }`}
              >
                <p className="font-semibold truncate text-xs">{venue.name}</p>
                {venue.postcode && (
                  <p className={`text-[10px] mt-0.5 flex items-center gap-1 ${isSelected ? 'text-black/60' : 'text-neutral-400'}`}>
                    <MapPin size={9} aria-hidden="true" />
                    {venue.postcode}
                  </p>
                )}
              </button>
            )
          })}
          {filtered.length === 0 && (
            <p className="col-span-2 bg-white dark:bg-neutral-900 text-sm text-neutral-400 py-5 text-center">
              No venues match &ldquo;{search}&rdquo;
            </p>
          )}
        </div>
      )}
    </div>
  )
}
