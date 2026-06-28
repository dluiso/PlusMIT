import { notFound } from 'next/navigation'
import { BlockRenderer } from '@/components/BlockRenderer'
import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'

type SearchParams = Promise<Record<string, string | string[] | undefined>>

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

async function getComposerPreviewProps(searchParams?: SearchParams) {
  const params = searchParams ? await searchParams : {}
  const composerPreview = firstParam(params.composer) === '1'
  const selectedBlockIndex = Number(firstParam(params.block) || 0)

  return {
    composerPreview,
    selectedBlockIndex: Number.isInteger(selectedBlockIndex) && selectedBlockIndex >= 0 ? selectedBlockIndex : 0,
  }
}

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

export default async function HomePage({ searchParams }: { searchParams?: SearchParams }) {
  const page = await getHomePage()
  if (!page) notFound()
  return <BlockRenderer blocks={page.layout as never} {...(await getComposerPreviewProps(searchParams))} />
}
