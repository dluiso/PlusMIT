import Link from 'next/link'
import type { AdminViewServerProps } from 'payload'

type CountSlug = 'case-studies' | 'industries' | 'lead-submissions' | 'media' | 'pages' | 'posts' | 'services' | 'testimonials'

type DashboardPayload = {
  count: (options: { collection: CountSlug }) => Promise<{ totalDocs: number }>
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
  { label: 'Pages', slug: 'pages', href: '/admin/collections/pages' },
  { label: 'Services', slug: 'services', href: '/admin/collections/services' },
  { label: 'Leads', slug: 'lead-submissions', href: '/admin/collections/lead-submissions' },
  { label: 'Resources', slug: 'posts', href: '/admin/collections/posts' },
  { label: 'Media', slug: 'media', href: '/admin/collections/media' },
  { label: 'Reviews', slug: 'testimonials', href: '/admin/collections/testimonials' },
]

const quickLinks = [
  { label: 'Edit Homepage', href: '/admin/collections/pages?where[slug][equals]=home', description: 'Hero, homepage blocks, and SEO.' },
  { label: 'Create Service', href: '/admin/collections/services/create', description: 'Add a new service page.' },
  { label: 'Lead Submissions', href: '/admin/collections/lead-submissions', description: 'Review form requests.' },
  { label: 'Navigation', href: '/admin/collections/navigation', description: 'Header and footer menus.' },
  { label: 'Site Settings', href: '/admin/globals/site-settings', description: 'Company, contact, analytics, and footer.' },
  { label: 'Branding', href: '/admin/globals/branding', description: 'Logo, colors, radius, and theme presets.' },
]

async function safeCount(payload: DashboardPayload, slug: CountSlug) {
  try {
    const result = await payload.count({ collection: slug })
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
          <Link className="plusmit-dashboard__button" href="/admin/globals/site-settings">
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
                <Link href="/admin/collections/lead-submissions" key={`${lead.email || 'lead'}-${index}`}>
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
