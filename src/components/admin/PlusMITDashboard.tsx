import Link from 'next/link'
import type { AdminViewServerProps } from 'payload'
import { adminPath } from '@/lib/admin-route'

type CountSlug = 'case-studies' | 'industries' | 'lead-submissions' | 'media' | 'pages' | 'posts' | 'services' | 'testimonials'

type DashboardPayload = {
  count: (options: { collection: CountSlug; where?: Record<string, unknown> }) => Promise<{ totalDocs: number }>
  find: (options: { collection: 'lead-submissions'; limit: number; sort: string }) => Promise<{ docs: LatestLead[] }>
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

    return result.docs
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

function getLeadFormSource(lead: LatestLead) {
  if (typeof lead.formSource === 'object' && lead.formSource && 'name' in lead.formSource) {
    return lead.formSource.name || 'Website form'
  }

  return 'Website form'
}

export async function PlusMITDashboard(props: AdminViewServerProps) {
  const payload = props.initPageResult.req.payload as unknown as DashboardPayload
  const [counts, latestLeads, setup] = await Promise.all([
    Promise.all(metrics.map(async (metric) => [metric.slug, await safeCount(payload, metric.slug)] as const)),
    getLatestLeads(payload),
    getSetupStatus(payload),
  ])
  const [publishedPages, draftPages, newLeads, publishedServices] = await Promise.all([
    safeCountWhere(payload, 'pages', { status: { equals: 'published' } }),
    safeCountWhere(payload, 'pages', { status: { equals: 'draft' } }),
    safeCountWhere(payload, 'lead-submissions', { status: { equals: 'new' } }),
    safeCountWhere(payload, 'services', { status: { equals: 'published' } }),
  ])

  const countMap = Object.fromEntries(counts) as Record<CountSlug, number>

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
          </div>
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
