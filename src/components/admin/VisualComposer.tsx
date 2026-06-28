import Link from 'next/link'
import type { AdminViewServerProps } from 'payload'
import { adminPath } from '@/lib/admin-route'

type PageSummary = {
  id: number | string
  title?: string
  slug?: string
  status?: string
  pageType?: string | null
  updatedAt?: string
  layout?: PageBlock[]
}

type PageBlock = {
  blockType?: string
  title?: string | null
  eyebrow?: string | null
  summary?: string | null
  theme?: string | null
  layoutVariant?: string | null
  mediaPosition?: string | null
  spacing?: string | null
  sectionId?: string | null
  design?: {
    titleSize?: string | null
    mediaFit?: string | null
    mediaAspectRatio?: string | null
    mobileLayout?: string | null
    mobileMedia?: string | null
  } | null
}

type ComposerPayload = {
  find: (options: {
    collection: 'pages'
    depth?: number
    limit?: number
    pagination?: boolean
    sort?: string
    where?: Record<string, unknown>
  }) => Promise<{ docs: PageSummary[] }>
}

const blockLabels: Record<string, string> = {
  caseStudyHighlight: 'Case Study Highlight',
  contactForm: 'Contact Form',
  ctaBanner: 'CTA Banner',
  faqAccordion: 'FAQ Accordion',
  featuredService: 'Featured Service',
  featureCards: 'Feature Cards',
  hero: 'Hero',
  imageText: 'Image + Text',
  industryCards: 'Industry Cards',
  mobileAppPreview: 'Mobile App Preview',
  pricingOptions: 'Pricing / Plans',
  processTimeline: 'Process Timeline',
  recoveryEmergencyCta: 'Recovery Emergency CTA',
  resourceList: 'Resource List',
  richText: 'Rich Text',
  securityNotice: 'Security Notice',
  servicesGrid: 'Services Grid',
  smartfiche: 'SmartFiche',
  splitHero: 'Split Hero',
  stats: 'Stats',
  technologyStack: 'Technology Stack',
  testimonials: 'Testimonials',
  trustBar: 'Trust Bar',
}

const previewSizes = [
  { label: 'Desktop', width: 1280 },
  { label: 'Tablet', width: 820 },
  { label: 'Mobile', width: 390 },
]

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function publicPathFromSlug(slug?: string) {
  if (!slug || slug === 'home') return '/'
  return `/${slug.replace(/^\/+/, '')}`
}

function publicUrlFromSlug(slug?: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  return new URL(publicPathFromSlug(slug), siteUrl).toString()
}

