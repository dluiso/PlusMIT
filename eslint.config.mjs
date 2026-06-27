import next from 'eslint-config-next'

const eslintConfig = [
  ...next,
  {
    ignores: ['.next/**', 'node_modules/**', 'media/**', 'backups/**', 'payload-types.ts', 'src/types/payload-types.ts'],
  },
]

export default eslintConfig
