import Link from 'next/link'
import { PageWrapper } from '@/components/PageWrapper'

export default function NotFound() {
  return (
    <div className="bg-neutral-950 min-h-screen flex items-center">
      <PageWrapper>
        <div className="max-w-lg mx-auto text-center py-24">
          <p className="font-display text-8xl font-bold text-primary-400 mb-4">404</p>
          <h1 className="font-display text-3xl font-bold text-white mb-4">
            Page not found
          </h1>
          <p className="text-neutral-500 mb-10 text-lg leading-relaxed">
            This page doesn&apos;t exist — it may have been moved or the link might be wrong.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/events"
              className="bg-primary-400 hover:bg-primary-300 text-black font-bold px-6 py-3 transition-colors"
            >
              Browse events
            </Link>
            <Link
              href="/"
              className="border border-neutral-700 hover:border-neutral-500 text-neutral-300 hover:text-white font-semibold px-6 py-3 transition-colors"
            >
              Go home
            </Link>
          </div>
        </div>
      </PageWrapper>
    </div>
  )
}
