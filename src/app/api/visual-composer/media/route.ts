import { NextResponse, type NextRequest } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

type MediaDocument = {
  alt?: string | null
  filename?: string | null
  filesize?: number | null
  height?: number | null
  id: number | string
  mimeType?: string | null
  sizes?: Record<string, { url?: string | null } | undefined> | null
  title?: string | null
  updatedAt?: string
  url?: string | null
  width?: number | null
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

function normalizeMedia(doc: MediaDocument): MediaDocument {
  return {
    alt: doc.alt,
    filename: doc.filename,
    filesize: doc.filesize,
    height: doc.height,
    id: doc.id,
    mimeType: doc.mimeType,
    sizes: doc.sizes,
    title: doc.title,
    updatedAt: doc.updatedAt,
    url: doc.url,
    width: doc.width,
  }
}

export async function GET(request: NextRequest) {
  const payload = await getPayloadClient()
  const auth = await payload.auth({ headers: request.headers })

  if (!auth.user) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const result = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 100,
    overrideAccess: false,
    pagination: false,
    sort: '-updatedAt',
    user: auth.user,
  })

  return NextResponse.json({ media: result.docs.map((doc) => normalizeMedia(doc as MediaDocument)) })
}

export async function POST(request: NextRequest) {
  if (!canUseAdminMutation(request)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  }

  const payload = await getPayloadClient()
  const auth = await payload.auth({ headers: request.headers })

  if (!auth.user) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const formData = await request.formData().catch(() => null)
  const upload = formData?.get('file')

  if (!(upload instanceof File)) {
    return NextResponse.json({ error: 'Choose a file to upload.' }, { status: 400 })
  }

  const buffer = Buffer.from(await upload.arrayBuffer())
  const fallbackTitle = upload.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ').trim() || upload.name
  const title = String(formData?.get('title') || fallbackTitle).trim()
  const alt = String(formData?.get('alt') || title).trim()

  const doc = await payload.create({
    collection: 'media',
    data: {
      alt,
      title,
    },
    depth: 0,
    file: {
      data: buffer,
      mimetype: upload.type || 'application/octet-stream',
      name: upload.name,
      size: upload.size,
    },
    overrideAccess: false,
    user: auth.user,
  })

  return NextResponse.json({ media: normalizeMedia(doc as MediaDocument) }, { status: 201 })
}
