import Image from 'next/image'
import Link from 'next/link'
import { CalendarDays, MapPin } from 'lucide-react'
import type { Event, Category, Media, Venue } from '@/payload-types'

type Props = { event: Event }

const GRADIENTS = [
  'from-blue-950 via-neutral-900 to-neutral-950',
  'from-indigo-950 via-neutral-900 to-neutral-950',
  'from-slate-800 via-neutral-900 to-neutral-950',
  'from-zinc-800 via-neutral-900 to-neutral-950',
  'from-sky-950 via-neutral-900 to-neutral-950',
  'from-violet-950 via-neutral-900 to-neutral-950',
]

function fallbackGradient(id: number | string) {
  const n = typeof id === 'string' ? parseInt(id, 10) || 0 : id
  return GRADIENTS[n % GRADIENTS.length]
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export function EventCard({ event }: Props) {
  const category = typeof event.category === 'object' ? (event.category as Category) : null
  const image = typeof event.image === 'object' ? (event.image as Media) : null
  const venue = typeof event.venue === 'object' ? (event.venue as Venue) : null
  const location = event.postcode ?? venue?.postcode ?? null

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group relative block aspect-[3/4] rounded overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-950"
    >
      {/* Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${fallbackGradient(event.id)}`}>
        {image?.url && (
          <Image
            src={image.url}
            alt={image.alt ?? event.title}
            fill
            className="object-cover opacity-70 group-hover:opacity-85 group-hover:scale-[1.03] transition-all duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

      {/* Category pill */}
      {category && (
        <div className="absolute top-3 left-3 z-10">
          <span
            className="inline-block px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm"
            style={{
              backgroundColor: category.colour ? `${category.colour}cc` : 'rgba(37,99,235,0.85)',
            }}
          >
            {category.name}
          </span>
        </div>
      )}

      {/* Price */}
      {event.price && (
        <div className="absolute top-3 right-3 z-10">
          <span className="text-[10px] font-bold text-white bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-sm">
            {event.price}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <h3 className="font-display font-bold text-white text-base leading-snug line-clamp-2 mb-2 group-hover:text-primary-300 transition-colors">
          {event.title}
        </h3>
        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-[11px] text-neutral-400">
          <span className="flex items-center gap-1">
            <CalendarDays size={10} aria-hidden="true" />
            {formatDate(event.startDate)}
          </span>
          {location && (
            <span className="flex items-center gap-1">
              <MapPin size={10} aria-hidden="true" />
              {location}
            </span>
          )}
        </div>
      </div>

      {/* Hover ring */}
      <div className="absolute inset-0 rounded ring-1 ring-white/0 group-hover:ring-white/10 transition-all duration-200" />
    </Link>
  )
}
