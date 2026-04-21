import Link from 'next/link'
import { PageWrapper } from '@/components/PageWrapper'

export default function NotFound() {
  return (
    <div className="py-24">
      <PageWrapper>
        <div className="max-w-lg mx-auto text-center">
          <p className="font-display text-8xl font-bold text-primary-500 mb-4">404</p>
          <h1 className="font-display text-3xl font-bold text-neutral-950 mb-4">
            Page not found
          </h1>
          <p className="text-neutral-500 mb-10 text-lg leading-relaxed">
            This page doesn&apos;t exist — it may have been moved or the link might be wrong.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/events"
              className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Browse events
            </Link>
            <Link
              href="/"
              className="bg-white border border-neutral-200 hover:border-neutral-400 text-neutral-700 font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Go home
            </Link>
          </div>
        </div>
      </PageWrapper>
    </div>
  )
}
