import { PageWrapper } from '@/components/PageWrapper'

function Skeleton({ className }: { className?: string }) {
  return <div className={`bg-neutral-800 animate-pulse ${className ?? ''}`} />
}

export default function AreaLoading() {
  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Hero skeleton */}
      <div className="border-b border-neutral-800">
        <PageWrapper>
          <div className="py-14 sm:py-20 space-y-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-96 max-w-full" />
            <Skeleton className="h-10 w-36 mt-2" />
          </div>
        </PageWrapper>
      </div>

      <PageWrapper>
        <div className="py-10 space-y-14">
          {/* Events section skeleton */}
          <section>
            <div className="border-b border-neutral-800 pb-5 mb-6">
              <Skeleton className="h-3 w-20 mb-3" />
              <Skeleton className="h-7 w-40" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-neutral-800">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-neutral-950 aspect-[2/3]">
                  <Skeleton className="w-full h-full" />
                </div>
              ))}
            </div>
          </section>

          {/* Venues section skeleton */}
          <section>
            <div className="border-b border-neutral-800 pb-5 mb-6">
              <Skeleton className="h-3 w-16 mb-3" />
              <Skeleton className="h-7 w-48" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-neutral-800">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-neutral-950 p-5 flex gap-4">
                  <Skeleton className="w-14 h-14 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </PageWrapper>
    </div>
  )
}
