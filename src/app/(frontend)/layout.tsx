import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { MobileNavigation } from '@/components/MobileNavigation'
import { getPayloadClient } from '@/lib/payload'
import { getPublicSettings } from '@/lib/public-settings'

export const dynamic = 'force-dynamic'

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
      <main className="container grid min-h-screen place-items-center py-20">
        <div className="surface max-w-xl p-8 text-center">
          <h1 className="text-3xl font-bold">Maintenance in progress</h1>
          <p className="mt-4 text-slate-300">{settings.site.maintenanceMessage}</p>
        </div>
      </main>
    )
  }

  return (
    <>
      {settings.site.announcementEnabled && settings.site.announcementText ? (
        <a
          className="block border-b border-cyan-300/20 bg-cyan-400 px-4 py-2 text-center text-sm font-semibold text-slate-950"
          href={settings.site.announcementLink || '#'}
        >
          {settings.site.announcementText}
        </a>
      ) : null}
      <Header
        companyName={settings.site.companyName}
        ctaLabel={settings.site.defaultCtaLabel}
        ctaUrl={settings.site.defaultCtaUrl}
        items={mainNav}
      />
      <main>{children}</main>
      <Footer
        companyName={settings.site.companyName}
        footerText={settings.site.footerText}
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
    </>
  )
}
