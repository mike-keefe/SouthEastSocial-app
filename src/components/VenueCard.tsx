import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Building2 } from 'lucide-react'
import type { Venue, Media } from '@/payload-types'

type Props = { venue: Venue }

export function VenueCard({ venue }: Props) {
  const image = typeof venue.image === 'object' ? (venue.image as Media) : null

  return (
    <Link
      href={`/venues/${venue.slug}`}
      className="group relative block aspect-[16/9] overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-neutral-950"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-neutral-900">
        {image?.url ? (
          <Image
            src={image.url}
            alt={image.alt ?? venue.name}
            fill
            className="object-cover opacity-60 group-hover:opacity-75 group-hover:scale-[1.03] transition-all duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              <Building2 size={36} className="text-neutral-700" aria-hidden="true" />
            </div>
            <span className="sr-only">{venue.name}</span>
          </>
        )}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <h3 className="font-display font-bold text-white text-base leading-tight group-hover:text-primary-300 transition-colors">
          {venue.name}
        </h3>
        {(venue.address || venue.postcode) && (
          <p className="text-neutral-400 text-[11px] flex items-center gap-1 mt-1">
            <MapPin size={9} aria-hidden="true" />
            {venue.address ?? venue.postcode}
          </p>
        )}
      </div>

      {/* Hover border */}
      <div className="absolute inset-0 ring-1 ring-inset ring-white/0 group-hover:ring-primary-400/20 transition-all duration-300" />
    </Link>
  )
}