function formatDate(value?: string) {
  if (!value) return 'No date'

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function getBlockLabel(blockType?: string) {
  if (!blockType) return 'Block'
  return blockLabels[blockType] || blockType
}

function getBlockTitle(block: PageBlock, index: number) {
  return block.title || block.eyebrow || `${getBlockLabel(block.blockType)} ${index + 1}`
}

function getPageEditHref(id: number | string) {
  return adminPath(`/collections/pages/${id}`)
}

function getPagePreviewHref(id: number | string) {
  return adminPath(`/collections/pages/${id}/preview`)
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

function getSelectedPage(pages: PageSummary[], requestedId?: string) {
  return pages.find((page) => String(page.id) === requestedId) || pages.find((page) => page.slug === 'home') || pages[0] || null
}

export async function VisualComposer(props: AdminViewServerProps) {
  const payload = props.initPageResult.req.payload as unknown as ComposerPayload
  const pages = await getPages(payload)
  const selectedPage = getSelectedPage(pages, firstParam(props.searchParams?.page))
  const selectedPreviewSize = Number(firstParam(props.searchParams?.viewport)) || previewSizes[0].width
  const previewUrl = publicUrlFromSlug(selectedPage?.slug)

  return (
    <main className="visual-composer">
      <section className="visual-composer__hero">
        <div>
          <p className="visual-composer__eyebrow">PlusMIT visual composer</p>
          <h1>Plan, preview, and edit pages from the existing CMS blocks.</h1>
          <p>
            This workspace keeps Payload as the source of truth. Use it to inspect layout structure, preview responsive
            widths, and jump into the official editor for safe changes.
          </p>
        </div>
        {selectedPage ? (
          <div className="visual-composer__heroActions">
            <Link className="visual-composer__button visual-composer__button--primary" href={getPageEditHref(selectedPage.id)}>
              Edit selected page
            </Link>
            <Link className="visual-composer__button" href={getPagePreviewHref(selectedPage.id)}>
              Open Live Preview
            </Link>
          </div>
        ) : null}
      </section>

      {selectedPage ? (
        <section className="visual-composer__workspace">
          <aside className="visual-composer__sidebar" aria-label="Pages">
            <div className="visual-composer__panelHeader">
              <h2>Pages</h2>
              <p>Select a page to inspect.</p>
            </div>
            <div className="visual-composer__pageList">
              {pages.map((page) => (
                <Link
                  className="visual-composer__pageItem"
                  data-active={page.id === selectedPage.id}
                  href={`${adminPath('/visual-composer')}?page=${page.id}&viewport=${selectedPreviewSize}`}
                  key={page.id}
                >
                  <strong>{page.title || page.slug}</strong>
                  <span>{publicPathFromSlug(page.slug)}</span>
                  <small>{page.status || 'draft'}</small>
                </Link>
              ))}
            </div>
          </aside>

          <section className="visual-composer__main" aria-label="Selected page workspace">
            <div className="visual-composer__toolbar">
              <div>
                <p className="visual-composer__eyebrow">Selected page</p>
                <h2>{selectedPage.title || selectedPage.slug}</h2>
                <span>
                  {selectedPage.pageType || 'standard'} - {selectedPage.status || 'draft'} - Updated{' '}
                  {formatDate(selectedPage.updatedAt)}
                </span>
              </div>
              <div className="visual-composer__viewportSwitch" aria-label="Preview size">
                {previewSizes.map((size) => (
                  <Link
                    data-active={selectedPreviewSize === size.width}
                    href={`${adminPath('/visual-composer')}?page=${selectedPage.id}&viewport=${size.width}`}
                    key={size.width}
                  >
                    {size.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="visual-composer__previewWrap">
              <iframe
                className="visual-composer__preview"
                key={`${selectedPage.id}-${selectedPreviewSize}`}
                src={previewUrl}
                style={{ width: `${selectedPreviewSize}px` }}
                title={`Preview of ${selectedPage.title || selectedPage.slug}`}
              />
            </div>
          </section>

          <aside className="visual-composer__sidebar" aria-label="Page structure">
            <div className="visual-composer__panelHeader">
              <h2>Page structure</h2>
              <p>{selectedPage.layout?.length || 0} blocks in order.</p>
            </div>
            <ol className="visual-composer__blockList">
              {(selectedPage.layout || []).map((block, index) => (
                <li className="visual-composer__blockItem" key={`${block.blockType || 'block'}-${index}`}>
                  <span>{index + 1}</span>
                  <div>
                    <strong>{getBlockTitle(block, index)}</strong>
                    <small>{getBlockLabel(block.blockType)}</small>
                    <dl>
                      <div>
                        <dt>Theme</dt>
                        <dd>{block.theme || 'default'}</dd>
                      </div>
                      <div>
                        <dt>Layout</dt>
                        <dd>{block.layoutVariant || 'default'}</dd>
                      </div>
                      <div>
                        <dt>Media</dt>
                        <dd>
                          {block.mediaPosition || 'default'} / {block.design?.mediaFit || 'cover'}
                        </dd>
                      </div>
                      <div>
                        <dt>Mobile</dt>
                        <dd>{block.design?.mobileLayout || 'inherit'}</dd>
                      </div>
                    </dl>
                  </div>
                </li>
              ))}
            </ol>
          </aside>
        </section>
      ) : (
        <section className="visual-composer__empty">
          <h2>No pages found</h2>
          <p>Create a page first, then return here to preview and edit its layout.</p>
          <Link className="visual-composer__button visual-composer__button--primary" href={adminPath('/collections/pages/create')}>
            Create page
          </Link>
        </section>
      )}
    </main>
  )
}
