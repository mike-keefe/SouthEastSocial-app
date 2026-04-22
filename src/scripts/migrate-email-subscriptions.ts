/**
 * One-time migration: copies EmailSubscriptions preference flags onto each User's
 * emailPreferences group field, then reports how many records were updated.
 *
 * Run BEFORE deleting the email-subscriptions collection from the database.
 *
 * Usage:
 *   npx tsx src/scripts/migrate-email-subscriptions.ts
 *
 * Requires DATABASE_URL and PAYLOAD_SECRET to be set in the environment (or .env).
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

async function run() {
  const payload = await getPayload({ config })

  // Temporarily query the old collection directly via db to avoid needing it in config.
  // We use the raw db adapter here because the collection has been removed from config.
  const db = payload.db as unknown as {
    drizzle: { execute: (sql: unknown) => Promise<{ rows: unknown[] }> }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await (payload.db as any).drizzle.execute(
    `SELECT id, user_id, weekly_digest, event_approved, welcome_email FROM email_subscriptions`,
  )

  const rows = result.rows ?? result ?? []
  console.log(`Found ${rows.length} EmailSubscriptions records to migrate`)

  let updated = 0
  let skipped = 0

  for (const row of rows) {
    const userId = row.user_id
    if (!userId) { skipped++; continue }

    try {
      await payload.update({
        collection: 'users',
        id: userId,
        data: {
          emailPreferences: {
            weeklyDigest: row.weekly_digest ?? true,
            eventApproved: row.event_approved ?? true,
            welcomeEmail: row.welcome_email ?? true,
          },
        },
        overrideAccess: true,
      })
      updated++
    } catch (err) {
      console.error(`Failed to update user ${userId}:`, err)
      skipped++
    }
  }

  console.log(`Migration complete — updated: ${updated}, skipped: ${skipped}`)
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
