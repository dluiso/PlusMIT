import type { Metadata } from 'next'
import '@/styles/globals.css'
import { Analytics } from '@/components/Analytics'
import { ConsentBanner } from '@/components/ConsentBanner'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { MobileNavigation } from '@/components/MobileNavigation'
import { getPayloadClient } from '@/lib/payload'
import { getPublicSettings, themeStyle } from '@/lib/public-settings'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings()

  return {
    title: settings.site.companyName,
    description: settings.site.tagline,
    metadataBase: new URL(settings.site.primaryDomain),
    icons: settings.branding.favicon?.url ? { icon: settings.branding.favicon.url } : undefined,
  }
}

async function getNavigation(location: 'main' | 'mobile' | 'footer') {
  const payload = await getPayloadClient()
  const result = await payload
    .find({
      collection: 'navigation',
      where: { location: { equals: location } },
      limit: 1,
      depth: 1,
    })
    .catch(() => ({ docs: [] }))

  return result.docs[0]?.items || []
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const [settings, mainNav, mobileNav] = await Promise.all([
    getPublicSettings(),
    getNavigation('main'),
    getNavigation('mobile'),
  ])

  if (settings.site.maintenanceMode) {
    return (
      <html
        data-theme={settings.branding.defaultThemeMode}
        lang="en"
        style={themeStyle(settings)}
        suppressHydrationWarning
      >
        <body suppressHydrationWarning>
          <main className="container grid min-h-screen place-items-center py-20">
            <div className="surface max-w-xl p-8 text-center">
              <h1 className="text-3xl font-bold">Maintenance in progress</h1>
              <p className="mt-4 text-[var(--color-muted)]">{settings.site.maintenanceMessage}</p>
            </div>
          </main>
        </body>
      </html>
    )
  }

  return (
    <html
      data-theme={settings.branding.defaultThemeMode}
      lang="en"
      style={themeStyle(settings)}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <Analytics
          enabled={settings.site.analytics.enabled}
          gaMeasurementId={settings.site.analytics.gaMeasurementId}
          gtmId={settings.site.analytics.gtmId}
        />
        {settings.site.announcementEnabled && settings.site.announcementText ? (
          <a
            className="block border-b border-cyan-300/20 bg-[var(--color-primary)] px-4 py-2 text-center text-sm font-semibold text-[var(--color-bg)]"
            href={settings.site.announcementLink || '#'}
          >
            {settings.site.announcementText}
          </a>
        ) : null}
        <Header
          companyName={settings.site.companyName}
          ctaLabel={settings.site.defaultCtaLabel}
          ctaUrl={settings.site.defaultCtaUrl}
          hideCompanyName={settings.branding.hideCompanyNameInHeader}
          items={mainNav}
          logo={
            settings.branding.defaultThemeMode === 'dark'
              ? settings.branding.darkLogo || settings.branding.logo
              : settings.branding.logo || settings.branding.darkLogo
          }
        />
        <main>{children}</main>
        <Footer
          companyName={settings.site.companyName}
          footerText={settings.site.footerText}
          tagline={settings.site.tagline}
          legalLinks={settings.site.legalLinks}
          socialLinks={settings.site.socialLinks}
          publicEmail={settings.site.publicEmail}
          phoneNumber={settings.site.phoneNumber}
        />
        <MobileNavigation
          ctaLabel={settings.site.defaultCtaLabel}
          ctaUrl={settings.site.defaultCtaUrl}
          items={mobileNav}
        />
        <ConsentBanner companyName={settings.site.companyName} enabled={settings.site.analytics.enabled} />
      </body>
    </html>
  )
}
