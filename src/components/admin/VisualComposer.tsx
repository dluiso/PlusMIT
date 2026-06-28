import type { AdminViewServerProps } from 'payload'
import { VisualComposerClient, type PageSummary } from '@/components/admin/VisualComposerClient'

type ComposerPayload = {
  find: (options: {
    collection: 'pages'
    depth?: number
    limit?: number
    pagination?: boolean
    sort?: string
  }) => Promise<{ docs: PageSummary[] }>
}

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

async function getPages(payload: ComposerPayload) {
  try {
    const result = await payload.find({
      collection: 'pages',
      depth: 0,
      limit: 100,
      pagination: false,
      sort: 'title',
    })

    return result.docs
  } catch {
    return []
  }
}

export async function VisualComposer(props: AdminViewServerProps) {
  const payload = props.initPageResult.req.payload as unknown as ComposerPayload
  const pages = await getPages(payload)
  const requestedPage = firstParam(props.searchParams?.page)
  const initialPage = pages.find((page) => String(page.id) === requestedPage) || pages.find((page) => page.slug === 'home') || pages[0]
  const initialViewport = Number(firstParam(props.searchParams?.viewport) || 0)

  return (
    <VisualComposerClient
      initialPageId={initialPage?.id}
      initialViewport={initialViewport}
      pages={pages}
      siteUrl={process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}
    />
  )
}
