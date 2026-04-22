import type { FC } from 'react'

type Props = {
  postcode: string
  label?: string
}

type PostcodesIOResult = {
  result: { latitude: number; longitude: number } | null
}

async function geocode(postcode: string): Promise<{ lat: number; lon: number } | null> {
  try {
    const clean = postcode.replace(/\s+/g, '').toUpperCase()
    const res = await fetch(`https://api.postcodes.io/postcodes/${clean}`, {
      next: { revalidate: 86400 }, // cache for 24h — postcodes don't move
    })
    if (!res.ok) return null
    const data: PostcodesIOResult = await res.json()
    if (!data.result) return null
    return { lat: data.result.latitude, lon: data.result.longitude }
  } catch {
    return null
  }
}

export const MapEmbed: FC<Props> = async ({ postcode, label }) => {
  const coords = await geocode(postcode)

  const mapsQuery = encodeURIComponent(`${label ? `${label}, ` : ''}${postcode}, UK`)
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`

  if (!coords) {
    return (
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-sm text-primary-500 hover:text-primary-400 transition-colors"
      >
        View on Google Maps →
      </a>
    )
  }

  const { lat, lon } = coords
  const pad = 0.006
  const bbox = `${lon - pad},${lat - pad},${lon + pad},${lat + pad}`
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`

  return (
    <div className="space-y-2">
      <div className="relative rounded overflow-hidden border border-neutral-200 dark:border-neutral-700" style={{ height: 180 }}>
        <iframe
          src={embedUrl}
          width="100%"
          height="180"
          className="absolute inset-0 w-full h-full"
          title={`Map showing ${postcode}`}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-xs text-neutral-400 hover:text-primary-500 transition-colors"
      >
        Open in Google Maps →
      </a>
    </div>
  )
}
