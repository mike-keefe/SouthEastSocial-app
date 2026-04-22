import Link from 'next/link'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { PageWrapper } from './PageWrapper'
import { MobileNav } from './MobileNav'
import { LogoutButton } from './LogoutButton'

const NAV_LINKS = [
  { href: '/events', label: 'Events' },
  { href: '/venues', label: 'Venues' },
  { href: '/organisers', label: 'Organisers' },
]

export async function Navbar() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })
  const isAdmin = (user as { role?: string } | null)?.role === 'admin'

  return (
    <header className="bg-neutral-950 sticky top-0 z-30 border-b border-neutral-800">
      <PageWrapper>
        <div className="h-14 flex items-center gap-8">
          {/* Wordmark */}
          <Link
            href="/"
            className="font-display font-bold text-sm tracking-tight shrink-0 focus:outline-none focus:ring-2 focus:ring-primary-400"
          >
            <span className="text-primary-400">SE</span>
            <span className="text-white">Social</span>
          </Link>

          {/* Nav links */}
          <nav aria-label="Main navigation" className="hidden sm:flex items-center gap-0.5 flex-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-3 py-1.5 text-[13px] font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Auth — desktop */}
          <div className="hidden sm:flex items-center gap-1.5 shrink-0 ml-auto">
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin-tools/pending"
                    className="text-[11px] font-bold text-primary-400 border border-primary-400/25 hover:border-primary-400/60 hover:bg-primary-400/10 px-3 py-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400"
                  >
                    Pending
                  </Link>
                )}
                <Link
                  href="/account"
                  className="text-[13px] text-neutral-400 hover:text-white px-3 py-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400"
                >
                  Account
                </Link>
                <LogoutButton className="text-[13px] text-neutral-600 hover:text-neutral-400 px-3 py-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400" />
                <Link
                  href="/submit"
                  className="text-[12px] font-bold text-black bg-primary-400 hover:bg-primary-300 px-4 py-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 ml-1"
                >
                  + Submit
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-[13px] text-neutral-400 hover:text-white px-3 py-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="text-[13px] text-neutral-300 border border-neutral-700 hover:border-neutral-500 hover:text-white px-3 py-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400"
                >
                  Sign up
                </Link>
                <Link
                  href="/submit"
                  className="text-[12px] font-bold text-black bg-primary-400 hover:bg-primary-300 px-4 py-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 ml-1"
                >
                  + Submit
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
