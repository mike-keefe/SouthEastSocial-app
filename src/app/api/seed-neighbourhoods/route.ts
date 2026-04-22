import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SE_NEIGHBOURHOODS } from '@/lib/neighbourhoods'

export async function POST() {
  const payload = await getPayload({ config })

  const me = await payload.auth({ headers: new Headers() })
  if (!me?.user || me.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const results: { name: string; status: string }[] = []

  for (const n of SE_NEIGHBOURHOODS) {
    const existing = await payload.find({
      collection: 'neighbourhoods',
      where: { slug: { equals: n.slug } },
      limit: 1,
    })

    if (existing.totalDocs > 0) {
      results.push({ name: n.name, status: 'skipped (already exists)' })
      continue
    }

    await payload.create({
      collection: 'neighbourhoods',
      data: {
        name: n.name,
        slug: n.slug,
        tagline: n.tagline,
        postcodeDistricts: n.districts.map((d) => ({ district: d })),
        featured: n.featured,
        sortOrder: n.sortOrder,
      },
    })

    results.push({ name: n.name, status: 'created' })
  }

  return NextResponse.json({ ok: true, results })
}
