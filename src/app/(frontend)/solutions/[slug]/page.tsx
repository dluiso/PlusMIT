import { notFound } from 'next/navigation'
import { BlockRenderer } from '@/components/BlockRenderer'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'

type Args = { params: Promise<{ slug: string }> }

async function getSolution(slug: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'pages',
    where: {
      and: [
        { slug: { equals: `solutions/${slug}` } },
        { status: { equals: 'published' } },
      ],
    },
    depth: 2,
    limit: 1,
  })
  return result.docs[0] || null
}

export async function generateMetadata({ params }: Args) {
  const { slug } = await params
  return buildMetadata(await getSolution(slug))
}

export default async function SolutionPage({ params }: Args) {
  const { slug } = await params
  const page = await getSolution(slug)
  if (!page) notFound()

  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Solutions', href: '/solutions' },
          { label: page.title, href: `/solutions/${slug}` },
        ]}
      />
      <BlockRenderer blocks={page.layout as never} />
    </>
  )
}
