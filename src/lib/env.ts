import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  PAYLOAD_SECRET: z.string().min(1, 'PAYLOAD_SECRET is required'),
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required'),
  RESEND_FROM_EMAIL: z.string().email('RESEND_FROM_EMAIL must be a valid email'),
  NEXT_PUBLIC_SERVER_URL: z.string().url('NEXT_PUBLIC_SERVER_URL must be a valid URL').optional(),
  BLOB_READ_WRITE_TOKEN: z.string().optional(),
  DIGEST_SECRET: z.string().min(1, 'DIGEST_SECRET is required'),
  ADMIN_EMAIL: z.string().email('ADMIN_EMAIL must be a valid email').optional(),
})

function validateEnv() {
  const result = envSchema.safeParse(process.env)

  if (!result.success) {
    const missing = result.error.issues.map((i) => `  • ${i.path.join('.')}: ${i.message}`)
    console.error('❌ Invalid environment variables:\n' + missing.join('\n'))
    // In production, crash fast. In test/CI, warn only.
    if (process.env.NODE_ENV === 'production') {
      process.exit(1)
    }
  }

  return result.data ?? (process.env as unknown as z.infer<typeof envSchema>)
}

export const env = validateEnv()
