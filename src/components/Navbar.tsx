import Link from 'next/link'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { PageWrapper } from './PageWrapper'

export async function Navbar() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-30">
      <PageWrapper>
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="font-bold text-xl text-neutral-950 hover:text-primary-600 transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
          >
            SouthEastSocial
          </Link>

          {/* Nav links */}
          <nav aria-label="Main navigation" className="hidden sm:flex items-center gap-6">
            <Link
              href="/events"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-950 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
            >
              Events
            </Link>
            <Link
              href="/venues"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-950 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
            >
              Venues
            </Link>
            <Link
              href="/submit"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-950 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
            >
              Submit Event
            </Link>
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <Link
                href="/account"
                className="text-sm font-medium bg-neutral-950 text-white px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Account
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-neutral-600 hover:text-neutral-950 transition-colors px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-medium bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </PageWrapper>

      {/* Mobile nav */}
      <div className="sm:hidden border-t border-neutral-100">
        <PageWrapper>
          <nav aria-label="Mobile navigation" className="flex gap-4 py-2">
            <Link href="/events" className="text-sm text-neutral-600 hover:text-neutral-950 py-1">Events</Link>
            <Link href="/venues" className="text-sm text-neutral-600 hover:text-neutral-950 py-1">Venues</Link>
            <Link href="/submit" className="text-sm text-neutral-600 hover:text-neutral-950 py-1">Submit</Link>
          </nav>
        </PageWrapper>
      </div>
    </header>
  )
}
