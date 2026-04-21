'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

type Props = {
  isLoggedIn: boolean
}

export function MobileNav({ isLoggedIn }: Props) {
  const [open, setOpen] = useState(false)

  // Close on route change / escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        className="sm:hidden p-2 -mr-2 rounded-lg text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Drawer overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 sm:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm" />
        </div>
      )}

      {/* Drawer panel */}
      <nav
        aria-label="Mobile navigation"
        className={`fixed top-16 right-0 bottom-0 z-50 w-72 bg-white shadow-2xl flex flex-col transition-transform duration-200 sm:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-1">
          {[
            { href: '/events', label: 'Events' },
            { href: '/venues', label: 'Venues' },
            { href: '/submit', label: 'Submit an event' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block px-3 py-3 text-base font-medium text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 rounded-lg transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="border-t border-neutral-100 px-6 py-6 space-y-3">
          {isLoggedIn ? (
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="block w-full text-center bg-neutral-950 text-white font-semibold px-4 py-3 rounded-xl transition-colors hover:bg-neutral-800"
            >
              My account
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block w-full text-center border border-neutral-200 text-neutral-700 font-semibold px-4 py-3 rounded-xl transition-colors hover:border-neutral-400"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="block w-full text-center bg-primary-500 text-white font-semibold px-4 py-3 rounded-xl transition-colors hover:bg-primary-600"
              >
                Sign up free
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  )
}
