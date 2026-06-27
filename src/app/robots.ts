import type { MetadataRoute } from 'next'
import { ADMIN_ROUTE } from '@/lib/admin-route'
import { getPublicSettings } from '@/lib/public-settings'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getPublicSettings()
  const base = settings.site.primaryDomain.replace(/\/$/, '')

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [ADMIN_ROUTE, '/setup', '/api/forms', '/api/payload'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
