import Link from 'next/link'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { PageWrapper } from './PageWrapper'
import { MobileNav } from './MobileNav'

export async function Navbar() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  return (
    <header className="bg-neutral-950 sticky top-0 z-30 border-b border-neutral-800/60">
      <PageWrapper>
        <div className="h-14 flex items-center justify-between gap-6">
          {/* Wordmark */}
          <Link
            href="/"
            className="font-display font-bold text-sm text-white tracking-tight shrink-0 hover:text-primary-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-sm"
          >
            SouthEastSocial
          </Link>

          {/* Nav links */}
          <nav aria-label="Main navigation" className="hidden sm:flex items-center gap-6 flex-1">
            {[
              { href: '/events', label: 'Events' },
              { href: '/venues', label: 'Venues' },
              { href: '/submit', label: 'Submit' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-neutral-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-sm"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Auth — desktop */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            {user ? (
              <Link
                href="/account"
                className="text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 px-4 py-1.5 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-950"
              >
                Account
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-neutral-400 hover:text-white transition-colors px-3 py-1.5 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 px-4 py-1.5 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-950"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          <MobileNav isLoggedIn={!!user} />
        </div>
      </PageWrapper>
    </header>
  )
}
