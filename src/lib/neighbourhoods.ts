// Static neighbourhood data for all SE London postcode districts.
// This is the canonical source used for seeding and for postcode→area lookups.
// The Payload 'neighbourhoods' collection is the live/editable version of this data.

export type NeighbourhoodSeed = {
  name: string
  slug: string
  tagline: string
  districts: string[]   // SE postcode districts, e.g. ['SE15']
  parent?: string       // slug of parent neighbourhood (for sub-areas)
  featured: boolean
  sortOrder: number
}

export const SE_NEIGHBOURHOODS: NeighbourhoodSeed[] = [
  {
    name: 'Borough & Southwark',
    slug: 'borough',
    tagline: 'Borough Market, the Thames, and centuries of history.',
    districts: ['SE1'],
    featured: true,
    sortOrder: 1,
  },
  {
    name: 'Abbey Wood',
    slug: 'abbey-wood',
    tagline: 'Green spaces and the Elizabeth line.',
    districts: ['SE2'],
    featured: false,
    sortOrder: 2,
  },
  {
    name: 'Blackheath',
    slug: 'blackheath',
    tagline: 'The heath, the village, the Sunday afternoon.',
    districts: ['SE3'],
    featured: false,
    sortOrder: 3,
  },
  {
    name: 'Brockley',
    slug: 'brockley',
    tagline: 'Independent cafés, Victorian terraces, and a creative community.',
    districts: ['SE4'],
    featured: true,
    sortOrder: 4,
  },
  {
    name: 'Camberwell',
    slug: 'camberwell',
    tagline: 'Art school energy, street food, and a proper local scene.',
    districts: ['SE5'],
    featured: true,
    sortOrder: 5,
  },
  {
    name: 'Catford',
    slug: 'catford',
    tagline: 'An area on the up, with soul to spare.',
    districts: ['SE6'],
    featured: false,
    sortOrder: 6,
  },
  {
    name: 'Charlton',
    slug: 'charlton',
    tagline: 'Thames-side, underrated, and quietly brilliant.',
    districts: ['SE7'],
    featured: false,
    sortOrder: 7,
  },
  {
    name: 'Deptford',
    slug: 'deptford',
    tagline: 'Artists, markets, and raw creative energy.',
    districts: ['SE8'],
    featured: true,
    sortOrder: 8,
  },
  {
    name: 'Eltham',
    slug: 'eltham',
    tagline: 'A royal palace and a strong community spirit.',
    districts: ['SE9'],
    featured: false,
    sortOrder: 9,
  },
  {
    name: 'Greenwich',
    slug: 'greenwich',
    tagline: 'The meridian, the market, and one of London\'s finest parks.',
    districts: ['SE10'],
    featured: true,
    sortOrder: 10,
  },
  {
    name: 'Kennington',
    slug: 'kennington',
    tagline: 'Close to the centre, but with a village feel.',
    districts: ['SE11'],
    featured: false,
    sortOrder: 11,
  },
  {
    name: 'Lee',
    slug: 'lee',
    tagline: 'Leafy and laid-back, with a growing food scene.',
    districts: ['SE12'],
    featured: false,
    sortOrder: 12,
  },
  {
    name: 'Lewisham',
    slug: 'lewisham',
    tagline: 'Diverse, vibrant, and proudly itself.',
    districts: ['SE13'],
    featured: true,
    sortOrder: 13,
  },
  {
    name: 'New Cross',
    slug: 'new-cross',
    tagline: 'Goldsmith\'s, gig venues, and late-night energy.',
    districts: ['SE14'],
    featured: true,
    sortOrder: 14,
  },
  {
    name: 'Peckham',
    slug: 'peckham',
    tagline: 'Rooftop bars, record shops, and the heartbeat of SE London.',
    districts: ['SE15'],
    featured: true,
    sortOrder: 15,
  },
  {
    name: 'Rotherhithe',
    slug: 'rotherhithe',
    tagline: 'Dockside heritage and a tight-knit riverside community.',
    districts: ['SE16'],
    featured: false,
    sortOrder: 16,
  },
  {
    name: 'Walworth',
    slug: 'walworth',
    tagline: 'East Street Market and a changing urban landscape.',
    districts: ['SE17'],
    featured: false,
    sortOrder: 17,
  },
  {
    name: 'Woolwich',
    slug: 'woolwich',
    tagline: 'Arsenal heritage, the Ferry, and riverside regeneration.',
    districts: ['SE18'],
    featured: false,
    sortOrder: 18,
  },
  {
    name: 'Crystal Palace',
    slug: 'crystal-palace',
    tagline: 'High on the hill, with panoramic views and a buzzing food scene.',
    districts: ['SE19'],
    featured: true,
    sortOrder: 19,
  },
  {
    name: 'Penge',
    slug: 'penge',
    tagline: 'Quietly cool and increasingly on the radar.',
    districts: ['SE20'],
    featured: false,
    sortOrder: 20,
  },
  {
    name: 'Dulwich',
    slug: 'dulwich',
    tagline: 'The gallery, the park, the village green.',
    districts: ['SE21'],
    featured: true,
    sortOrder: 21,
  },
  {
    name: 'East Dulwich',
    slug: 'east-dulwich',
    tagline: 'Lordship Lane delis, independent cinema, and Saturday morning energy.',
    districts: ['SE22'],
    featured: true,
    sortOrder: 22,
  },
  {
    name: 'Forest Hill',
    slug: 'forest-hill',
    tagline: 'The Horniman, the pool, and a thriving local community.',
    districts: ['SE23'],
    featured: false,
    sortOrder: 23,
  },
  {
    name: 'Honor Oak',
    slug: 'honor-oak',
    tagline: 'A quiet village feel tucked between Brockley and Forest Hill.',
    districts: ['SE23'],
    parent: 'forest-hill',
    featured: false,
    sortOrder: 23.5,
  },
  {
    name: 'Herne Hill',
    slug: 'herne-hill',
    tagline: 'Sunday market, cycling culture, and excellent coffee.',
    districts: ['SE24'],
    featured: true,
    sortOrder: 24,
  },
  {
    name: 'South Norwood',
    slug: 'south-norwood',
    tagline: 'Unassuming and authentic, with hidden gems.',
    districts: ['SE25'],
    featured: false,
    sortOrder: 25,
  },
  {
    name: 'Sydenham',
    slug: 'sydenham',
    tagline: 'Forest on the doorstep, neighbourhood at its best.',
    districts: ['SE26'],
    featured: false,
    sortOrder: 26,
  },
  {
    name: 'West Norwood',
    slug: 'west-norwood',
    tagline: 'Cemetery walks, independent shops, and a strong community.',
    districts: ['SE27'],
    featured: false,
    sortOrder: 27,
  },
  {
    name: 'Thamesmead',
    slug: 'thamesmead',
    tagline: 'Brutalist architecture, waterways, and a community in transition.',
    districts: ['SE28'],
    featured: false,
    sortOrder: 28,
  },
]

// Build a lookup map: uppercased district → neighbourhood slug + name
const _districtToSlug = new Map<string, { slug: string; name: string }>()
for (const n of SE_NEIGHBOURHOODS) {
  if (n.parent) continue  // sub-areas don't own the district — the parent does
  for (const d of n.districts) {
    _districtToSlug.set(d.toUpperCase(), { slug: n.slug, name: n.name })
  }
}

export function getNeighbourhoodByDistrict(district: string) {
  return _districtToSlug.get(district.toUpperCase()) ?? null
}

export function getNeighbourhoodBySlug(slug: string) {
  return SE_NEIGHBOURHOODS.find((n) => n.slug === slug) ?? null
}

/** Returns true if the string looks like an SE postcode district (e.g. "SE15", "se4") */
export function isPostcodeDistrict(s: string) {
  return /^SE\d{1,2}$/i.test(s.trim())
}
