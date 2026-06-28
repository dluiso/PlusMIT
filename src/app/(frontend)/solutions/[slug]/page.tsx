import { notFound } from 'next/navigation'
import { BlockRenderer } from '@/components/BlockRenderer'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'

type Args = { params: Promise<{ slug: string }> }
type PageArgs = Args & { searchParams?: Promise<Record<string, string | string[] | undefined>> }

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

async function getComposerPreviewProps(searchParams?: PageArgs['searchParams']) {
  const params = searchParams ? await searchParams : {}
  const composerPreview = firstParam(params.composer) === '1'
  const selectedBlockIndex = Number(firstParam(params.block) || 0)

  return {
    composerPreview,
    selectedBlockIndex: Number.isInteger(selectedBlockIndex) && selectedBlockIndex >= 0 ? selectedBlockIndex : 0,
  }
}

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

export default async function SolutionPage({ params, searchParams }: PageArgs) {
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
      <BlockRenderer blocks={page.layout as never} {...(await getComposerPreviewProps(searchParams))} />
    </>
  )
}
