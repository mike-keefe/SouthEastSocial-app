import Image from 'next/image'
import Link from 'next/link'
import type { Event, Category, Media } from '@/payload-types'
import { CategoryPill } from './CategoryPill'

type Props = {
  event: Event
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export function EventCard({ event }: Props) {
  const category = typeof event.category === 'object' ? (event.category as Category) : null
  const image = typeof event.image === 'object' ? (event.image as Media) : null

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
    >
      <div className="aspect-[16/9] bg-neutral-100 relative overflow-hidden">
        {image?.url ? (
          <Image
            src={image.url}
            alt={image.alt ?? event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200">
            <span className="text-neutral-400 text-4xl" aria-hidden="true">📅</span>
          </div>
        )}
      </div>

      <div className="p-4">
        {category && (
          <div className="mb-2">
            <CategoryPill name={category.name} colour={category.colour} />
          </div>
        )}

        <h3 className="font-bold text-neutral-950 text-base leading-snug mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {event.title}
        </h3>

        <div className="flex items-center gap-3 text-sm text-neutral-500">
          {event.startDate && (
            <span>{formatDate(event.startDate)}</span>
          )}
          {event.postcode && (
            <span className="flex items-center gap-1">
              <span aria-hidden="true">📍</span>
              {event.postcode}
            </span>
          )}
        </div>

        {event.price && (
          <p className="mt-2 text-sm font-medium text-primary-600">{event.price}</p>
        )}
      </div>
    </Link>
  )
}
