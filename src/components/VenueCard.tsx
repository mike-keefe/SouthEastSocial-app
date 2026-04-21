import Image from 'next/image'
import Link from 'next/link'
import type { Venue, Media } from '@/payload-types'

type Props = {
  venue: Venue
}

export function VenueCard({ venue }: Props) {
  const image = typeof venue.image === 'object' ? (venue.image as Media) : null

  return (
    <Link
      href={`/venues/${venue.slug}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
    >
      <div className="aspect-[16/9] bg-neutral-100 relative overflow-hidden">
        {image?.url ? (
          <Image
            src={image.url}
            alt={image.alt ?? venue.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200">
            <span className="text-neutral-400 text-4xl" aria-hidden="true">🏛️</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-neutral-950 text-base leading-snug mb-1 group-hover:text-primary-600 transition-colors">
          {venue.name}
        </h3>
        {venue.postcode && (
          <p className="text-sm text-neutral-500 flex items-center gap-1">
            <span aria-hidden="true">📍</span>
            {venue.address ? `${venue.address}, ${venue.postcode}` : venue.postcode}
          </p>
        )}
      </div>
    </Link>
  )
}
