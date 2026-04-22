import Image from 'next/image'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import type { Event, Category, Media, Venue, Neighbourhood } from '@/payload-types'
import { formatEventDateParts } from '@/lib/dates'

type Props = { event: Event }

const FALLBACK_GRADIENTS = [
  'from-neutral-900 to-neutral-800',
  'from-neutral-900 to-zinc-800',
  'from-neutral-900 to-stone-800',
  'from-neutral-900 to-slate-800',
  'from-neutral-900 to-gray-800',
  'from-neutral-900 to-neutral-700',
]

function fallbackGradient(id: number | string) {
  const n = typeof id === 'string' ? parseInt(id, 10) || 0 : id
  return FALLBACK_GRADIENTS[n % FALLBACK_GRADIENTS.length]
}

const formatEventDate = formatEventDateParts

export function EventCard({ event }: Props) {
  const category = typeof event.category === 'object' ? (event.category as Category) : null
  const image = typeof event.image === 'object' ? (event.image as Media) : null
  const venue = typeof event.venue === 'object' ? (event.venue as Venue) : null
  const venueNeighbourhood = venue?.neighbourhood && typeof venue.neighbourhood === 'object'
    ? (venue.neighbourhood as Neighbourhood)
    : null
  const location = venueNeighbourhood?.name ?? venue?.name ?? event.postcode ?? null
  const { day, weekday, month } = formatEventDate(event.startDate)

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group relative block aspect-[2/3] overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-neutral-950"
      aria-label={`${event.title} — ${weekday} ${day} ${month}${location ? `, ${location}` : ''}`}
    >
      {/* Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${fallbackGradient(event.id)}`}>
        {image?.url && (
          <Image
            src={image.url}
            alt=""
            fill
            className="object-cover opacity-70 group-hover:opacity-85 group-hover:scale-[1.04] transition-all duration-700 ease-out"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        )}
      </div>

      {/* Strong gradient overlay — heavier at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/10" />

      {/* Top row — category + price */}
      <div className="absolute top-0 left-0 right-0 z-10 p-3 flex items-start justify-between gap-2">
        {category && (
          <span
            className="text-[9px] font-bold uppercase tracking-[0.15em] text-black px-2 py-1 leading-none"
            style={{
              backgroundColor: category.colour ?? '#b0ff00',
            }}
          >
            {category.name}
          </span>
        )}
        {event.price && (
          <span className="text-[10px] font-medium text-white/70 ml-auto">
            {event.price}
          </span>
        )}
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
        {/* Date stamp */}
        <div className="flex items-baseline gap-1.5 mb-3">
          <span className="font-display font-bold text-primary-400 text-2xl leading-none tabular-nums">
            {day}
          </span>
          <div className="flex flex-col leading-none gap-0.5">
            <span className="text-[8px] font-bold text-primary-400/60 tracking-[0.18em]">
              {weekday}
            </span>
            <span className="text-[8px] font-bold text-primary-400/60 tracking-[0.18em]">
              {month}
            </span>
          </div>
        </div>

        <h3 className="font-display font-bold text-white text-[15px] leading-tight line-clamp-2 mb-2.5 group-hover:text-primary-300 transition-colors">
          {event.title}
        </h3>

        {location && (
          <p className="text-[11px] text-neutral-400 flex items-center gap-1">
            <MapPin size={9} aria-hidden="true" />
            {location}
          </p>
        )}
      </div>

      {/* Hover — lime border pulse */}
      <div className="absolute inset-0 ring-1 ring-inset ring-white/0 group-hover:ring-primary-400/20 transition-all duration-300" />
    </Link>
  )
}
