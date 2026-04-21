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
      className="group relative block aspect-[4/3] rounded overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-950"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-950">
        {image?.url ? (
          <Image
            src={image.url}
            alt={image.alt ?? venue.name}
            fill
            className="object-cover opacity-65 group-hover:opacity-80 group-hover:scale-[1.03] transition-all duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Building2 size={40} className="text-neutral-700" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <h3 className="font-display font-bold text-white text-base leading-snug mb-1.5 group-hover:text-primary-300 transition-colors">
          {venue.name}
        </h3>
        {(venue.address || venue.postcode) && (
          <p className="text-neutral-400 text-xs flex items-center gap-1">
            <MapPin size={10} aria-hidden="true" />
            {venue.address ?? venue.postcode}
          </p>
        )}
      </div>

      <div className="absolute inset-0 rounded ring-1 ring-white/0 group-hover:ring-white/10 transition-all duration-200" />
    </Link>
  )
}
