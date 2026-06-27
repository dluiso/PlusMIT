'use client'

import { useEffect, useState } from 'react'

export function ConsentBanner({ companyName = 'PlusMIT', enabled }: { companyName?: string; enabled: boolean }) {
  const [visible, setVisible] = useState(() =>
    typeof window !== 'undefined'
      ? enabled && localStorage.getItem('plusmit-analytics-consent') !== 'accepted'
      : false,
  )

  useEffect(() => {
    const id = window.setTimeout(() => {
      setVisible(enabled && localStorage.getItem('plusmit-analytics-consent') !== 'accepted')
    }, 0)
    return () => window.clearTimeout(id)
  }, [enabled])

  if (!visible) return null

  return (
    <div className="fixed bottom-20 left-3 right-3 z-50 mx-auto max-w-3xl rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-2xl md:bottom-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-[var(--color-muted)]">
          {companyName} uses privacy-conscious analytics when enabled to improve the website experience.
        </p>
        <button
          className="button"
          onClick={() => {
            localStorage.setItem('plusmit-analytics-consent', 'accepted')
            setVisible(false)
          }}
        >
          Accept
        </button>
      </div>
    </div>
  )
}
