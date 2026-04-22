import Link from 'next/link'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { PageWrapper } from './PageWrapper'
import { LogoutButton } from './LogoutButton'

export async function Footer() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })
  const year = new Date().getFullYear()

  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 text-neutral-400">
      <PageWrapper>
        <div className="py-12 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <p className="font-display font-bold text-white text-sm tracking-tight mb-2">
              <span className="text-primary-400">SE</span>Social
            </p>
            <p className="text-xs leading-relaxed text-neutral-500 max-w-[180px]">
              Events, gigs, markets, and culture across South East London.
            </p>
          </div>

          {/* Explore */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-600 mb-4">
              Explore
            </p>
            <ul className="space-y-2.5 text-[13px]">
              {[
                { href: '/events', label: 'All events' },
                { href: '/venues', label: 'Venues' },
                { href: '/organisers', label: 'Organisers' },
                { href: '/submit', label: 'Submit an event' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-600 mb-4">
              Areas
            </p>
            <ul className="space-y-2.5 text-[13px]">
              {[
                { label: 'Peckham', slug: 'peckham' },
                { label: 'Deptford', slug: 'deptford' },
                { label: 'New Cross', slug: 'new-cross' },
                { label: 'Borough & Southwark', slug: 'borough' },
                { label: 'Camberwell', slug: 'camberwell' },
                { label: 'Lewisham', slug: 'lewisham' },
              ].map(({ label, slug }) => (
                <li key={slug}>
                  <Link
                    href={`/areas/${slug}`}
                    className="hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-600 mb-4">
              Account
            </p>
            <ul className="space-y-2.5 text-[13px]">
              {user ? (
                <>
                  <li>
                    <Link href="/account" className="hover:text-white transition-colors">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <LogoutButton className="hover:text-white transition-colors" />
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/login" className="hover:text-white transition-colors">
                      Log in
                    </Link>
                  </li>
                  <li>
                    <Link href="/signup" className="hover:text-white transition-colors">
                      Sign up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-neutral-700">
          <span>© {year} SouthEastSocial</span>
          <span>Made in SE London</span>
        </div>
      </PageWrapper>
    </footer>
  )
}
