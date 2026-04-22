import { PageWrapper } from '@/components/PageWrapper'

function SkeletonCard() {
  return (
    <div className="bg-neutral-900 overflow-hidden animate-pulse">
      <div className="aspect-[16/9] bg-neutral-800" />
    </div>
  )
}

export default function VenuesLoading() {
  return (
    <div className="bg-neutral-950 min-h-screen">
      <div className="border-b border-neutral-800">
        <PageWrapper>
          <div className="py-10">
            <div className="h-3 bg-neutral-800 w-24 mb-3 animate-pulse" />
            <div className="h-8 bg-neutral-800 w-36 animate-pulse" />
          </div>
        </PageWrapper>
      </div>
      <PageWrapper>
        <div className="py-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-neutral-800">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </PageWrapper>
    </div>
  )
}
