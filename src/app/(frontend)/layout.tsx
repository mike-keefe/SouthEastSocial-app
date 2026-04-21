import React from 'react'
import { Toaster } from 'sonner'
import './styles.css'

export const metadata = {
  title: 'SouthEastSocial — Events for SE London',
  description: 'Discover community events, gigs, markets, and more across South East London.',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  )
}
