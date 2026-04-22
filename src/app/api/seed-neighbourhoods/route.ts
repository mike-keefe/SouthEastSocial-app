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

  // First pass: create all neighbourhoods without parent links
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

  // Second pass: wire up parent relationships
  for (const n of SE_NEIGHBOURHOODS) {
    if (!n.parent) continue
    const [child, parent] = await Promise.all([
      payload.find({ collection: 'neighbourhoods', where: { slug: { equals: n.slug } }, limit: 1 }),
      payload.find({ collection: 'neighbourhoods', where: { slug: { equals: n.parent } }, limit: 1 }),
    ])
    if (child.docs[0] && parent.docs[0] && !child.docs[0].parent) {
      await payload.update({
        collection: 'neighbourhoods',
        id: child.docs[0].id,
        data: { parent: parent.docs[0].id },
      })
      const r = results.find((r) => r.name === n.name)
      if (r) r.status = 'created + parent linked'
    }
  }

  return NextResponse.json({ ok: true, results })
}
