import { NextResponse, type NextRequest } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

type PageBlock = Record<string, unknown>

type PageDocument = {
  id: number | string
  layout?: PageBlock[]
  pageType?: string | null
  seo?: Record<string, unknown> | null
  slug?: string
  status?: string
  title?: string
  updatedAt?: string
}

const allowedSchemaTypes = new Set(['WebPage', 'ProfessionalService', 'Service', 'FAQPage', 'Article', 'BreadcrumbList'])

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function sanitizeStringValue(value: unknown) {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function sanitizeBooleanValue(value: unknown) {
  return typeof value === 'boolean' ? value : undefined
}

function sanitizeRelationshipValue(value: unknown) {
  if (typeof value === 'number') return value
  if (typeof value !== 'string') return undefined

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function sanitizeSitemapPriority(value: unknown) {
  const numberValue = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(numberValue)) return undefined
  return Math.max(0, Math.min(Number(numberValue.toFixed(1)), 1))
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
    seo: doc.seo,
    slug: doc.slug,
    status: doc.status,
    title: doc.title,
    updatedAt: doc.updatedAt,
  }
}

function sanitizeSettingsPayload(value: unknown, currentSeo: Record<string, unknown> | null | undefined) {
  if (!isPlainObject(value)) return null

  const status = value.status === 'published' ? 'published' : value.status === 'draft' ? 'draft' : undefined
  const title = sanitizeStringValue(value.title)
  const seoInput = isPlainObject(value.seo) ? value.seo : {}
  const seo: Record<string, unknown> = { ...(currentSeo || {}) }
  const seoTextFields = ['canonicalUrl', 'description', 'keywords', 'openGraphDescription', 'openGraphTitle', 'title']
  const seoBooleanFields = ['nofollow', 'noindex', 'sitemapInclude']
  const seoRelationshipFields = ['openGraphImage', 'twitterImage']

  for (const field of seoTextFields) {
    const sanitized = sanitizeStringValue(seoInput[field])
    if (sanitized !== undefined) {
      seo[field] = sanitized
    }
  }

  for (const field of seoBooleanFields) {
    const sanitized = sanitizeBooleanValue(seoInput[field])
    if (sanitized !== undefined) {
      seo[field] = sanitized
    }
  }

  for (const field of seoRelationshipFields) {
    const sanitized = sanitizeRelationshipValue(seoInput[field])
    if (sanitized !== undefined) {
      seo[field] = sanitized
    }
  }

  const sitemapPriority = sanitizeSitemapPriority(seoInput.sitemapPriority)
  if (sitemapPriority !== undefined) {
    seo.sitemapPriority = sitemapPriority
  }

  if (typeof seoInput.schemaType === 'string' && allowedSchemaTypes.has(seoInput.schemaType)) {
    seo.schemaType = seoInput.schemaType
  }

  return {
    ...(typeof status === 'string' ? { status } : {}),
    ...(title !== undefined ? { title } : {}),
    seo,
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!canUseAdminMutation(request)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  }

  const payload = await getPayloadClient()
  const auth = await payload.auth({ headers: request.headers })

  if (!auth.user) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const { id } = await params
  const page = await payload.findByID({
    collection: 'pages',
    depth: 0,
    id,
    overrideAccess: false,
    user: auth.user,
  }) as unknown as PageDocument

  const body = await request.json().catch(() => null)
  const data = sanitizeSettingsPayload(body, page.seo)

  if (!data) {
    return NextResponse.json({ error: 'Invalid page settings payload.' }, { status: 400 })
  }

  try {
    const updated = await payload.update({
      collection: 'pages',
      data: data as never,
      depth: 1,
      id,
      overrideAccess: false,
      user: auth.user,
    }) as unknown as PageDocument

    return NextResponse.json({
      page: normalizePage(updated),
    })
  } catch {
    return NextResponse.json({ error: 'Page settings could not be saved with the current account permissions.' }, { status: 403 })
  }
}
