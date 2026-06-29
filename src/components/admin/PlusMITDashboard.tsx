import Link from 'next/link'
import type { AdminViewServerProps } from 'payload'
import { adminPath } from '@/lib/admin-route'

type CountSlug = 'case-studies' | 'industries' | 'lead-submissions' | 'media' | 'pages' | 'posts' | 'services' | 'testimonials'

type DashboardPayload = {
  count: (options: { collection: CountSlug; where?: Record<string, unknown> }) => Promise<{ totalDocs: number }>
  find: (options: { collection: CountSlug; depth?: number; limit: number; pagination?: boolean; sort?: string; where?: Record<string, unknown> }) => Promise<{ docs: unknown[] }>
  findGlobal: (options: { slug: 'branding' | 'site-settings' }) => Promise<Record<string, unknown>>
}

type DashboardMetric = {
  href: string
  label: string
  slug: CountSlug
}

type LatestLead = {
  createdAt?: string
  email?: string
  formSource?: number | { name?: string } | null
  status?: string | null
}

type DashboardPage = {
  id?: number | string
  layout?: { blockType?: string; hidden?: boolean | null; title?: string | null }[] | null
  seo?: {
    description?: string | null
    noindex?: boolean | null
    openGraphDescription?: string | null
    openGraphImage?: unknown
    openGraphTitle?: string | null
    sitemapInclude?: boolean | null
    title?: string | null
    twitterImage?: unknown
  } | null
  slug?: string | null
  status?: string | null
  title?: string | null
}

type DashboardMedia = {
  alt?: string | null
  filename?: string | null
  filesize?: number | null
  id?: number | string
  mimeType?: string | null
  title?: string | null
}

const metrics: DashboardMetric[] = [
  { label: 'Pages', slug: 'pages', href: adminPath('/collections/pages') },
  { label: 'Services', slug: 'services', href: adminPath('/collections/services') },
  { label: 'Leads', slug: 'lead-submissions', href: adminPath('/collections/lead-submissions') },
  { label: 'Resources', slug: 'posts', href: adminPath('/collections/posts') },
  { label: 'Media', slug: 'media', href: adminPath('/collections/media') },
  { label: 'Reviews', slug: 'testimonials', href: adminPath('/collections/testimonials') },
]

const quickLinks = [
  { label: 'Visual Composer', href: adminPath('/visual-composer'), description: 'Preview page structure by viewport.' },
  { label: 'Edit Homepage', href: `${adminPath('/collections/pages')}?where[slug][equals]=home`, description: 'Hero, homepage blocks, and SEO.' },
  { label: 'Create Service', href: adminPath('/collections/services/create'), description: 'Add a new service page.' },
  { label: 'Lead Submissions', href: adminPath('/collections/lead-submissions'), description: 'Review form requests.' },
  { label: 'Navigation', href: adminPath('/collections/navigation'), description: 'Header and footer menus.' },
  { label: 'Site Settings', href: adminPath('/globals/site-settings'), description: 'Company, contact, analytics, and footer.' },
  { label: 'Branding', href: adminPath('/globals/branding'), description: 'Logo, colors, radius, and theme presets.' },
]

async function safeCount(payload: DashboardPayload, slug: CountSlug) {
  try {
    const result = await payload.count({ collection: slug })
    return result.totalDocs
  } catch {
    return 0
  }
}

async function safeCountWhere(payload: DashboardPayload, slug: CountSlug, where: Record<string, unknown>) {
  try {
    const result = await payload.count({ collection: slug, where })
    return result.totalDocs
  } catch {
    return 0
  }
}

async function getLatestLeads(payload: DashboardPayload): Promise<LatestLead[]> {
  try {
    const result = await payload.find({
      collection: 'lead-submissions',
      limit: 5,
      sort: '-createdAt',
    })

    return result.docs as LatestLead[]
  } catch {
    return []
  }
}

async function getDashboardPages(payload: DashboardPayload): Promise<DashboardPage[]> {
  try {
    const result = await payload.find({
      collection: 'pages',
      depth: 0,
      limit: 25,
      pagination: false,
      sort: '-updatedAt',
    })

    return result.docs as DashboardPage[]
  } catch {
    return []
  }
}

