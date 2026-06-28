import { NextResponse, type NextRequest } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

type PageBlock = Record<string, unknown> & {
  design?: Record<string, unknown> | null
}

type PageDocument = {
  id: number | string
  layout?: PageBlock[]
  pageType?: string | null
  slug?: string
  status?: string
  title?: string
  updatedAt?: string
}

const allowedTopLevelFields = new Set([
  'eyebrow',
  'highlightText',
  'layoutVariant',
  'maxWidth',
  'mediaPosition',
  'sectionId',
  'spacing',
  'summary',
  'textAlign',
  'theme',
  'title',
])

const allowedRelationshipFields = new Set(['backgroundImage', 'image'])

const allowedDesignFields = new Set([
  'cardColumns',
  'cardDensity',
  'customBackgroundColor',
  'customEyebrowColor',
  'customSummaryColor',
  'customTitleColor',
  'eyebrowColor',
  'mediaAspectRatio',
  'mediaBackgroundColor',
  'mediaFit',
  'mediaFrame',
  'mediaObjectPosition',
  'mediaPadding',
  'mediaSize',
  'mobileCtaLayout',
  'mobileLayout',
  'mobileMedia',
  'mobileSpacing',
  'summaryColor',
  'summarySize',
  'titleColor',
  'titleSize',
])

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function sanitizeStringValue(value: unknown) {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function sanitizeRelationshipValue(value: unknown) {
  if (typeof value === 'number') return value
  if (typeof value !== 'string') return undefined

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function sanitizeBlockPatch(value: unknown) {
  if (!isPlainObject(value)) return null

  const patch: PageBlock = {}

  for (const [key, fieldValue] of Object.entries(value)) {
    if (allowedTopLevelFields.has(key)) {
      patch[key] = sanitizeStringValue(fieldValue)
    }

    if (allowedRelationshipFields.has(key)) {
      patch[key] = sanitizeRelationshipValue(fieldValue)
    }
  }

  if (isPlainObject(value.design)) {
    patch.design = {}

    for (const [key, fieldValue] of Object.entries(value.design)) {
      if (allowedDesignFields.has(key)) {
        patch.design[key] = sanitizeStringValue(fieldValue)
      }
    }
  }

  return patch
}

function canUseAdminMutation(request: NextRequest) {
  const origin = request.headers.get('origin')
  if (!origin) return true

  const allowedOrigins = new Set([request.nextUrl.origin])
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  const forwardedHost = request.headers.get('x-forwarded-host') || request.headers.get('host')
  const forwardedProto = request.headers.get('x-forwarded-proto') || request.nextUrl.protocol.replace(':', '')

  if (siteUrl) {
    allowedOrigins.add(new URL(siteUrl).origin)
  }

  if (forwardedHost) {
    allowedOrigins.add(`${forwardedProto}://${forwardedHost}`)
  }

  return allowedOrigins.has(origin)
}

function normalizePage(doc: PageDocument): PageDocument {
  return {
    id: doc.id,
    layout: doc.layout || [],
    pageType: doc.pageType,
    slug: doc.slug,
    status: doc.status,
    title: doc.title,
    updatedAt: doc.updatedAt,
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ blockIndex: string; id: string }> },
) {
  if (!canUseAdminMutation(request)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  }

  const payload = await getPayloadClient()
  const auth = await payload.auth({ headers: request.headers })

  if (!auth.user) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const { blockIndex, id } = await params
  const index = Number(blockIndex)

  if (!Number.isInteger(index) || index < 0) {
    return NextResponse.json({ error: 'Invalid block index.' }, { status: 400 })
  }

  const body = (await request.json().catch(() => null)) as { block?: unknown } | null
  const patch = sanitizeBlockPatch(body?.block)

  if (!patch) {
    return NextResponse.json({ error: 'Invalid block payload.' }, { status: 400 })
  }

  const page = await payload.findByID({
    collection: 'pages',
    depth: 0,
    id,
    overrideAccess: false,
    user: auth.user,
  }) as unknown as PageDocument

  const layout = [...(page.layout || [])]

  if (!layout[index]) {
    return NextResponse.json({ error: 'Block not found.' }, { status: 404 })
  }

  const nextBlock: PageBlock = {
    ...layout[index],
    ...patch,
  }

  if (layout[index].design || patch.design) {
    nextBlock.design = {
      ...(layout[index].design || {}),
      ...(patch.design || {}),
    }
  }

  layout[index] = nextBlock

  const updated = await payload.update({
    collection: 'pages',
    data: { layout } as never,
    depth: 0,
    id,
    overrideAccess: false,
    user: auth.user,
  }) as unknown as PageDocument

  return NextResponse.json({
    page: normalizePage(updated),
  })
}
