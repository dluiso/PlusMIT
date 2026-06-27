import Link from 'next/link'

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
  items?: NavItem[]
}

export function Header({ companyName, ctaLabel, ctaUrl, items = [] }: Props) {
  const visibleItems = items.filter((item) => item.visible !== false)

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="container flex min-h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 font-bold">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400 text-slate-950">
            +
          </span>
          <span>{companyName}</span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-slate-200 md:flex" aria-label="Main navigation">
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
