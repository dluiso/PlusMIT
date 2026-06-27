import Image from 'next/image'
import Link from 'next/link'
import type { MediaInfo } from '@/lib/media'

type NavItem = {
  label?: string
  url?: string
  visible?: boolean | null
  children?: NavItem[] | null
}

type Props = {
  companyName: string
  ctaLabel: string
  ctaUrl: string
  hideCompanyName?: boolean
  items?: NavItem[]
  logo?: MediaInfo | null
}

export function Header({ companyName, ctaLabel, ctaUrl, hideCompanyName = false, items = [], logo }: Props) {
  const visibleItems = items.filter((item) => item.visible !== false)
  const showCompanyName = !hideCompanyName || !logo?.url

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-header)] backdrop-blur-xl">
      <div className="container flex min-h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 font-bold">
          {logo?.url ? (
            <Image
              alt={logo.alt || companyName}
              className="h-10 w-auto max-w-40 object-contain"
              height={logo.height || 40}
              sizes="(max-width: 768px) 140px, 160px"
              src={logo.url}
              width={logo.width || 160}
            />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-primary)] text-[var(--color-bg)]">
              +
            </span>
          )}
          {showCompanyName ? <span>{companyName}</span> : null}
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-[var(--color-muted)] md:flex" aria-label="Main navigation">
          {visibleItems.map((item) => (
            <a key={`${item.label}-${item.url}`} href={item.url || '#'}>
              {item.label}
            </a>
          ))}
        </nav>
        <a className="button hidden md:inline-flex" href={ctaUrl}>
          {ctaLabel}
        </a>
      </div>
    </header>
  )
}
