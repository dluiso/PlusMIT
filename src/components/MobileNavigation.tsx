type MobileItem = { label?: string; url?: string; visible?: boolean | null }

const fallbackItems: MobileItem[] = [
  { label: 'Home', url: '/' },
  { label: 'Services', url: '/services' },
  { label: 'Industries', url: '/industries' },
  { label: 'Contact', url: '/contact' },
]

export function MobileNavigation({
  items,
}: {
  ctaUrl?: string
  ctaLabel?: string
  items?: MobileItem[]
}) {
  const links = (items?.length ? items : fallbackItems).filter((item) => item.visible !== false).slice(0, 4)

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-header)] px-3 py-2 backdrop-blur-xl md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="grid grid-cols-4 gap-1">
        {links.map((item) => (
          <a
            className="rounded-lg px-2 py-2 text-center text-xs font-semibold text-[var(--color-muted)]"
            key={`${item.label}-${item.url}`}
            href={item.url || '#'}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  )
}
