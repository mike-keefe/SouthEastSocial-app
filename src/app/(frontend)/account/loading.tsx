import { PageWrapper } from '@/components/PageWrapper'

export default function AccountLoading() {
  return (
    <div className="bg-neutral-950 min-h-screen">
      <div className="border-b border-neutral-800">
        <PageWrapper>
          <div className="py-10">
            <div className="h-3 bg-neutral-800 w-16 mb-3 animate-pulse" />
            <div className="h-8 bg-neutral-800 w-40 animate-pulse" />
          </div>
        </PageWrapper>
      </div>
      <PageWrapper>
        <div className="py-6">
          <div className="border border-neutral-800 divide-y divide-neutral-800 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-4">
                <div className="space-y-2">
                  <div className="h-4 bg-neutral-800 w-48" />
                  <div className="h-3 bg-neutral-800 w-24" />
                </div>
                <div className="h-4 bg-neutral-800 w-16" />
              </div>
            ))}
          </div>
        </div>
      </PageWrapper>
    </div>
  )
}
