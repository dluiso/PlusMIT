import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { getPublicSettings } from '@/lib/public-settings'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()
  const settings = await getPublicSettings()
  const base = settings.site.primaryDomain.replace(/\/$/, '')

  const [pages, services, industries, posts, caseStudies] = await Promise.all([
    payload.find({ collection: 'pages', where: { and: [{ status: { equals: 'published' } }, { 'seo.sitemapInclude': { not_equals: false } }] }, limit: 100 }),
    payload.find({ collection: 'services', where: { status: { equals: 'published' } }, limit: 100 }),
    payload.find({ collection: 'industries', where: { status: { equals: 'published' } }, limit: 100 }),
    payload.find({ collection: 'posts', where: { status: { equals: 'published' } }, limit: 100 }),
    payload.find({ collection: 'case-studies', where: { status: { equals: 'published' } }, limit: 100 }),
  ])

  return [
    ...pages.docs.map((page) => ({ url: `${base}/${page.slug === 'home' ? '' : page.slug}`, lastModified: page.updatedAt })),
    ...services.docs.map((doc) => ({ url: `${base}/services/${doc.slug}`, lastModified: doc.updatedAt })),
    ...industries.docs.map((doc) => ({ url: `${base}/industries/${doc.slug}`, lastModified: doc.updatedAt })),
    ...posts.docs.map((doc) => ({ url: `${base}/resources/${doc.slug}`, lastModified: doc.updatedAt })),
    ...caseStudies.docs.map((doc) => ({ url: `${base}/case-studies/${doc.slug}`, lastModified: doc.updatedAt })),
  ]
}
