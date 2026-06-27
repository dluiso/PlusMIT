import type { Metadata } from 'next'
import '@/styles/globals.css'
import { Analytics } from '@/components/Analytics'
import { ConsentBanner } from '@/components/ConsentBanner'
import { getPublicSettings, themeStyle } from '@/lib/public-settings'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'PlusMIT',
  description: 'Modern IT support, automation, cloud, web, and recovery services.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getPublicSettings()

  return (
    <html lang="en" style={themeStyle(settings)}>
      <body>
        <Analytics
          enabled={settings.site.analytics.enabled}
          gaMeasurementId={settings.site.analytics.gaMeasurementId}
          gtmId={settings.site.analytics.gtmId}
        />
        {children}
        <ConsentBanner enabled={settings.site.analytics.enabled} />
      </body>
    </html>
  )
}
