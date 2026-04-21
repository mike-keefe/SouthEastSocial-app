import nextConfig from 'eslint-config-next'

export default [
  ...nextConfig,
  {
    ignores: ['.next/', 'src/payload-types.ts', 'src/payload-generated-schema.ts'],
  },
]
