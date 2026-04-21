import { PageWrapper } from '@/components/PageWrapper'

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-[16/9] bg-neutral-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-neutral-200 rounded w-1/4" />
        <div className="h-5 bg-neutral-200 rounded w-3/4" />
        <div className="h-4 bg-neutral-200 rounded w-1/2" />
      </div>
    </div>
  )
}

export default function EventsLoading() {
  return (
    <div className="py-10">
      <PageWrapper>
        <div className="h-9 bg-neutral-200 rounded w-32 mb-6 animate-pulse" />
        <div className="h-14 bg-neutral-200 rounded-xl mb-8 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </PageWrapper>
    </div>
  )
}