async function getHomepage(payload: DashboardPayload): Promise<DashboardPage | null> {
  try {
    const result = await payload.find({
      collection: 'pages',
      depth: 0,
      limit: 1,
      where: { slug: { equals: 'home' } },
    })

    return (result.docs[0] as DashboardPage | undefined) || null
  } catch {
    return null
  }
}

async function getDashboardMedia(payload: DashboardPayload): Promise<DashboardMedia[]> {
  try {
    const result = await payload.find({
      collection: 'media',
      depth: 0,
      limit: 50,
      pagination: false,
      sort: '-updatedAt',
    })

    return result.docs as DashboardMedia[]
  } catch {
    return []
  }
}

function getStringValue(value: unknown, fallback: string) {
  return typeof value === 'string' && value.length > 0 ? value : fallback
}

async function getSetupStatus(payload: DashboardPayload) {
  try {
    const [siteSettings, branding] = await Promise.all([
      payload.findGlobal({ slug: 'site-settings' }),
      payload.findGlobal({ slug: 'branding' }),
    ])

    return {
      companyName: getStringValue(siteSettings.companyName, 'PlusMIT'),
      domain: getStringValue(siteSettings.primaryDomain, process.env.NEXT_PUBLIC_SITE_URL || 'Not set'),
      publicEmail: getStringValue(siteSettings.publicEmail, 'Not set'),
      ctaLabel: getStringValue(siteSettings.defaultCtaLabel, 'Not set'),
      themeMode: getStringValue(branding.defaultThemeMode, 'dark'),
    }
  } catch {
    return {
      companyName: 'PlusMIT',
      domain: process.env.NEXT_PUBLIC_SITE_URL || 'Not set',
      publicEmail: 'Not set',
      ctaLabel: 'Not set',
      themeMode: 'dark',
    }
  }
}

