import Link from 'next/link'
import { PageWrapper } from './PageWrapper'

export function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-400 mt-20">
      <PageWrapper>
        <div className="py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <p className="text-white font-bold text-lg mb-2">SouthEastSocial</p>
            <p className="text-sm leading-relaxed">
              Your guide to events, gigs, markets, and community happenings across SE London.
            </p>
          </div>

          <div>
            <p className="text-white font-semibold text-sm uppercase tracking-wider mb-3">Explore</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/events" className="hover:text-white transition-colors">All Events</Link></li>
              <li><Link href="/venues" className="hover:text-white transition-colors">Venues</Link></li>
              <li><Link href="/submit" className="hover:text-white transition-colors">Submit an Event</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-white font-semibold text-sm uppercase tracking-wider mb-3">Account</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
              <li><Link href="/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
              <li><Link href="/account" className="hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 py-6 text-xs text-neutral-600 text-center">
          © {new Date().getFullYear()} SouthEastSocial. Made in SE London.
        </div>
      </PageWrapper>
    </footer>
  )
}
