import { PageWrapper } from '@/components/PageWrapper'

export default function AccountLoading() {
  return (
    <div className="py-10">
      <PageWrapper>
        <div className="h-10 bg-neutral-200 rounded w-48 mb-10 animate-pulse" />
        <div className="h-7 bg-neutral-200 rounded w-36 mb-5 animate-pulse" />
        <div className="bg-white rounded-xl border border-neutral-200 divide-y divide-neutral-100 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-4">
              <div className="space-y-2">
                <div className="h-4 bg-neutral-200 rounded w-48" />
                <div className="h-3 bg-neutral-200 rounded w-24" />
              </div>
              <div className="h-5 bg-neutral-200 rounded-full w-20" />
            </div>
          ))}
        </div>
      </PageWrapper>
    </div>
  )
}
