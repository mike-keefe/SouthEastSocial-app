import Link from 'next/link'
import { PageWrapper } from '@/components/PageWrapper'
import { SE_NEIGHBOURHOODS } from '@/lib/neighbourhoods'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Areas — SouthEastSocial',
  description: 'Explore events by neighbourhood across South East London.',
}

export default function AreasPage() {
  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="border-b border-neutral-800">
        <PageWrapper>
          <div className="py-12 sm:py-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-600 mb-3">
              SE London
            </p>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-white">
              Browse by area
            </h1>
            <p className="text-neutral-500 text-sm mt-3">
              Every SE postcode neighbourhood, from SE1 to SE28.
            </p>
          </div>
        </PageWrapper>
      </div>

      <PageWrapper>
        <div className="py-10">
          {/* Featured areas */}
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-600 mb-5">
            Featured areas
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-neutral-800 mb-12">
            {SE_NEIGHBOURHOODS.filter((n) => n.featured).map((n) => (
              <Link
                key={n.slug}
                href={`/areas/${n.slug}`}
                className="group bg-neutral-950 p-6 hover:bg-neutral-900 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-400"
              >
                <p className="font-display font-bold text-xl text-neutral-700 group-hover:text-primary-400 transition-colors mb-1 tabular-nums">
                  {n.districts[0]}
                </p>
                <p className="text-[14px] font-medium text-white mb-1">{n.name}</p>
                <p className="text-[12px] text-neutral-600 line-clamp-2 group-hover:text-neutral-400 transition-colors">
                  {n.tagline}
                </p>
              </Link>
            ))}
          </div>

          {/* All areas A–Z */}
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-600 mb-5">
            All areas
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-neutral-800">
            {SE_NEIGHBOURHOODS.filter((n) => !n.featured).map((n) => (
              <Link
                key={n.slug}
                href={`/areas/${n.slug}`}
                className="group bg-neutral-950 p-5 hover:bg-neutral-900 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-400"
              >
                <p className="font-mono text-[11px] text-neutral-600 group-hover:text-primary-400 transition-colors mb-1">
                  {n.districts.join(', ')}
                </p>
                <p className="text-[13px] font-medium text-neutral-300 group-hover:text-white transition-colors">
                  {n.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
        <div className="pb-16" />
      </PageWrapper>
    </div>
  )
}
