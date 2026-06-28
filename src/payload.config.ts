import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { collections } from './collections'
import { globals } from './globals'
import { ADMIN_ROUTE } from './lib/admin-route'
import { PAYLOAD_COOKIE_PREFIX } from './lib/payload-cookie'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
    suppressHydrationWarning: true,
    theme: 'all',
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      afterNavLinks: ['@/components/admin/AdminNavShortcuts#AdminNavShortcuts'],
      views: {
        dashboard: {
          Component: '@/components/admin/PlusMITDashboard#PlusMITDashboard',
        },
        visualComposer: {
          Component: '@/components/admin/VisualComposer#VisualComposer',
          path: '/visual-composer',
          exact: true,
          meta: {
            title: 'Visual Composer - PlusMIT CMS',
          },
        },
      },
    },
    meta: {
      titleSuffix: '- PlusMIT CMS',
    },
  },
  routes: {
    admin: ADMIN_ROUTE,
  },
  cookiePrefix: PAYLOAD_COOKIE_PREFIX,
  collections,
  globals,
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || 'development-only-change-me',
  typescript: {
    outputFile: path.resolve(dirname, 'types/payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  sharp,
  upload: {
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  },
})
