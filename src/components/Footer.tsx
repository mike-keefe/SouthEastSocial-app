import Link from 'next/link'
import { PageWrapper } from './PageWrapper'

export function Footer() {
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
                { label: 'Peckham', postcode: 'SE15' },
                { label: 'Deptford', postcode: 'SE8' },
                { label: 'New Cross', postcode: 'SE14' },
                { label: 'Bermondsey', postcode: 'SE1' },
                { label: 'Camberwell', postcode: 'SE5' },
                { label: 'Lewisham', postcode: 'SE13' },
              ].map(({ label, postcode }) => (
                <li key={label}>
                  <Link
                    href={`/events?postcode=${encodeURIComponent(postcode)}`}
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
              {[
                { href: '/login', label: 'Log in' },
                { href: '/signup', label: 'Sign up' },
                { href: '/account', label: 'Dashboard' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
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
