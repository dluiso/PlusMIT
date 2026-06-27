import { notFound } from 'next/navigation'
import { BlockRenderer } from '@/components/BlockRenderer'
import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'

async function getHomePage() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'pages',
    where: { and: [{ slug: { equals: 'home' } }, { status: { equals: 'published' } }] },
    depth: 2,
    limit: 1,
  })
  return result.docs[0] || null
}

export async function generateMetadata() {
  return buildMetadata(await getHomePage())
}

export default async function HomePage() {
  const page = await getHomePage()
  if (!page) notFound()
  return <BlockRenderer blocks={page.layout as never} />
}
