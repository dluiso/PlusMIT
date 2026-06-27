import { notFound } from 'next/navigation'
import { BlockRenderer } from '@/components/BlockRenderer'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'

type Args = { params: Promise<{ slug: string }> }

async function getPage(slug: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'pages',
    where: { and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }] },
    depth: 2,
    limit: 1,
  })
  return result.docs[0] || null
}

export async function generateMetadata({ params }: Args) {
  const { slug } = await params
  return buildMetadata(await getPage(slug))
}

export default async function DynamicPage({ params }: Args) {
  const { slug } = await params
  const page = await getPage(slug)
  if (!page) notFound()

  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: page.title, href: `/${slug}` }]} />
      <BlockRenderer blocks={page.layout as never} />
    </>
  )
}
