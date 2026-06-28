import { NextResponse, type NextRequest } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

type PageBlock = Record<string, unknown> & {
  design?: Record<string, unknown> | null
  hidden?: boolean
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

type LayoutAction =
  | { type: 'delete'; index: number }
  | { type: 'duplicate'; index: number }
  | { type: 'insert'; afterIndex?: number; blockType: string }
  | { type: 'move'; fromIndex: number; toIndex: number }
  | { type: 'toggleHidden'; hidden: boolean; index: number }

const blockFactories: Record<string, () => PageBlock> = {
  ctaBanner: () => ({
    blockType: 'ctaBanner',
    primaryCta: { label: 'Get started', url: '/contact' },
    spacing: 'standard',
    textAlign: 'center',
    theme: 'white',
    title: 'New call to action',
  }),
  faqAccordion: () => ({
    blockType: 'faqAccordion',
    category: '',
    spacing: 'standard',
    textAlign: 'left',
    theme: 'white',
    title: 'Frequently asked questions',
  }),
  hero: () => ({
    blockType: 'hero',
    layoutVariant: 'dashboard',
    mediaPosition: 'none',
    primaryCta: { label: 'Request Assessment', url: '/request-assessment' },
    secondaryCta: { label: 'Explore Services', url: '#services' },
    spacing: 'spacious',
    textAlign: 'left',
    theme: 'white',
    title: 'New hero section',
  }),
  imageText: () => ({
    blockType: 'imageText',
    layoutVariant: 'split',
    mediaPosition: 'right',
    spacing: 'spacious',
    textAlign: 'left',
    theme: 'white',
    title: 'New image and text section',
  }),
  industryCards: () => ({
    blockType: 'industryCards',
    itemLimit: 6,
    sectionId: 'industries',
    spacing: 'standard',
    theme: 'soft',
    title: 'New industries section',
  }),
  pricingOptions: () => ({
    blockType: 'pricingOptions',
    options: [
      { title: 'Assessment', summary: 'A focused review with clear next steps.', icon: '+' },
      { title: 'Managed support', summary: 'Recurring operational support for active environments.', icon: '+' },
      { title: 'Recovery help', summary: 'Practical support for urgent issues and compromised systems.', icon: '+' },
    ],
    spacing: 'standard',
    theme: 'white',
    title: 'Engagement options',
  }),
  processTimeline: () => ({
    blockType: 'processTimeline',
    spacing: 'standard',
    steps: [
      { title: 'Assess', summary: 'Review the current environment and priorities.', icon: '1' },
      { title: 'Plan', summary: 'Define the recommended path and implementation order.', icon: '2' },
      { title: 'Execute', summary: 'Deliver the work with clear checkpoints.', icon: '3' },
    ],
    theme: 'soft',
    title: 'How we work',
  }),
  resourceList: () => ({
    blockType: 'resourceList',
    category: '',
    spacing: 'standard',
    theme: 'white',
    title: 'Latest resources',
  }),
  richText: () => ({
    blockType: 'richText',
    body: 'Add body copy in the advanced editor or continue refining the section here.',
    spacing: 'standard',
    theme: 'white',
    title: 'New text section',
  }),
  servicesGrid: () => ({
    blockType: 'servicesGrid',
    itemLimit: 8,
    sectionId: 'services',
    spacing: 'standard',
    theme: 'white',
    title: 'New services section',
  }),
  smartfiche: () => ({
    blockType: 'smartfiche',
    layoutVariant: 'split',
    mediaPosition: 'right',
    spacing: 'spacious',
    theme: 'splitDarkBlue',
    title: 'New SmartFiche section',
  }),
  stats: () => ({
    blockType: 'stats',
    spacing: 'compact',
    stats: [
      { label: 'Metric label', value: '99%' },
      { label: 'Metric label', value: '24/7' },
    ],
    theme: 'white',
    title: 'New metrics section',
  }),
  testimonials: () => ({
    blockType: 'testimonials',
    itemLimit: 3,
    spacing: 'standard',
    textAlign: 'center',
    theme: 'white',
    title: 'New testimonials section',
  }),
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

function cloneBlockForDuplicate(block: PageBlock): PageBlock {
  const clone = structuredClone(block)
  delete clone.id
  clone.title = `${String(clone.title || clone.blockType || 'Section')} copy`
  return clone
}

function clampIndex(value: number, max: number) {
  return Math.max(0, Math.min(value, max))
}

function isLayoutAction(value: unknown): value is LayoutAction {
  if (!value || typeof value !== 'object') return false

  const action = value as Partial<LayoutAction>
  if (action.type === 'move') return Number.isInteger(action.fromIndex) && Number.isInteger(action.toIndex)
  if (action.type === 'duplicate' || action.type === 'delete') return Number.isInteger(action.index)
  if (action.type === 'toggleHidden') return Number.isInteger(action.index) && typeof action.hidden === 'boolean'
  if (action.type === 'insert') return typeof action.blockType === 'string' && action.blockType in blockFactories

  return false
}

function applyLayoutAction(layout: PageBlock[], action: LayoutAction) {
  const nextLayout = [...layout]
  let selectedBlockIndex = 0

  if (action.type === 'move') {
    if (!nextLayout[action.fromIndex]) return { error: 'Block not found.' }

    const [block] = nextLayout.splice(action.fromIndex, 1)
    const nextIndex = clampIndex(action.toIndex, nextLayout.length)
    nextLayout.splice(nextIndex, 0, block)
    selectedBlockIndex = nextIndex
  }

  if (action.type === 'duplicate') {
    const block = nextLayout[action.index]
    if (!block) return { error: 'Block not found.' }

    selectedBlockIndex = action.index + 1
    nextLayout.splice(selectedBlockIndex, 0, cloneBlockForDuplicate(block))
  }

  if (action.type === 'delete') {
    if (!nextLayout[action.index]) return { error: 'Block not found.' }
    if (nextLayout.length <= 1) return { error: 'A page must keep at least one block.' }

    nextLayout.splice(action.index, 1)
    selectedBlockIndex = clampIndex(action.index, nextLayout.length - 1)
  }

  if (action.type === 'toggleHidden') {
    const block = nextLayout[action.index]
    if (!block) return { error: 'Block not found.' }

    nextLayout[action.index] = { ...block, hidden: action.hidden }
    selectedBlockIndex = action.index
  }

  if (action.type === 'insert') {
    const createBlock = blockFactories[action.blockType]
    if (!createBlock) return { error: 'Unsupported block type.' }

    selectedBlockIndex = clampIndex(Number.isInteger(action.afterIndex) ? Number(action.afterIndex) + 1 : nextLayout.length, nextLayout.length)
    nextLayout.splice(selectedBlockIndex, 0, createBlock())
  }

  return { layout: nextLayout, selectedBlockIndex }
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

  const body = (await request.json().catch(() => null)) as { action?: unknown } | null
  if (!isLayoutAction(body?.action)) {
    return NextResponse.json({ error: 'Invalid layout action.' }, { status: 400 })
  }

  const { id } = await params
  const page = await payload.findByID({
    collection: 'pages',
    depth: 0,
    id,
    overrideAccess: false,
    user: auth.user,
  }) as unknown as PageDocument

  const result = applyLayoutAction(page.layout || [], body.action)
  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  const updated = await payload.update({
    collection: 'pages',
    data: { layout: result.layout } as never,
    depth: 0,
    id,
    overrideAccess: false,
    user: auth.user,
  }) as unknown as PageDocument

  return NextResponse.json({
    page: normalizePage(updated),
    selectedBlockIndex: result.selectedBlockIndex,
  })
}
