'use client'

import Script from 'next/script'

type Props = {
  gaMeasurementId?: string
  gtmId?: string
  enabled?: boolean
}

export function Analytics({ enabled, gaMeasurementId, gtmId }: Props) {
  if (!enabled) return null
  const safeGtmId = gtmId && /^GTM-[A-Z0-9]+$/i.test(gtmId) ? gtmId : ''
  const safeGaMeasurementId = gaMeasurementId && /^G-[A-Z0-9]+$/i.test(gaMeasurementId) ? gaMeasurementId : ''

  return (
    <>
      {safeGtmId ? (
        <Script id="gtm" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
          var f = document.getElementsByTagName('script')[0],
          j = document.createElement('script'), dl = 'dataLayer' != 'dataLayer' ? '&l=' + 'dataLayer' : '';
          j.async = true; j.src = 'https://www.googletagmanager.com/gtm.js?id=${safeGtmId}' + dl;
          f.parentNode.insertBefore(j, f);
        `}</Script>
      ) : null}
      {safeGaMeasurementId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${safeGaMeasurementId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${safeGaMeasurementId}', { anonymize_ip: true });
          `}</Script>
        </>
      ) : null}
    </>
  )
}
