import Link from 'next/link'
import { PageWrapper } from './PageWrapper'

export function Footer() {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-800/60 text-neutral-400">
      <PageWrapper>
        <div className="py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <p className="font-display font-bold text-white text-sm mb-3 tracking-tight">
              SouthEastSocial
            </p>
            <p className="text-sm leading-relaxed text-neutral-500">
              Events, gigs, markets, and community happenings across SE London.
            </p>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 mb-3">
              Explore
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/events" className="hover:text-white transition-colors">
                  All Events
                </Link>
              </li>
              <li>
                <Link href="/venues" className="hover:text-white transition-colors">
                  Venues
                </Link>
              </li>
              <li>
                <Link href="/submit" className="hover:text-white transition-colors">
                  Submit an Event
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 mb-3">
              Account
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-white transition-colors">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800/60 py-5 text-xs text-neutral-700 text-center">
          © {new Date().getFullYear()} SouthEastSocial. Made in SE London.
        </div>
      </PageWrapper>
    </footer>
  )
}
