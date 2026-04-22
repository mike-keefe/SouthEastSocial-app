import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import { SE_NEIGHBOURHOODS } from '../lib/neighbourhoods'

async function run() {
  const payload = await getPayload({ config })

  console.log('Seeding neighbourhoods...\n')

  // First pass: create all neighbourhoods
  const createdIds: Record<string, number> = {}

  for (const n of SE_NEIGHBOURHOODS) {
    const existing = await payload.find({
      collection: 'neighbourhoods',
      where: { slug: { equals: n.slug } },
      limit: 1,
    })

    if (existing.totalDocs > 0) {
      console.log(`  skip  ${n.name}`)
      createdIds[n.slug] = existing.docs[0].id
      continue
    }

    const doc = await payload.create({
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

    createdIds[n.slug] = doc.id
    console.log(`  create  ${n.name}`)
  }

  // Second pass: wire up parent relationships
  console.log('\nLinking parent neighbourhoods...\n')
  for (const n of SE_NEIGHBOURHOODS) {
    if (!n.parent) continue
    const childId = createdIds[n.slug]
    const parentId = createdIds[n.parent]
    if (!childId || !parentId) continue

    await payload.update({
      collection: 'neighbourhoods',
      id: childId,
      data: { parent: parentId },
    })
    console.log(`  ${n.name} → ${n.parent}`)
  }

  console.log('\nDone.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
