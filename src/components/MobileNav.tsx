'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

type Props = {
  isLoggedIn: boolean
}

export function MobileNav({ isLoggedIn }: Props) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

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
        className="sm:hidden p-2 -mr-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 sm:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        </div>
      )}

      <nav
        aria-label="Mobile navigation"
        className={`fixed top-14 right-0 bottom-0 z-50 w-64 bg-neutral-950 border-l border-neutral-800 flex flex-col transition-transform duration-200 sm:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-0.5">
          {[
            { href: '/events', label: 'Events' },
            { href: '/venues', label: 'Venues' },
            { href: '/submit', label: 'Submit an event' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="border-t border-neutral-800 px-4 py-5 space-y-2">
          {isLoggedIn ? (
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="block w-full text-center bg-primary-600 hover:bg-primary-500 text-white font-semibold px-4 py-2.5 rounded transition-colors text-sm"
            >
              My account
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block w-full text-center border border-neutral-700 text-neutral-300 font-medium px-4 py-2.5 rounded transition-colors hover:border-neutral-500 hover:text-white text-sm"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="block w-full text-center bg-primary-600 hover:bg-primary-500 text-white font-semibold px-4 py-2.5 rounded transition-colors text-sm"
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
