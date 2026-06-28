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
    <header className="site-header sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-header)] backdrop-blur-xl">
      <div className="site-header__inner container flex min-h-[74px] items-center justify-between gap-4">
        <Link href="/" className="site-header__brand flex items-center gap-3 font-bold">
          {logo?.url ? (
            <Image
              alt={logo.alt || companyName}
              className="site-header__logo h-10 w-auto max-w-40 object-contain"
              height={logo.height || 40}
              sizes="(max-width: 768px) 140px, 160px"
              src={logo.url}
              width={logo.width || 160}
            />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-ui)] bg-[var(--color-primary)] text-white shadow-lg shadow-blue-500/20">
              +
            </span>
          )}
          {showCompanyName ? <span className="site-header__name text-lg font-black">{companyName}</span> : null}
        </Link>
        <nav className="site-header__nav hidden items-center gap-8 text-sm font-semibold text-[var(--color-muted)] md:flex" aria-label="Main navigation">
          {visibleItems.map((item) => (
            <a className="transition hover:text-[var(--color-primary)]" key={`${item.label}-${item.url}`} href={item.url || '#'}>
              {item.label}
            </a>
          ))}
        </nav>
        <a className="button site-header__cta hidden md:inline-flex" href={ctaUrl}>
          {ctaLabel} <span aria-hidden="true">-&gt;</span>
        </a>
      </div>
    </header>
  )
}
