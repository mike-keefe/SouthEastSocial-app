import 'dotenv/config'
import { getPayload } from 'payload'
import config from './payload.config'

async function seed() {
  const payload = await getPayload({ config })

  console.log('🌱 Seeding database...')

  // -----------------------------------------------------------------------
  // Categories
  // -----------------------------------------------------------------------
  const music = await payload.create({
    collection: 'categories',
    data: { name: 'Music', slug: 'music', colour: '#6366f1' },
  })

  const community = await payload.create({
    collection: 'categories',
    data: { name: 'Community', slug: 'community', colour: '#10b981' },
  })

  const arts = await payload.create({
    collection: 'categories',
    data: { name: 'Arts & Culture', slug: 'arts-culture', colour: '#f59e0b' },
  })

  console.log('✓ Categories created')

  // -----------------------------------------------------------------------
  // Venues
  // -----------------------------------------------------------------------
  const venue1 = await payload.create({
    collection: 'venues',
    data: {
      name: 'The Bussey Building',
      slug: 'the-bussey-building',
      status: 'published',
      address: '133 Rye Lane',
      postcode: 'SE15 4ST',
      website: 'https://www.clfartclub.com',
    },
  })

  const venue2 = await payload.create({
    collection: 'venues',
    data: {
      name: 'New Cross Inn',
      slug: 'new-cross-inn',
      status: 'published',
      address: '323 New Cross Road',
      postcode: 'SE14 6AS',
      website: 'https://www.newcrossinn.com',
    },
  })

  const venue3 = await payload.create({
    collection: 'venues',
    data: {
      name: 'Deptford Market Yard',
      slug: 'deptford-market-yard',
      status: 'published',
      address: 'Deptford Market Yard, Deptford High Street',
      postcode: 'SE8 4BX',
    },
  })

  console.log('✓ Venues created')

  // -----------------------------------------------------------------------
  // Organisers
  // -----------------------------------------------------------------------
  const organiser1 = await payload.create({
    collection: 'organisers',
    data: {
      name: 'Peckham Audio Collective',
      slug: 'peckham-audio-collective',
      status: 'published',
      website: 'https://example.com',
    },
  })

  const organiser2 = await payload.create({
    collection: 'organisers',
    data: {
      name: 'SE Social Club',
      slug: 'se-social-club',
      status: 'published',
    },
  })

  console.log('✓ Organisers created')

  // -----------------------------------------------------------------------
  // Admin user
  // -----------------------------------------------------------------------
  const adminEmail = 'admin@southeastsocial.local'
  const adminPassword = 'Admin1234!'

  const admin = await payload.create({
    collection: 'users',
    data: {
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      displayName: 'Site Admin',
    },
  })

  // -----------------------------------------------------------------------
  // Member user
  // -----------------------------------------------------------------------
  const memberEmail = 'member@southeastsocial.local'
  const memberPassword = 'Member1234!'

  const member = await payload.create({
    collection: 'users',
    data: {
      email: memberEmail,
      password: memberPassword,
      role: 'member',
      displayName: 'Alex Turner',
    },
  })

  console.log('✓ Users created')

  // -----------------------------------------------------------------------
  // Events
  // -----------------------------------------------------------------------
  const nextMonth = (offsetDays: number) => {
    const d = new Date()
    d.setDate(d.getDate() + offsetDays)
    return d.toISOString()
  }

  await payload.create({
    collection: 'events',
    data: {
      title: 'Peckham Plex: Afrobeats & Amapiano Night',
      slug: 'peckham-plex-afrobeats-amapiano-night',
      status: 'published',
      description: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Join us for a night of Afrobeats and Amapiano at The Bussey Building. Resident DJs and special guests from across the UK and West Africa. Doors open 9pm, music until 3am.',
                  version: 1,
                },
              ],
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      category: music.id,
      venue: venue1.id,
      organiser: organiser1.id,
      postcode: 'SE15 4ST',
      startDate: nextMonth(14),
      price: '£8 advance / £12 door',
      ticketUrl: 'https://example.com/tickets',
      submittedBy: admin.id,
    },
  })

  await payload.create({
    collection: 'events',
    data: {
      title: 'New Cross Indie Night: Local Bands Showcase',
      slug: 'new-cross-indie-night-local-bands-showcase',
      status: 'published',
      description: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Five local bands take to the stage at New Cross Inn for a night of indie, post-punk and noise-pop. All proceeds go to the South London Music Fund.',
                  version: 1,
                },
              ],
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      category: music.id,
      venue: venue2.id,
      postcode: 'SE14 6AS',
      startDate: nextMonth(7),
      price: '£5',
      submittedBy: admin.id,
    },
  })

  await payload.create({
    collection: 'events',
    data: {
      title: 'Deptford Market: Spring Community Fair',
      slug: 'deptford-market-spring-community-fair',
      status: 'published',
      description: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'A celebration of Deptford\'s community spirit. Local makers, food traders, live music, and activities for kids. Free entry, all welcome.',
                  version: 1,
                },
              ],
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      category: community.id,
      venue: venue3.id,
      organiser: organiser2.id,
      postcode: 'SE8 4BX',
      startDate: nextMonth(21),
      price: 'Free',
      submittedBy: member.id,
    },
  })

  await payload.create({
    collection: 'events',
    data: {
      title: 'Bermondsey Open Studios',
      slug: 'bermondsey-open-studios',
      status: 'published',
      description: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Over 40 artists open their studios across Bermondsey for a weekend of painting, sculpture, photography, and ceramics. A rare chance to see work in progress and buy directly from makers.',
                  version: 1,
                },
              ],
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      category: arts.id,
      postcode: 'SE1 3PA',
      startDate: nextMonth(28),
      price: 'Free',
      submittedBy: member.id,
    },
  })

  await payload.create({
    collection: 'events',
    data: {
      title: 'SE15 Residents Forum: Housing & Green Spaces',
      slug: 'se15-residents-forum-housing-green-spaces',
      status: 'published',
      description: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'A community forum for SE15 residents to discuss local housing developments and the future of green spaces in the area. Hosted by SE Social Club. Everyone welcome — bring your questions.',
                  version: 1,
                },
              ],
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      category: community.id,
      venue: venue1.id,
      organiser: organiser2.id,
      postcode: 'SE15 4ST',
      startDate: nextMonth(10),
      price: 'Free',
      submittedBy: member.id,
    },
  })

  console.log('✓ Events created')
  console.log('')
  console.log('✅ Seed complete!')
  console.log('')
  console.log('Admin credentials:')
  console.log(`  Email:    ${adminEmail}`)
  console.log(`  Password: ${adminPassword}`)
  console.log('')
  console.log('Member credentials:')
  console.log(`  Email:    ${memberEmail}`)
  console.log(`  Password: ${memberPassword}`)

  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