function formatDate(value?: string) {
  if (!value) {
    return 'No date'
  }

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function formatBytes(value?: number | null) {
  if (!value || value < 1) return '0 KB'
  if (value < 1024 * 1024) return `${Math.round(value / 1024)} KB`
  return `${(value / 1024 / 1024).toFixed(1)} MB`
}

function getLeadFormSource(lead: LatestLead) {
  if (typeof lead.formSource === 'object' && lead.formSource && 'name' in lead.formSource) {
    return lead.formSource.name || 'Website form'
  }

  return 'Website form'
}

function hasRelationshipValue(value: unknown) {
  if (!value) return false
  if (typeof value === 'number' || typeof value === 'string') return true
  return typeof value === 'object' && 'id' in value
}

function getContentInsights(pages: DashboardPage[], media: DashboardMedia[], homepage: DashboardPage | null) {
  const publishedPages = pages.filter((page) => page.status === 'published')
  const pagesWithSocialImage = publishedPages.filter((page) => hasRelationshipValue(page.seo?.openGraphImage) || hasRelationshipValue(page.seo?.twitterImage))
  const layoutIssues = pages
    .map((page) => {
      const visibleBlocks = (page.layout || []).filter((block) => !block.hidden)
      const issues = [
        visibleBlocks.length ? null : 'no visible blocks',
        visibleBlocks.some((block) => block.blockType === 'hero' || block.title) ? null : 'missing hero/title section',
        visibleBlocks.some((block) => block.blockType === 'contactForm' || block.blockType === 'ctaBanner') ? null : 'missing conversion section',
      ].filter(Boolean)

      return issues.length
        ? {
            href: `${adminPath('/collections/pages')}/${page.id}`,
            issues: issues.join(', '),
            title: page.title || page.slug || 'Untitled page',
          }
        : null
    })
    .filter((issue): issue is { href: string; issues: string; title: string } => Boolean(issue))
  const seoIssues = publishedPages
    .map((page) => {
      const seoTitle = page.seo?.title?.trim()
      const seoDescription = page.seo?.description?.trim()
      const issues = [
        seoTitle ? null : 'missing SEO title',
        seoTitle && seoTitle.length > 60 ? 'SEO title over 60 chars' : null,
        seoDescription ? null : 'missing meta description',
        seoDescription && seoDescription.length > 160 ? 'meta description over 160 chars' : null,
        page.layout?.length ? null : 'empty layout',
        hasRelationshipValue(page.seo?.openGraphImage) || hasRelationshipValue(page.seo?.twitterImage) ? null : 'missing social image',
        page.seo?.noindex ? 'noindex enabled' : null,
        page.seo?.sitemapInclude === false ? 'not in sitemap' : null,
      ].filter(Boolean)

      return issues.length
        ? {
            description: seoDescription || 'No meta description configured.',
            href: `${adminPath('/collections/pages')}/${page.id}`,
            issues: issues.join(', '),
            seoTitle: seoTitle || page.title || page.slug || 'Untitled page',
            title: page.title || page.slug || 'Untitled page',
          }
        : null
    })
    .filter((issue): issue is { description: string; href: string; issues: string; seoTitle: string; title: string } => Boolean(issue))

  const mediaMissingAlt = media.filter((item) => !item.alt?.trim())
  const largeMedia = media
    .filter((item) => typeof item.filesize === 'number' && item.filesize > 800 * 1024)
    .sort((a, b) => (b.filesize || 0) - (a.filesize || 0))
  const nonImageMedia = media.filter((item) => item.mimeType && !item.mimeType.startsWith('image/') && item.mimeType !== 'application/pdf')
  const homePage = homepage || pages.find((page) => page.slug === 'home' || page.slug === null || page.slug === '')
  const homeVisibleBlocks = (homePage?.layout || []).filter((block) => !block.hidden)

  return {
    homePage,
    homeVisibleBlocks,
    largeMedia,
    layoutIssues,
    mediaMissingAlt,
    nonImageMedia,
    publishedPages,
    socialReady: pagesWithSocialImage.length,
    seoReady: Math.max(0, publishedPages.length - seoIssues.length),
    seoIssues,
  }
}

export async function PlusMITDashboard(props: AdminViewServerProps) {
  const payload = props.initPageResult.req.payload as unknown as DashboardPayload
  const [counts, latestLeads, setup, dashboardPages, dashboardMedia, homepage] = await Promise.all([
    Promise.all(metrics.map(async (metric) => [metric.slug, await safeCount(payload, metric.slug)] as const)),
    getLatestLeads(payload),
    getSetupStatus(payload),
    getDashboardPages(payload),
    getDashboardMedia(payload),
    getHomepage(payload),
  ])
  const [publishedPages, draftPages, newLeads, publishedServices] = await Promise.all([
    safeCountWhere(payload, 'pages', { status: { equals: 'published' } }),
    safeCountWhere(payload, 'pages', { status: { equals: 'draft' } }),
    safeCountWhere(payload, 'lead-submissions', { status: { equals: 'new' } }),
    safeCountWhere(payload, 'services', { status: { equals: 'published' } }),
  ])
  const [reviewingLeads, contactedLeads, closedLeads, spamLeads] = await Promise.all([
    safeCountWhere(payload, 'lead-submissions', { status: { equals: 'reviewing' } }),
    safeCountWhere(payload, 'lead-submissions', { status: { equals: 'contacted' } }),
    safeCountWhere(payload, 'lead-submissions', { status: { equals: 'closed' } }),
    safeCountWhere(payload, 'lead-submissions', { status: { equals: 'spam' } }),
  ])

  const countMap = Object.fromEntries(counts) as Record<CountSlug, number>
  const contentInsights = getContentInsights(dashboardPages, dashboardMedia, homepage)
  const homeHasHero = contentInsights.homeVisibleBlocks.some((block) => block.blockType === 'hero' || block.title)
  const homeHasConversion = contentInsights.homeVisibleBlocks.some((block) => block.blockType === 'contactForm' || block.blockType === 'ctaBanner')
  const performanceChecks = [
    { label: 'No oversized media in latest assets', ready: contentInsights.largeMedia.length === 0 },
    { label: 'Recent media has alt text', ready: contentInsights.mediaMissingAlt.length === 0 },
    { label: 'Published pages have SEO metadata', ready: contentInsights.seoIssues.length === 0 },
    { label: 'Homepage has hero and conversion path', ready: homeHasHero && homeHasConversion },
  ]

  return (
    <main className="plusmit-dashboard">
      <section className="plusmit-dashboard__hero">
        <div>
          <p className="plusmit-dashboard__eyebrow">PlusMIT CMS</p>
          <h1>{setup.companyName} operations dashboard</h1>
          <p>
            Manage website content, lead intake, SEO, and brand settings from one focused workspace.
          </p>
        </div>
        <div className="plusmit-dashboard__heroActions">
          <Link className="plusmit-dashboard__button plusmit-dashboard__button--primary" href="/" target="_blank">
            View Site
          </Link>
          <Link className="plusmit-dashboard__button" href={adminPath('/globals/site-settings')}>
            Site Settings
          </Link>
        </div>
      </section>

      <section aria-label="Content summary" className="plusmit-dashboard__metrics">
        {metrics.map((metric) => (
          <Link className="plusmit-dashboard__metric" href={metric.href} key={metric.slug}>
            <span>{metric.label}</span>
            <strong>{countMap[metric.slug] ?? 0}</strong>
          </Link>
        ))}
      </section>

      <section className="plusmit-dashboard__grid">
        <div className="plusmit-dashboard__panel">
          <div className="plusmit-dashboard__panelHeader">
            <h2>Quick actions</h2>
            <p>Common CMS tasks.</p>
          </div>
          <div className="plusmit-dashboard__quickLinks">
            {quickLinks.map((link) => (
              <Link href={link.href} key={link.href}>
                <strong>{link.label}</strong>
                <span>{link.description}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="plusmit-dashboard__panel">
          <div className="plusmit-dashboard__panelHeader">
            <h2>Latest leads</h2>
            <p>Recent form submissions.</p>
          </div>
          <div className="plusmit-dashboard__leadList">
            {latestLeads.length > 0 ? (
              latestLeads.map((lead, index) => (
                <Link href={adminPath('/collections/lead-submissions')} key={`${lead.email || 'lead'}-${index}`}>
                  <strong>{lead.email || 'Unknown email'}</strong>
                  <span>{getLeadFormSource(lead)}</span>
                  <small>
                    {lead.status || 'new'} - {formatDate(lead.createdAt)}
                  </small>
                </Link>
              ))
            ) : (
              <p className="plusmit-dashboard__empty">No lead submissions yet.</p>
            )}
          </div>
        </div>
      </section>

      <section className="plusmit-dashboard__grid">
        <div className="plusmit-dashboard__panel">
          <div className="plusmit-dashboard__panelHeader">
            <h2>Content health</h2>
            <p>Publishing and operational readiness.</p>
          </div>
          <div className="plusmit-dashboard__healthGrid">
            <div><span>Published pages</span><strong>{publishedPages}</strong></div>
            <div><span>Draft pages</span><strong>{draftPages}</strong></div>
            <div><span>Published services</span><strong>{publishedServices}</strong></div>
            <div><span>New leads</span><strong>{newLeads}</strong></div>
            <div><span>Layout issues</span><strong>{contentInsights.layoutIssues.length}</strong></div>
            <div><span>SEO issues</span><strong>{contentInsights.seoIssues.length}</strong></div>
          </div>
          {contentInsights.layoutIssues.length ? (
            <div className="plusmit-dashboard__watchList plusmit-dashboard__watchList--compact">
              {contentInsights.layoutIssues.slice(0, 3).map((issue) => (
                <Link href={issue.href} key={issue.href}>
                  <strong>{issue.title}</strong>
                  <span>{issue.issues}</span>
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        <div className="plusmit-dashboard__panel">
          <div className="plusmit-dashboard__panelHeader">
            <h2>Brand status</h2>
            <p>Current public site configuration.</p>
          </div>
          <div className="plusmit-dashboard__checkList">
            <span data-ready={setup.domain !== 'Not set'}>Domain configured</span>
            <span data-ready={setup.publicEmail !== 'Not set'}>Public email configured</span>
            <span data-ready={setup.ctaLabel !== 'Not set'}>Primary CTA configured</span>
            <span data-ready={Boolean(setup.themeMode)}>Theme mode configured</span>
          </div>
        </div>
      </section>

      <section className="plusmit-dashboard__grid">
        <div className="plusmit-dashboard__panel">
          <div className="plusmit-dashboard__panelHeader">
            <h2>SEO watchlist</h2>
            <p>Published pages that need metadata attention.</p>
          </div>
          <div className="plusmit-dashboard__healthGrid plusmit-dashboard__healthGrid--compact">
            <div><span>SEO ready</span><strong>{contentInsights.seoReady}</strong></div>
            <div><span>Need attention</span><strong>{contentInsights.seoIssues.length}</strong></div>
            <div><span>Social image</span><strong>{contentInsights.socialReady}</strong></div>
            <div><span>Published</span><strong>{contentInsights.publishedPages.length}</strong></div>
          </div>
          <div className="plusmit-dashboard__watchList">
            {contentInsights.seoIssues.length ? (
              contentInsights.seoIssues.slice(0, 5).map((issue) => (
                <Link href={issue.href} key={issue.href}>
                  <strong>{issue.title}</strong>
                  <small className="plusmit-dashboard__snippet">{issue.seoTitle}</small>
                  <small>{issue.description}</small>
                  <span>{issue.issues}</span>
                </Link>
              ))
            ) : (
              <p className="plusmit-dashboard__empty">No published page SEO issues found.</p>
            )}
          </div>
        </div>

        <div className="plusmit-dashboard__panel">
          <div className="plusmit-dashboard__panelHeader">
            <h2>Performance status</h2>
            <p>Recent assets and content checks that affect speed.</p>
          </div>
          <div className="plusmit-dashboard__healthGrid">
            <div><span>Missing alt</span><strong>{contentInsights.mediaMissingAlt.length}</strong></div>
            <div><span>Large files</span><strong>{contentInsights.largeMedia.length}</strong></div>
            <div><span>Recent assets</span><strong>{dashboardMedia.length}</strong></div>
            <div><span>Unusual types</span><strong>{contentInsights.nonImageMedia.length}</strong></div>
          </div>
          <div className="plusmit-dashboard__checkList plusmit-dashboard__checkList--spaced">
            {performanceChecks.map((check) => (
              <span data-ready={check.ready} key={check.label}>{check.label}</span>
            ))}
          </div>
          {contentInsights.largeMedia.length ? (
            <div className="plusmit-dashboard__watchList plusmit-dashboard__watchList--compact">
              {contentInsights.largeMedia.slice(0, 3).map((item) => (
                <Link href={adminPath('/collections/media')} key={`${item.id || item.filename}`}>
                  <strong>{item.title || item.filename || 'Untitled media'}</strong>
                  <span>{formatBytes(item.filesize)} - {item.mimeType || 'unknown type'}</span>
                </Link>
              ))}
            </div>
          ) : null}
          <Link className="plusmit-dashboard__inlineAction" href={adminPath('/collections/media')}>
            Review media library
          </Link>
        </div>
      </section>

      <section className="plusmit-dashboard__grid">
        <div className="plusmit-dashboard__panel">
          <div className="plusmit-dashboard__panelHeader">
            <h2>Publishing checklist</h2>
            <p>Homepage and public content readiness.</p>
          </div>
          <div className="plusmit-dashboard__checkList">
            <span data-ready={Boolean(contentInsights.homePage)}>Homepage exists</span>
            <span data-ready={contentInsights.homePage?.status === 'published'}>Homepage published</span>
            <span data-ready={homeHasHero}>Homepage has hero/title</span>
            <span data-ready={homeHasConversion}>Homepage has CTA/contact path</span>
            <span data-ready={contentInsights.socialReady >= contentInsights.publishedPages.length}>Published pages have social images</span>
          </div>
        </div>

        <div className="plusmit-dashboard__panel">
          <div className="plusmit-dashboard__panelHeader">
            <h2>Lead workflow</h2>
            <p>Current intake status distribution.</p>
          </div>
          <div className="plusmit-dashboard__healthGrid">
            <div><span>New</span><strong>{newLeads}</strong></div>
            <div><span>Reviewing</span><strong>{reviewingLeads}</strong></div>
            <div><span>Contacted</span><strong>{contactedLeads}</strong></div>
            <div><span>Closed</span><strong>{closedLeads}</strong></div>
          </div>
          {spamLeads ? (
            <p className="plusmit-dashboard__note">{spamLeads} lead submissions are marked as spam.</p>
          ) : null}
          <Link className="plusmit-dashboard__inlineAction" href={adminPath('/collections/lead-submissions')}>
            Review leads
          </Link>
        </div>
      </section>

      <section className="plusmit-dashboard__status">
        <div>
          <span>Domain</span>
          <strong>{setup.domain}</strong>
        </div>
        <div>
          <span>Public email</span>
          <strong>{setup.publicEmail}</strong>
        </div>
        <div>
          <span>Primary CTA</span>
          <strong>{setup.ctaLabel}</strong>
        </div>
        <div>
          <span>Website theme</span>
          <strong>{setup.themeMode}</strong>
        </div>
      </section>
    </main>
  )
}
