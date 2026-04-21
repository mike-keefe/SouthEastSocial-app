'use client'

import Link from 'next/link'

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="font-display text-4xl font-bold text-neutral-950 mb-4">Something went wrong</h1>
      <p className="text-neutral-600 mb-8 max-w-md">
        We hit an unexpected error. Please try again — if the problem persists, the site may be temporarily unavailable.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
